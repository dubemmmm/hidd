export type TestimonialSeed = {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  activityVerb: string;
  recencyOffsetDays: number;
  recencyOffsetHours: number;
};

export const testimonialSeeds: TestimonialSeed[] = [
  {
    id: "seed-adewale-okonkwo",
    name: "Adewale Okonkwo",
    role: "Buyer",
    location: "Lekki Phase 1, Lagos",
    quote:
      "HIDD stopped us from closing on a property with documentation gaps that would have become a serious legal problem later. The legal review was precise, commercial, and direct enough for us to change course before any money moved.",
    activityVerb: "Commented",
    recencyOffsetDays: 2,
    recencyOffsetHours: 4
  },
  {
    id: "seed-chioma-nwosu",
    name: "Chioma Nwosu",
    role: "Investor",
    location: "Victoria Island, Lagos",
    quote:
      "The risk report changed our location decision. HIDD showed us the flood history and infrastructure weakness the selling materials ignored, then framed the downside in a way that actually affected our underwriting.",
    activityVerb: "Shared feedback",
    recencyOffsetDays: 3,
    recencyOffsetHours: 6
  },
  {
    id: "seed-tunde-ibrahim",
    name: "Tunde Ibrahim",
    role: "Diaspora Buyer",
    location: "London, United Kingdom",
    quote:
      "Buying remotely only worked because HIDD gave us an inspection and diligence process we could trust from abroad. The reporting quality was strong enough for us to make a serious decision from London without guesswork.",
    activityVerb: "Reviewed",
    recencyOffsetDays: 4,
    recencyOffsetHours: 2
  },
  {
    id: "seed-maya-eze",
    name: "Maya Eze",
    role: "Family Office Representative",
    location: "Abuja, Nigeria",
    quote:
      "Their combined reporting style is sharp, commercial, and decision-oriented. It feels built for serious buyers, not generic compliance or checklist theatre.",
    activityVerb: "Followed up",
    recencyOffsetDays: 5,
    recencyOffsetHours: 8
  },
  {
    id: "seed-gbemisola-adebayo",
    name: "Gbemisola Adebayo",
    role: "Luxury Residential Buyer",
    location: "Ikoyi, Lagos",
    quote:
      "The valuation and inspection combination was especially useful. It kept us from overpaying for presentation and helped us see what the asset would actually require after acquisition.",
    activityVerb: "Recommended",
    recencyOffsetDays: 6,
    recencyOffsetHours: 5
  },
  {
    id: "seed-kelechi-umeh",
    name: "Kelechi Umeh",
    role: "Corporate Acquisitions Lead",
    location: "Toronto, Canada",
    quote:
      "HIDD's output felt built for decision-makers. It was concise where it needed to be, detailed where it mattered, and commercially useful from the first page to the last.",
    activityVerb: "Commented",
    recencyOffsetDays: 8,
    recencyOffsetHours: 3
  }
];
