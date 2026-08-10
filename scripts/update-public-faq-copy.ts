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
  useCdn: false
});

const faqIds = [
  "comprehensive-report",
  "fee-coverage",
  "four-services",
  "how-the-process-works",
  "inspection-equipment",
  "interactive-risk-map",
  "payment-terms",
  "pricing-flat-fee",
  "single-or-bundled-services"
];

const answers = new Map(
  faqs.filter((faq) => faqIds.includes(faq.id)).map((faq) => [faq.id, faq.answer])
);

const documentIds = faqIds.flatMap((id) => [`faq.${id}`, `drafts.faq.${id}`]);

let existingIds: string[] = [];
try {
  existingIds = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: documentIds });
} catch {
  console.error("Unable to read the FAQ documents from Sanity.");
  process.exit(1);
}

let transaction = client.transaction();
for (const documentId of existingIds) {
  const faqId = documentId.replace(/^drafts\./, "").replace(/^faq\./, "");
  const answer = answers.get(faqId);
  if (answer) transaction = transaction.patch(documentId, { set: { answer } });
}

try {
  await transaction.commit();
  console.log(`Updated ${existingIds.length} published or draft FAQ documents.`);
} catch {
  console.error("Unable to update the FAQ documents in Sanity.");
  process.exit(1);
}
