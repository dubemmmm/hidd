import "server-only";

import groq from "groq";
import { cache } from "react";

import type { AuthorityMetric } from "@/lib/authority-metric-types";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import { sanityHasServerToken, sanityServerClient } from "@/lib/sanity.server";

const authorityMetricsQuery = groq`
  *[
    _type == "authorityMetric" &&
    verificationStatus == "verified" &&
    publishOnHomepage == true
  ] | order(displayOrder asc) [0...6] {
    "id": _id,
    metricName,
    category,
    value,
    "prefix": coalesce(prefix, ""),
    "suffix": coalesce(suffix, ""),
    "decimalPlaces": coalesce(decimalPlaces, 0),
    shortDescription,
    calculationMethodology,
    evidenceSource,
    verifiedThrough
  }
`;

const authorityMetricReadClient = sanityHasServerToken ? sanityServerClient : sanityClient;

export const getAuthorityMetrics = cache(async (): Promise<AuthorityMetric[]> => {
  if (!sanityEnvReady) return [];

  try {
    return await authorityMetricReadClient.fetch<AuthorityMetric[]>(authorityMetricsQuery);
  } catch {
    return [];
  }
});
