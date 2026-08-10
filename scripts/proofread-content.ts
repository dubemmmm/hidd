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

type ContentRecord = {
  _id: string;
  _type: "post" | "caseStudy";
  title?: string;
  metaTitle?: string;
  readTime?: string;
};

let documents: ContentRecord[] = [];
try {
  documents = await client.fetch<ContentRecord[]>(
    `*[_type in ["post", "caseStudy"]]{_id, _type, title, metaTitle, readTime}`
  );
} catch {
  console.error("Unable to reach Sanity for the proofreading audit.");
  process.exit(1);
}

const findings: Array<{ id: string; field: string; issue: string; value: string }> = [];
const readTimePattern = /^\d+ min read$/;

for (const document of documents) {
  const fields = [
    ["title", document.title],
    ["metaTitle", document.metaTitle]
  ] as const;

  for (const [field, value] of fields) {
    if (!value) continue;
    if ((value.match(/"/g) ?? []).length % 2 !== 0) {
      findings.push({ id: document._id, field, issue: "unmatched quotation mark", value });
    }
    if (/\b([a-z]+)\s+\1\b/i.test(value)) {
      findings.push({ id: document._id, field, issue: "repeated word", value });
    }
    if (/\s{2,}/.test(value) || value !== value.trim()) {
      findings.push({ id: document._id, field, issue: "irregular spacing", value });
    }
  }

  if (document.metaTitle && /(?:\||-|–|—)\s*HIDD Advisory\s*$/i.test(document.metaTitle)) {
    findings.push({
      id: document._id,
      field: "metaTitle",
      issue: "site name will be added by the layout",
      value: document.metaTitle
    });
  }

  if (!document.readTime || !readTimePattern.test(document.readTime)) {
    findings.push({
      id: document._id,
      field: "readTime",
      issue: "use the format “6 min read”",
      value: document.readTime ?? ""
    });
  }
}

console.log(`Proofread ${documents.length} published articles and case studies.`);
console.log(findings.length === 0 ? "No formatting issues found." : findings);
