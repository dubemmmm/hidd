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
  useCdn: false,
  perspective: "raw"
});

let documentIds: string[] = [];

try {
  documentIds = await client.fetch<string[]>(`*[_type == "socialProof"]._id`);
} catch {
  console.error("Unable to read testimonial records from Sanity.");
  process.exit(1);
}

if (documentIds.length === 0) {
  console.log("Sanity already contains no testimonial records.");
  process.exit(0);
}

let transaction = client.transaction();
for (const documentId of documentIds) {
  transaction = transaction.delete(documentId);
}

try {
  await transaction.commit();
  console.log(`Removed ${documentIds.length} published or draft testimonial records from Sanity.`);
} catch {
  console.error("Unable to clear testimonial records from Sanity.");
  process.exit(1);
}
