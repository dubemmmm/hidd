import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09",
  token: process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
  perspective: "published"
});

const phrases = [
  "current map behavior",
  "browse layer",
  "commercial layer",
  "serious buyers need evidence, not noise",
  "diligence stack",
  "authority asset",
  "pricing theatre",
  "friction removed",
  "service vertical",
  "single vertical",
  "four verticals",
  "flagship product",
  "launch neighbourhood",
  "premium inspection tier",
  "premium tier",
  "full payment is required upfront",
  "payment in full before",
  "no exceptions",
  "five neighbourhoods",
  "five launch neighbourhoods"
];

const gmailAddressPattern = /[a-z0-9._%+-]+@gmail\.com/i;

let documents: Array<Record<string, unknown>> = [];

try {
  documents = await client.fetch<Array<Record<string, unknown>>>(
    `*[_type in ["faq", "reportAsset", "post", "caseStudy", "mapArea", "socialProof"]]{
      _id,
      _type,
      title,
      question,
      answer,
      summary,
      headline,
      description,
      quote,
      framingNote,
      briefBody,
      body
    }`
  );
} catch {
  console.error("Unable to reach Sanity for the published-copy audit.");
  process.exit(1);
}

const findings: Array<{ id: string; type: string; phrase: string }> = [];

for (const document of documents) {
  const searchable = JSON.stringify(document).toLowerCase();
  if (gmailAddressPattern.test(searchable)) {
    findings.push({
      id: String(document._id),
      type: String(document._type),
      phrase: "gmail address"
    });
  }
  for (const phrase of phrases) {
    if (searchable.includes(phrase)) {
      findings.push({
        id: String(document._id),
        type: String(document._type),
        phrase
      });
    }
  }
}

console.log(`Audited ${documents.length} published customer-facing Sanity documents.`);
console.log(findings.length === 0 ? "No flagged phrases found." : findings);
