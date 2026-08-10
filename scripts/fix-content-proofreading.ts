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

const corrections: Record<string, Record<string, string>> = {
  "1138822d-066e-4ce1-8a46-39477b1c5382": {
    metaTitle: "Property Due Diligence in Lagos: What Your Documents Prove",
    readTime: "6 min read"
  },
  "4a27ee25-107b-421a-a769-c3fabfe81fe6": {
    metaTitle: "Land Charting: A Parcel Sitting on a Drainage Alignment"
  },
  "88470a7e-dd96-4349-8191-1577d5761d75": {
    title: "C of O In Progress in Lagos: What It Actually Means",
    metaTitle: "C of O In Progress in Lagos: What It Actually Means"
  },
  "e1327932-2f03-40ad-b1ee-d601e35b8072": {
    metaTitle: "Governor's Consent and Property Due Diligence in Lagos"
  },
  "eee0aeb3-f35b-4430-baa2-6db57c3d7c6a": {
    readTime: "8 min read"
  }
};

const candidateIds = Object.keys(corrections).flatMap((id) => [id, `drafts.${id}`]);

let existingIds: string[] = [];
try {
  existingIds = await client.fetch<string[]>(`*[_id in $ids]._id`, { ids: candidateIds });
} catch {
  console.error("Unable to read the affected Sanity documents.");
  process.exit(1);
}

let transaction = client.transaction();
for (const documentId of existingIds) {
  const publishedId = documentId.replace(/^drafts\./, "");
  transaction = transaction.patch(documentId, { set: corrections[publishedId] });
}

try {
  await transaction.commit();
  console.log(`Corrected ${existingIds.length} published or draft documents.`);
} catch {
  console.error("Unable to save the proofreading corrections in Sanity.");
  process.exit(1);
}
