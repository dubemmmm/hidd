import { revalidatePath } from "next/cache";
import { after, type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import {
  createNarrationScript,
  createNarrationSourceHash,
  DEFAULT_NARRATION_VOICE,
  narrationDurationSeconds,
  NARRATION_MODEL,
  pcmToWav,
  splitNarrationScript
} from "@/lib/narration";
import { sanityHasWriteToken, sanityWriteClient } from "@/lib/sanity.server";

export const runtime = "nodejs";
export const maxDuration = 300;

type NarrationWebhookPayload = {
  _id?: string;
  _type?: "post" | "caseStudy";
};

type NarrationSourceDocument = {
  _id: string;
  _rev: string;
  _type: "post" | "caseStudy";
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  summary?: string;
  preventedRisk?: string;
  body?: unknown[];
  narrationEnabled?: boolean;
  narrationVoice?: string;
  narrationPronunciationNotes?: string;
  narration?: {
    sourceHash?: string;
    audio?: { asset?: { _ref?: string } };
  };
};

const narrationDocumentQuery = `
  *[_id == $id && _type in ["post", "caseStudy"]][0] {
    _id,
    _rev,
    _type,
    title,
    slug,
    excerpt,
    summary,
    preventedRisk,
    body,
    narrationEnabled,
    narrationVoice,
    narrationPronunciationNotes,
    narration { sourceHash, audio { asset } }
  }
`;

function safeFilename(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "hidd-narration";
}

async function createSpeechChunk(
  input: string,
  voice: string,
  pronunciationNotes: string,
  apiKey: string
): Promise<Buffer> {
  const instructions = [
    "Read this property advisory content in a calm, measured, authoritative professional tone.",
    "Use clear natural pacing and Nigerian English pronunciation where appropriate.",
    "Do not add, omit, summarize, or editorialize any content.",
    pronunciationNotes ? `Pronunciation guidance from the editor: ${pronunciationNotes}` : ""
  ].filter(Boolean).join(" ");

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: NARRATION_MODEL,
      voice,
      input,
      instructions,
      response_format: "pcm"
    }),
    signal: AbortSignal.timeout(120_000)
  });

  if (!response.ok) {
    const problem = await response.text();
    throw new Error(`Speech generation failed (${response.status}): ${problem.slice(0, 240)}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function generateNarration(
  body: Required<NarrationWebhookPayload>,
  openAiApiKey: string
): Promise<void> {
  const publishedId = body._id.replace(/^drafts\./, "");
  const document = await sanityWriteClient.fetch<NarrationSourceDocument | null>(
    narrationDocumentQuery,
    { id: publishedId },
    { perspective: "published" }
  );

  if (!document || !document.narrationEnabled) {
    return;
  }

  const script = createNarrationScript(document);
  if (script.length < 40) {
    throw new Error("The document does not contain enough readable text.");
  }
  if (script.length > 60_000) {
    throw new Error("The narration source exceeds the configured length limit.");
  }

  const voice = document.narrationVoice || DEFAULT_NARRATION_VOICE;
  const pronunciationNotes = document.narrationPronunciationNotes?.trim().slice(0, 800) ?? "";
  const sourceHash = createNarrationSourceHash(script, voice, pronunciationNotes);

  if (document.narration?.sourceHash === sourceHash && document.narration.audio?.asset?._ref) {
    return;
  }

  const chunks = splitNarrationScript(script);
  const pcmParts = await Promise.all(
    chunks.map((chunk) => createSpeechChunk(chunk, voice, pronunciationNotes, openAiApiKey))
  );
  const pause = Buffer.alloc(12_000);
  const pcm = Buffer.concat(
    pcmParts.flatMap((part, index) => index === pcmParts.length - 1 ? [part] : [part, pause])
  );
  const wav = pcmToWav(pcm);
  const filename = `${safeFilename(document.slug?.current || document.title || publishedId)}-narration.wav`;
  const asset = await sanityWriteClient.assets.upload("file", wav, {
    filename,
    contentType: "audio/wav",
    title: `${document.title || "HIDD content"} — audio narration`
  });

  await sanityWriteClient
    .patch(publishedId)
    .ifRevisionId(document._rev)
    .set({
      narration: {
        _type: "narration",
        audio: {
          _type: "file",
          asset: { _type: "reference", _ref: asset._id }
        },
        durationSeconds: Math.round(narrationDurationSeconds(pcm.length)),
        voice,
        model: NARRATION_MODEL,
        generatedAt: new Date().toISOString(),
        sourceHash,
        aiGenerated: true
      }
    })
    .commit();

  const slug = document.slug?.current;
  if (slug) {
    revalidatePath(document._type === "post" ? `/insights/${slug}` : `/case-studies/${slug}`);
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.SANITY_NARRATION_WEBHOOK_SECRET;
  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (!webhookSecret || !openAiApiKey || !sanityHasWriteToken) {
    return NextResponse.json(
      { error: "Narration generation is not configured." },
      { status: 503 }
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<NarrationWebhookPayload>(
      request,
      webhookSecret,
      true
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    if (!body?._id || !body?._type || !["post", "caseStudy"].includes(body._type)) {
      return NextResponse.json({ error: "Unsupported narration document." }, { status: 400 });
    }

    const narrationBody = body as Required<NarrationWebhookPayload>;
    after(async () => {
      try {
        await generateNarration(narrationBody, openAiApiKey);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown narration generation error";
        console.error("Narration background generation failed:", message);
      }
    });

    return NextResponse.json(
      { status: "accepted", documentId: narrationBody._id.replace(/^drafts\./, "") },
      { status: 202 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown narration generation error";
    console.error("Narration generation failed:", message);
    return NextResponse.json(
      { error: "Narration generation failed. Review the webhook attempt logs for details." },
      { status: 500 }
    );
  }
}
