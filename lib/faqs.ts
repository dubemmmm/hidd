import "server-only";

import groq from "groq";
import { cache } from "react";

import { faqs as localFaqs } from "@/lib/data/faqs";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import { sanityHasServerToken, sanityServerClient } from "@/lib/sanity.server";
import type { FaqItem } from "@/lib/types";

// NOTE: `internalNote` is intentionally NOT selected here. The public site must
// never receive internal notes — they are only visible inside the Sanity Studio.
const faqFields = groq`
  "id": slug.current,
  category,
  question,
  answer
`;

const allFaqsQuery = groq`*[_type == "faq"] | order(displayOrder asc, _createdAt asc) {${faqFields}}`;

// Strip internalNote from the local seed so the fallback path is also public-safe.
function toPublicFaq({ id, category, question, answer }: FaqItem): FaqItem {
  return { id, category, question, answer };
}

// This dataset restricts anonymous reads to `post` documents, so FAQs must be
// read with the authenticated server-side client. Falls back to the anonymous
// client (and then local seed) when no server token is configured.
const faqReadClient = sanityHasServerToken ? sanityServerClient : sanityClient;

export const getFaqs = cache(async (): Promise<FaqItem[]> => {
  if (sanityEnvReady) {
    try {
      const faqs = await faqReadClient.fetch<FaqItem[]>(allFaqsQuery);
      if (faqs.length > 0) {
        return faqs;
      }
    } catch {
      // Fall back to local seed data while the CMS model is being populated.
    }
  }

  return localFaqs.map(toPublicFaq);
});

export async function getFaqsByIds(ids: string[]): Promise<FaqItem[]> {
  const faqs = await getFaqs();
  const order = new Map(ids.map((id, index) => [id, index]));
  return faqs
    .filter((faq) => order.has(faq.id))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}
