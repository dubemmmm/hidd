import "server-only";

import groq from "groq";
import { cache } from "react";

import {
  getReportAsset as getLocalReportAsset,
  reportAssets as localReportAssets
} from "@/lib/data/reports";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import { sanityHasServerToken, sanityServerClient } from "@/lib/sanity.server";
import type { ReportAsset } from "@/lib/types";

const reportAssetFields = groq`
  isDemo,
  title,
  "slug": slug.current,
  summary,
  category,
  "publishedAt": coalesce(publishedAt, _createdAt),
  status,
  gated,
  featured,
  "assetUrl": select(
    gated == false &&
    fileFormat != "PDF" &&
    !(category in ["Flagship Report", "Report", "Checklist", "Guide", "Neighbourhood Brief", "Comparison Report", "Explainer", "Sample Report"])
      => coalesce(assetFile.asset->url, assetUrl)
  ),
  description,
  keyContents,
  intendedAudience,
  coverageAreas,
  relatedService,
  authorName,
  authorCredentials,
  contributors[]{name, role, credentials},
  edition,
  version,
  pageCount,
  fileFormat,
  "coverImageUrl": coverImage.asset->url,
  sources[]{title, publisher, url, accessedAt}
`;

const privateReportAssetFields = groq`
  ${reportAssetFields},
  "assetUrl": coalesce(assetFile.asset->url, assetUrl)
`;

const allReportAssetsQuery = groq`*[_type == "reportAsset"] | order(publishedAt desc) {${reportAssetFields}}`;
const reportAssetBySlugQuery = groq`*[_type == "reportAsset" && slug.current == $slug][0] {${reportAssetFields}}`;
const privateReportAssetBySlugQuery = groq`*[_type == "reportAsset" && slug.current == $slug][0] {${privateReportAssetFields}}`;
const reportAssetReadClient = sanityHasServerToken ? sanityServerClient : sanityClient;

async function getSanityReportAssets(): Promise<ReportAsset[]> {
  return reportAssetReadClient.fetch<ReportAsset[]>(allReportAssetsQuery);
}

export const getReportAssets = cache(async (): Promise<ReportAsset[]> => {
  if (sanityEnvReady) {
    try {
      return await getSanityReportAssets();
    } catch {
      console.error("Unable to load report assets from Sanity.");
      // Sanity is the source of truth once configured. Do not expose stale seed content.
      return [];
    }
  }

  return localReportAssets;
});

export const getReportAsset = cache(async (slug: string): Promise<ReportAsset | undefined> => {
  if (sanityEnvReady) {
    try {
      const asset = await reportAssetReadClient.fetch<ReportAsset | null>(reportAssetBySlugQuery, { slug });
      if (asset) {
        return asset;
      }
      return undefined;
    } catch {
      console.error(`Unable to load report asset \"${slug}\" from Sanity.`);
      return undefined;
    }
  }

  return getLocalReportAsset(slug);
});

export async function getReportAssetForAccess(slug: string): Promise<ReportAsset | undefined> {
  if (sanityEnvReady) {
    try {
      return (
        (await reportAssetReadClient.fetch<ReportAsset | null>(privateReportAssetBySlugQuery, { slug })) ??
        undefined
      );
    } catch {
      console.error(`Unable to load protected report asset "${slug}" from Sanity.`);
      return undefined;
    }
  }

  return getLocalReportAsset(slug);
}

export const getFeaturedReportAssets = cache(async (): Promise<ReportAsset[]> => {
  const assets = await getReportAssets();
  const sortedAssets = [...assets].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const featuredAssets = sortedAssets.filter((asset) => asset.featured);

  if (featuredAssets.length > 0) {
    return featuredAssets;
  }

  return sortedAssets.filter((asset) => asset.status === "live").slice(0, 2);
});
