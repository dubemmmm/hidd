/**
 * Seed the existing FAQ list into Sanity (including internal notes).
 *
 * Dry run (default, no token needed):
 *   node --experimental-strip-types scripts/seed-faqs.ts
 *
 * Write to Sanity (needs a write token):
 *   SANITY_API_WRITE_TOKEN=sk... node --experimental-strip-types scripts/seed-faqs.ts --commit
 *
 * Documents use a deterministic _id (`faq.<id>`) so re-running is idempotent
 * (createOrReplace), and slug.current keeps the original id used by service links.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { faqs } from "../lib/data/faqs.ts";

const here = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(here, "..", ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // No .env.local — rely on real process env.
  }
}

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09";
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN ?? "";

const commit = process.argv.includes("--commit");

const documents = faqs.map((faq, index) => ({
  _id: `faq.${faq.id}`,
  _type: "faq",
  question: faq.question,
  slug: { _type: "slug", current: faq.id },
  category: faq.category,
  answer: faq.answer,
  ...(faq.internalNote ? { internalNote: faq.internalNote } : {}),
  displayOrder: index
}));

const withNotes = documents.filter((doc) => "internalNote" in doc).length;

console.log(`Prepared ${documents.length} FAQ documents (${withNotes} with an internal note).`);

if (!commit) {
  console.log("\nDRY RUN — nothing was written. Sample document:");
  console.log(JSON.stringify(documents[8] ?? documents[0], null, 2));
  console.log("\nRe-run with --commit (and a write token) to push to Sanity.");
  process.exit(0);
}

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}

if (!token || token.includes("REPLACE_ME") || token === "your_read_token") {
  console.error(
    "Missing a real write token. Set SANITY_API_WRITE_TOKEN to a token with write access."
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const tx = documents.reduce((transaction, doc) => transaction.createOrReplace(doc), client.transaction());

tx.commit()
  .then(() => {
    console.log(`Done. Wrote ${documents.length} FAQ documents to dataset "${dataset}".`);
  })
  .catch((error) => {
    console.error("Failed to write FAQs to Sanity:");
    console.error(error?.message ?? error);
    process.exit(1);
  });
