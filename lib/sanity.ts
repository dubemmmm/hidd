import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const sanityApiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09";

export const sanityEnvReady = Boolean(sanityProjectId && sanityDataset);

export const sanityClient = createClient({
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset || "production",
  apiVersion: sanityApiVersion,
  useCdn: true
});

const sanityImageBuilder = createImageUrlBuilder(sanityClient);

export function urlForSanityImage(source: Parameters<typeof sanityImageBuilder.image>[0]) {
  return sanityImageBuilder.image(source);
}
