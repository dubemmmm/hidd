import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { faqs } from "../lib/data/faqs.ts";

const here = path.dirname(fileURLToPath(import.meta.url));

try {
  const raw = readFileSync(path.join(here, "..", ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    if (!(key in process.env)) process.env[key] = trimmed.slice(separator + 1).trim();
  }
} catch {}

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("A Sanity write token is required.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09",
  token,
  useCdn: false,
  perspective: "raw"
});

const faqIds = [
  "comprehensive-report",
  "fee-coverage",
  "four-services",
  "how-the-process-works",
  "inspection-equipment",
  "interactive-risk-map",
  "payment-terms",
  "privacy-security",
  "pricing-flat-fee",
  "single-or-bundled-services"
];

const answers = new Map(
  faqs.filter((faq) => faqIds.includes(faq.id)).map((faq) => [faq.id, faq.answer])
);

type FaqRecord = {
  _id: string;
  slug?: string | null;
  question?: string | null;
};

let existingFaqs: FaqRecord[] = [];
try {
  existingFaqs = await client.fetch<FaqRecord[]>(
    `*[_type == "faq" && (slug.current in $faqIds || question == $privacyQuestion)]{
      _id,
      "slug": slug.current,
      question
    }`,
    {
      faqIds,
      privacyQuestion: "How secure is my information?"
    }
  );
} catch {
  console.error("Unable to read the FAQ documents from Sanity.");
  process.exit(1);
}

let transaction = client.transaction();
for (const faq of existingFaqs) {
  const faqId =
    faq.slug ?? (faq.question === "How secure is my information?" ? "privacy-security" : "");
  const answer = answers.get(faqId);
  if (answer) transaction = transaction.patch(faq._id, { set: { answer } });
}

try {
  await transaction.commit();
  console.log(`Updated ${existingFaqs.length} published or draft FAQ documents.`);
  const privacyFaqs = await client.fetch<Array<{ _id: string; answer?: string }>>(
    `*[_type == "faq" && (slug.current == "privacy-security" || question == "How secure is my information?")]{_id, answer}`
  );
  for (const privacyFaq of privacyFaqs) {
    console.log(`Privacy FAQ ${privacyFaq._id}: ${privacyFaq.answer ?? "No answer"}`);
  }
} catch {
  console.error("Unable to update the FAQ documents in Sanity.");
  process.exit(1);
}
