import "server-only";

import groq from "groq";

import { testimonialSeeds } from "@/lib/data/testimonials";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import type { Testimonial } from "@/lib/types";

type RawSanitySocialProof = {
  _id?: string | null;
  name?: string | null;
  role?: string | null;
  location?: string | null;
  quote?: string | null;
  initials?: string | null;
  activityVerb?: string | null;
  activityAt?: string | null;
  displayOrder?: number | null;
};

type SortableSocialProof = Testimonial & {
  sortOrder: number;
};

const socialProofFields = groq`
  _id,
  name,
  role,
  location,
  quote,
  initials,
  activityVerb,
  "activityAt": coalesce(activityAt, _updatedAt),
  displayOrder
`;

const allSocialProofQuery = groq`
  *[_type == "socialProof"] | order(displayOrder asc, coalesce(activityAt, _updatedAt) desc) {
    ${socialProofFields}
  }
`;

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatRelativeTime(value: string) {
  const delta = new Date(value).getTime() - Date.now();
  const absDelta = Math.abs(delta);
  const minute = 60_000;
  const hour = 3_600_000;
  const day = 86_400_000;
  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "always"
  });

  if (absDelta < hour) {
    return formatter.format(Math.round(delta / minute), "minute");
  }

  if (absDelta < day) {
    return formatter.format(Math.round(delta / hour), "hour");
  }

  return formatter.format(Math.round(delta / day), "day");
}

function buildActivityLabel(activityVerb: string, activityAt: string) {
  return `${activityVerb.trim()} ${formatRelativeTime(activityAt)}`;
}

function buildSeedActivityAt(days: number, hours: number) {
  return new Date(Date.now() - (days * 24 + hours) * 3_600_000).toISOString();
}

function normalizeSanityItem(item: RawSanitySocialProof): SortableSocialProof | null {
  const id = item._id?.trim();
  const name = item.name?.trim();
  const role = item.role?.trim();
  const location = item.location?.trim();
  const quote = item.quote?.trim();
  const activityVerb = item.activityVerb?.trim() || "Commented";
  const activityAt = item.activityAt?.trim();

  if (!id || !name || !role || !location || !quote || !activityAt) {
    return null;
  }

  const initials = item.initials?.trim() || initialsFromName(name);

  return {
    id,
    name,
    role,
    location,
    quote,
    initials,
    activityAt,
    activityLabel: buildActivityLabel(activityVerb, activityAt),
    sortOrder: Number(item.displayOrder ?? 10)
  };
}

function buildSeedItems(): SortableSocialProof[] {
  return testimonialSeeds.map((seed) => {
    const activityAt = buildSeedActivityAt(seed.recencyOffsetDays, seed.recencyOffsetHours);

    return {
      id: seed.id,
      name: seed.name,
      role: seed.role,
      location: seed.location,
      quote: seed.quote,
      initials: initialsFromName(seed.name),
      activityAt,
      activityLabel: buildActivityLabel(seed.activityVerb, activityAt),
      sortOrder: 100
    };
  });
}

async function getSanitySocialProofItems() {
  const items = await sanityClient.fetch<RawSanitySocialProof[]>(allSocialProofQuery);

  return items
    .map(normalizeSanityItem)
    .filter((item): item is SortableSocialProof => Boolean(item));
}

export async function getSocialProofItems(limit = 3): Promise<Testimonial[]> {
  // Newest static testimonials first, so the ones dropped are always the oldest.
  const seededItems = buildSeedItems().sort(
    (a, b) => new Date(b.activityAt).getTime() - new Date(a.activityAt).getTime()
  );
  let sanityItems: SortableSocialProof[] = [];

  if (sanityEnvReady) {
    try {
      sanityItems = await getSanitySocialProofItems();
    } catch {
      // Leave seeded items in place if the CMS model is still being populated.
    }
  }

  // CMS-managed entries take priority and push the oldest static seeds out
  // one-for-one, so the total count stays stable as Sanity is populated.
  const seedSlots = Math.max(0, limit - sanityItems.length);
  const keptSeeds = seededItems.slice(0, seedSlots);

  return [...sanityItems, ...keptSeeds]
    .sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }

      return new Date(b.activityAt).getTime() - new Date(a.activityAt).getTime();
    })
    .slice(0, limit);
}
