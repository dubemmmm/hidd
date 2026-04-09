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
  turnaround?: string | null;
  accent: string;
  accreditation?: string[];
  proofNote?: string;
  included: string[];
  deliverables: string[];
  process: string[];
  suitableFor: string[];
  keyMetric: string;
  relatedInsights: string[];
  relatedFaqIds: string[];
};

export type BookableServiceSlug = Service["slug"] | "comprehensive-report";

export type FaqCategory =
  | "About HIDD"
  | "Our Services"
  | "Process"
  | "Pricing & Payment"
  | "Technical Questions"
  | "Legal & Liability"
  | "Contact & Booking";

export type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
};

export type RiskBreakdownStatus = "clear" | "watch" | "critical";

export type RiskBreakdownItem = {
  key:
    | "demolition"
    | "flooding"
    | "litigation"
    | "infrastructure"
    | "security"
    | "zoning"
    | "environmental"
    | "market-liquidity";
  label: string;
  status: RiskBreakdownStatus;
  score: number;
  summary: string;
};

export type MapAreaShape = {
  id: string;
  name: string;
  label: string;
  tier: RiskTier;
  pathData: string;
  focusX: number;
  focusY: number;
  headline: string;
  summary: string;
  breakdown: RiskBreakdownItem[];
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
  relatedService: BookableServiceSlug;
  readTime?: string;
};

export type InsightPost = InsightPostFrontmatter & {
  content: string;
};
