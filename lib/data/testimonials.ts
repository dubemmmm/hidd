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

export const testimonialSeeds: TestimonialSeed[] = [];
