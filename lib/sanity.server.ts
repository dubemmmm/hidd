import "server-only";

import { createClient } from "next-sanity";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "@/lib/sanity";

function isUsableToken(value: string | undefined): value is string {
  return Boolean(value) && !value!.includes("REPLACE_ME") && value !== "your_read_token";
}

// Server-only token. Use the current write token first because it also has read
// access; fall back to a dedicated read token when no write token is configured.
// Picks the first *usable* value (ignores placeholders).
// This token is NEVER sent to the browser (server-only).
const token =
  [process.env.SANITY_API_WRITE_TOKEN, process.env.SANITY_API_READ_TOKEN].find(isUsableToken) ?? "";

export const sanityHasServerToken = isUsableToken(token);

// Authenticated, published-only client. Reads every public document type even when
// the dataset restricts anonymous reads to a subset of types.
export const sanityServerClient = createClient({
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset || "production",
  apiVersion: sanityApiVersion,
  token: sanityHasServerToken ? token : undefined,
  useCdn: false,
  perspective: "published"
});

// Draft-aware client used only after Sanity's signed Presentation Tool
// handshake enables Next.js Draft Mode for an authenticated editor.
export const sanityPreviewClient = createClient({
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset || "production",
  apiVersion: sanityApiVersion,
  token: sanityHasServerToken ? token : undefined,
  useCdn: false,
  perspective: "drafts"
});
