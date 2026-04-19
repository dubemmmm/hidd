export type RiskTier = "low" | "medium" | "high";

export type NavItem = {
  href: string;
  label: string;
};

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

export type RiskLayerKey =
  | "flooding"
  | "title-complexity"
  | "planning-zoning"
  | "infrastructure"
  | "security"
  | "environmental"
  | "market-liquidity";

export type RiskLayer = {
  key: RiskLayerKey;
  label: string;
  shortLabel: string;
  description: string;
  /**
   * Flip to `false` to hide a layer from the public toggle UI while HIDD is still
   * finalising data. The layer stays in the type system, scores stay in the data
   * file — only the user-facing toggle disappears. Flip back to `true` on release.
   */
  available: boolean;
};

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

export type MapArea = {
  slug: string;
  name: string;
  label: string;
  riskGrade: RiskTier;
  geojsonFeature: GeoJSON.Feature<GeoJSON.Polygon>;
  headline: string;
  summary: string;
  framingNote: string;
  layerScores: Record<RiskLayerKey, number>;
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
  href: string;
  category: string;
  description: string;
};

export type ReportAssetStatus = "live" | "coming-soon";

export type ReportAsset = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  status: ReportAssetStatus;
  gated: boolean;
  assetUrl?: string;
  featured?: boolean;
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
  readTime: string;
};

export type InsightPost = InsightPostFrontmatter & {
  content: string;
};
