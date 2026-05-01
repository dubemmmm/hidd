import "server-only";

import groq from "groq";
import { cache } from "react";

import {
  getReportAsset as getLocalReportAsset,
  reportAssets as localReportAssets
} from "@/lib/data/reports";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import type { ReportAsset } from "@/lib/types";

const reportAssetFields = groq`
  title,
  "slug": slug.current,
  summary,
  category,
  "publishedAt": coalesce(publishedAt, _createdAt),
  status,
  gated,
  featured,
  "assetUrl": coalesce(assetFile.asset->url, assetUrl)
`;

const allReportAssetsQuery = groq`*[_type == "reportAsset"] | order(publishedAt desc) {${reportAssetFields}}`;
const reportAssetBySlugQuery = groq`*[_type == "reportAsset" && slug.current == $slug][0] {${reportAssetFields}}`;

async function getSanityReportAssets(): Promise<ReportAsset[]> {
  return sanityClient.fetch<ReportAsset[]>(allReportAssetsQuery);
}

export const getReportAssets = cache(async (): Promise<ReportAsset[]> => {
  if (sanityEnvReady) {
    try {
      const assets = await getSanityReportAssets();
      if (assets.length > 0) {
        return assets;
      }
    } catch {
      // Fall back to local seed data while the CMS model is being populated.
    }
  }

  return localReportAssets;
});

export const getReportAsset = cache(async (slug: string): Promise<ReportAsset | undefined> => {
  if (sanityEnvReady) {
    try {
      const asset = await sanityClient.fetch<ReportAsset | null>(reportAssetBySlugQuery, { slug });
      if (asset) {
        return asset;
      }
    } catch {
      // Fall back to local seed data while the CMS model is being populated.
    }
  }

  return getLocalReportAsset(slug);
});

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
