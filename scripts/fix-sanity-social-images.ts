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

const hostedImage = "https://www.hiddadvisory.com/og/hidd-advisory-og-v1.png";

type PostImageRecord = {
  _id: string;
  title?: string | null;
  ogImage?: string | null;
  coverImage?: string | null;
};

function shouldReplace(value?: string | null) {
  if (!value) return false;
  const normalized = value.toLowerCase();
  return (
    normalized.endsWith("/og-default.svg") ||
    normalized.endsWith("/og/hidd-advisory-og.png") ||
    normalized.includes("chatgpt.com") ||
    normalized.includes("chat.openai.com") ||
    normalized.includes("openai.com/share") ||
    normalized.includes("oaidalleapiprodscus") ||
    normalized.includes("oaiusercontent.com")
  );
}

let posts: PostImageRecord[] = [];

try {
  posts = await client.fetch<PostImageRecord[]>(
    `*[_type == "post"]{_id, title, ogImage, coverImage}`
  );
} catch {
  console.error("Unable to audit article social images in Sanity.");
  process.exit(1);
}

let transaction = client.transaction();
let updates = 0;

for (const post of posts) {
  const set: Record<string, string> = {};
  if (shouldReplace(post.ogImage)) set.ogImage = hostedImage;
  if (shouldReplace(post.coverImage)) set.coverImage = hostedImage;

  if (Object.keys(set).length > 0) {
    transaction = transaction.patch(post._id, { set });
    updates += 1;
  }
}

if (updates === 0) {
  console.log(`Audited ${posts.length} article records. No disallowed social images remain.`);
  const hostedArticles = posts
    .filter((post) => post.ogImage === hostedImage || post.coverImage === hostedImage)
    .map((post) => post.title ?? post._id);
  if (hostedArticles.length > 0) {
    console.log(`Articles using the HIDD-hosted replacement: ${hostedArticles.join("; ")}`);
  }
  process.exit(0);
}

try {
  await transaction.commit();
  console.log(`Updated ${updates} article record(s) to use the HIDD-hosted PNG social image.`);
} catch {
  console.error("Unable to update article social images in Sanity.");
  process.exit(1);
}
