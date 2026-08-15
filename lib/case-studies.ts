import "server-only";

import groq from "groq";
import { cache } from "react";

import {
  caseStudies as localCaseStudies,
  getLocalCaseStudy
} from "@/lib/data/case-studies";
import { formatReadTime } from "@/lib/read-time";
import { getCurrentNarration } from "@/lib/narration";
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
    body,
    narrationEnabled,
    narrationVoice,
    narrationPronunciationNotes,
    narration {
      "audioUrl": audio.asset->url,
      durationSeconds,
      voice,
      model,
      generatedAt,
      sourceHash,
      aiGenerated
    },
    publicationPermissionConfirmed,
    "evidenceItems": evidenceItems[approvedForPublication == true] {
      "key": _key,
      title,
      evidenceType,
      attachmentType,
      caption,
      altText,
      redactionNote,
      "imageUrl": image.asset->url,
      "fileUrl": file.asset->url,
      "originalFilename": file.asset->originalFilename
    }
  }
`;

const caseStudyReadClient = sanityHasServerToken ? sanityServerClient : sanityClient;

type RawCaseStudyDetail = CaseStudyDetail & {
  narrationEnabled?: boolean;
  narrationVoice?: string;
  narrationPronunciationNotes?: string;
};

function normalizeCaseStudy<T extends CaseStudy>(caseStudy: T): T {
  return {
    ...caseStudy,
    readTime: formatReadTime(caseStudy.readTime, "Case study"),
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
      return await getSanityCaseStudies();
    } catch {
      // Sanity is the source of truth once configured. Do not expose stale seed content.
      return [];
    }
  }

  return localCaseStudies.map(normalizeCaseStudy);
});

export const getCaseStudyBySlug = cache(async (slug: string): Promise<CaseStudyDetail | undefined> => {
  if (sanityEnvReady) {
    try {
      const caseStudy = await caseStudyReadClient.fetch<RawCaseStudyDetail | null>(caseStudyBySlugQuery, {
        slug
      });

      if (caseStudy) {
        return {
          ...normalizeCaseStudy(caseStudy),
          sections: caseStudy.sections ?? [],
          narration: getCurrentNarration(caseStudy)
        };
      }
      return undefined;
    } catch {
      return undefined;
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
