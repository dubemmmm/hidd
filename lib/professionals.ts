import "server-only";

import groq from "groq";
import { cache } from "react";

import { sanityEnvReady } from "@/lib/sanity";
import { sanityHasServerToken, sanityServerClient } from "@/lib/sanity.server";

export type ProfessionalVertical =
  | "home-inspection"
  | "legal-due-diligence"
  | "risk-intelligence"
  | "valuation";

export type ProfessionalProfile = {
  id: string;
  name: string;
  roleTitle: string;
  vertical: ProfessionalVertical;
  photoUrl: string;
  qualifications: string[];
  registrations: Array<{ body: string; number: string }>;
  yearsExperience: number;
  reportResponsibility: string;
  bio: string;
};

const profilesQuery = groq`
  *[_type == "professionalProfile" && published == true] | order(displayOrder asc, name asc) {
    "id": _id,
    name,
    roleTitle,
    vertical,
    "photoUrl": photo.asset->url,
    qualifications,
    registrations[]{body, number},
    yearsExperience,
    reportResponsibility,
    bio
  }
`;

function isComplete(profile: Partial<ProfessionalProfile>): profile is ProfessionalProfile {
  return Boolean(
    profile.id &&
      profile.name &&
      profile.roleTitle &&
      profile.vertical &&
      profile.photoUrl &&
      profile.qualifications?.length &&
      profile.registrations?.length &&
      profile.yearsExperience &&
      profile.reportResponsibility &&
      profile.bio
  );
}

export const getProfessionalProfiles = cache(async (): Promise<ProfessionalProfile[]> => {
  if (!sanityEnvReady || !sanityHasServerToken) return [];

  try {
    const profiles = await sanityServerClient.fetch<Array<Partial<ProfessionalProfile>>>(profilesQuery);
    return profiles.filter(isComplete);
  } catch {
    return [];
  }
});
