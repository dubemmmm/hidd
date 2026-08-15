import "server-only";

import { createHash } from "node:crypto";

import type { SavedNarration } from "@/lib/types";

type PortableTextChild = {
  _type?: string;
  text?: string;
};

type PortableTextBlock = {
  _type?: string;
  style?: string;
  children?: PortableTextChild[];
};

type NarrationContentDocument = {
  title?: string;
  excerpt?: string;
  summary?: string;
  preventedRisk?: string;
  body?: unknown[];
};

type NarrationDocument = NarrationContentDocument & {
  narrationEnabled?: boolean;
  narrationVoice?: string;
  narrationPronunciationNotes?: string;
  narration?: SavedNarration & { sourceHash?: string };
};

export const DEFAULT_NARRATION_VOICE = "cedar";
export const NARRATION_MODEL = "gpt-4o-mini-tts";
export const NARRATION_SAMPLE_RATE = 24_000;
export const NARRATION_BYTES_PER_SAMPLE = 2;

function cleanNarrationText(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*_`#>~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function portableTextToParagraphs(body: unknown): string[] {
  if (!Array.isArray(body)) return [];

  return (body as PortableTextBlock[]).flatMap((block) => {
    if (block?._type !== "block") return [];
    const text = cleanNarrationText(
      (block.children ?? [])
        .filter((child) => child?._type === "span" && typeof child.text === "string")
        .map((child) => child.text)
        .join("")
    );
    return text ? [text] : [];
  });
}

export function createNarrationScript(document: NarrationContentDocument): string {
  const title = cleanNarrationText(document.title ?? "");
  const introduction = cleanNarrationText(document.excerpt ?? document.summary ?? "");
  const paragraphs = portableTextToParagraphs(document.body);
  const preventedRisk = cleanNarrationText(document.preventedRisk ?? "");

  return [
    title,
    introduction,
    ...paragraphs,
    preventedRisk ? `What HIDD prevented. ${preventedRisk}` : ""
  ]
    .filter(Boolean)
    .filter((part, index, all) => index === 0 || part !== all[index - 1])
    .join("\n\n")
    .trim();
}

export function createNarrationSourceHash(
  script: string,
  voice: string,
  pronunciationNotes?: string
): string {
  return createHash("sha256")
    .update(JSON.stringify({
      script,
      voice,
      pronunciationNotes: pronunciationNotes?.trim().slice(0, 800) ?? ""
    }))
    .digest("hex");
}

export function getCurrentNarration(document: NarrationDocument): SavedNarration | undefined {
  if (!document.narrationEnabled || !document.narration?.audioUrl) return undefined;

  const script = createNarrationScript(document);
  if (!script) return undefined;

  const voice = document.narrationVoice || DEFAULT_NARRATION_VOICE;
  const currentHash = createNarrationSourceHash(
    script,
    voice,
    document.narrationPronunciationNotes
  );

  return document.narration.sourceHash === currentHash ? document.narration : undefined;
}

export function splitNarrationScript(script: string, maxCharacters = 5_000): string[] {
  const paragraphs = script.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  const chunks: string[] = [];
  let current = "";

  const pushCurrent = () => {
    if (!current) return;
    chunks.push(current);
    current = "";
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxCharacters) {
      const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
      if (candidate.length <= maxCharacters) {
        current = candidate;
      } else {
        pushCurrent();
        current = paragraph;
      }
      continue;
    }

    pushCurrent();
    const sentences = paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [paragraph];
    for (const rawSentence of sentences) {
      const sentence = rawSentence.trim();
      if (!sentence) continue;
      if (sentence.length > maxCharacters) {
        for (let start = 0; start < sentence.length; start += maxCharacters) {
          chunks.push(sentence.slice(start, start + maxCharacters).trim());
        }
        continue;
      }
      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length <= maxCharacters) {
        current = candidate;
      } else {
        pushCurrent();
        current = sentence;
      }
    }
  }

  pushCurrent();
  return chunks;
}

export function pcmToWav(pcm: Buffer): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = NARRATION_SAMPLE_RATE * NARRATION_BYTES_PER_SAMPLE;
  const blockAlign = NARRATION_BYTES_PER_SAMPLE;

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(NARRATION_SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]);
}

export function narrationDurationSeconds(pcmByteLength: number): number {
  return pcmByteLength / (NARRATION_SAMPLE_RATE * NARRATION_BYTES_PER_SAMPLE);
}
