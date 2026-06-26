/**
 * Diagnostic: confirm the FAQ read path (authenticated, published perspective)
 * returns the Sanity documents the site will render.
 *   node --experimental-strip-types scripts/check-faqs.ts
 * Reads the token from .env.local internally; never prints it.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

try {
  const raw = readFileSync(path.join(here, "..", ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    if (!(k in process.env)) process.env[k] = t.slice(eq + 1).trim();
  }
} catch {}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09";
const isUsable = (v: string | undefined): v is string =>
  Boolean(v) && !v!.includes("REPLACE_ME") && v !== "your_read_token";

const token = [process.env.SANITY_API_READ_TOKEN, process.env.SANITY_API_WRITE_TOKEN].find(isUsable) ?? "";
const usableToken = isUsable(token);

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: usableToken ? token : undefined,
  useCdn: false,
  perspective: "published"
});

// Same projection the site uses (internalNote intentionally NOT selected).
const query =
  '*[_type == "faq"] | order(displayOrder asc, _createdAt asc) { "id": slug.current, category, question, answer }';

const faqs = await client.fetch<Array<{ id: string; question: string }>>(query);

console.log(`Using server token: ${usableToken}`);
console.log(`FAQs returned by the site's read path: ${faqs.length}`);
console.log("First 3:", faqs.slice(0, 3).map((f) => f.id));

const anon = createClient({ projectId, dataset, apiVersion, useCdn: false });
const anonFaqs = await anon.fetch<unknown[]>('*[_type == "faq"]._id');
console.log(`\nAnonymous read (what proves the restriction): ${anonFaqs.length} FAQs`);
