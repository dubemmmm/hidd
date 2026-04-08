export type RiskTier = "low" | "medium" | "high";

export type Service = {
  slug: "home-inspection" | "legal-due-diligence" | "risk-intelligence" | "valuation";
  name: string;
  shortName: string;
  eyebrow: string;
  summary: string;
  longDescription: string;
  heroKicker: string;
  fee: string;
  turnaround: string;
  accent: string;
  included: string[];
  deliverables: string[];
  process: string[];
  suitableFor: string[];
  keyMetric: string;
  relatedInsights: string[];
  relatedFaqIds: string[];
};

export type FaqCategory =
  | "About HIDD"
  | "Services & Scope"
  | "Pricing & Payment"
  | "Process & Turnaround"
  | "For Diaspora Buyers";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};

export type MapAreaRisk = {
  id: string;
  name: string;
  label: string;
  tier: RiskTier;
  floodRisk: number;
  infrastructure: number;
  titleComplexity: number;
  narrative: string;
  lat: number;
  lng: number;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

export type NewsItem = {
  id: string;
  headline: string;
  source: string;
  publishedAt: string;
  url: string;
  category: string;
};

export type InsightPostFrontmatter = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  readTime?: string;
};

export type InsightPost = InsightPostFrontmatter & {
  content: string;
};
