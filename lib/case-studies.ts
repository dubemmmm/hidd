import "server-only";

import groq from "groq";
import { cache } from "react";

import {
  caseStudies as localCaseStudies,
  getLocalCaseStudy
} from "@/lib/data/case-studies";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import { sanityHasServerToken, sanityServerClient } from "@/lib/sanity.server";
import type { CaseStudy, CaseStudyDetail } from "@/lib/types";

const caseStudyFields = groq`
  title,
  "slug": slug.current,
  summary,
  clientProfile,
  location,
  service,
  preventedRisk,
  "publishedAt": coalesce(publishedAt, _createdAt),
  readTime,
  metaTitle,
  metaDescription,
  featured
`;

const allCaseStudiesQuery = groq`
  *[_type == "caseStudy"] | order(coalesce(publishedAt, _createdAt) desc) {
    ${caseStudyFields}
  }
`;

const caseStudyBySlugQuery = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    ${caseStudyFields},
    body
  }
`;

const caseStudyReadClient = sanityHasServerToken ? sanityServerClient : sanityClient;

function normalizeReadTime(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "Case study";
}

function normalizeCaseStudy<T extends CaseStudy>(caseStudy: T): T {
  return {
    ...caseStudy,
    readTime: normalizeReadTime(caseStudy.readTime),
    metaTitle: caseStudy.metaTitle || caseStudy.title,
    metaDescription: caseStudy.metaDescription || caseStudy.summary
  };
}

async function getSanityCaseStudies(): Promise<CaseStudy[]> {
  const caseStudies = await caseStudyReadClient.fetch<CaseStudy[]>(allCaseStudiesQuery);
  return caseStudies.map(normalizeCaseStudy);
}

export const getCaseStudies = cache(async (): Promise<CaseStudy[]> => {
  if (sanityEnvReady) {
    try {
      const caseStudies = await getSanityCaseStudies();
      if (caseStudies.length > 0) {
        return caseStudies;
      }
    } catch {
      // Fall back to local case studies while the CMS model is being populated.
    }
  }

  return localCaseStudies.map(normalizeCaseStudy);
});

export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudyDetail | undefined> => {
  if (sanityEnvReady) {
    try {
      const caseStudy = await caseStudyReadClient.fetch<CaseStudyDetail | null>(caseStudyBySlugQuery, {
        slug
      });

      if (caseStudy) {
        return {
          ...normalizeCaseStudy(caseStudy),
          sections: caseStudy.sections ?? []
        };
      }
    } catch {
      // Fall back to local case studies while the CMS model is being populated.
    }
  }

  const localCaseStudy = getLocalCaseStudy(slug);
  return localCaseStudy ? normalizeCaseStudy(localCaseStudy) : undefined;
});

export async function getFeaturedCaseStudies(limit = 3): Promise<CaseStudy[]> {
  const caseStudies = await getCaseStudies();
  const featured = caseStudies.filter((caseStudy) => caseStudy.featured);
  return (featured.length > 0 ? featured : caseStudies).slice(0, limit);
}
