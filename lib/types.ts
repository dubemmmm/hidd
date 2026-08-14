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
  feeAmount: number;
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
  /** Public-facing answer. This is the only answer text rendered to visitors. */
  answer: string;
  /**
   * Internal-only service notes (status, operational caveats, team reminders).
   * NEVER rendered on public pages or included in search — keep public FAQ copy
   * in `answer` and any internal notes here so they stay separate.
   */
  internalNote?: string;
};

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

export type RiskAssessmentIndicator = {
  code: string;
  label: string;
  note: string;
};

export type RiskAssessmentCategory = {
  key: string;
  title: string;
  indicators: RiskAssessmentIndicator[];
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
  briefBody?: unknown[];
  assessmentDate: string;
  analyst: string;
  redFlag: string;
  layerScores: Record<RiskLayerKey, number>;
  assessmentCategories: RiskAssessmentCategory[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  initials: string;
  activityLabel: string;
  activityAt: string;
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
  publishedAt: string;
  status: ReportAssetStatus;
  gated: boolean;
  assetUrl?: string;
  featured?: boolean;
  isDemo?: boolean;
  description?: unknown[];
  keyContents?: string[];
  intendedAudience?: string[];
  coverageAreas?: string[];
  relatedService?: BookableServiceSlug;
  authorName?: string;
  authorCredentials?: string[];
  contributors?: Array<{ name: string; role: string; credentials?: string[] }>;
  edition?: string;
  version?: string;
  pageCount?: number;
  fileFormat?: string;
  coverImageUrl?: string;
  sources?: Array<{ title: string; publisher: string; url: string; accessedAt?: string }>;
};

export type CaseStudySection = {
  title: string;
  body: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  clientProfile: string;
  location: string;
  service: BookableServiceSlug;
  preventedRisk: string;
  publishedAt: string;
  readTime: string;
  metaTitle: string;
  metaDescription: string;
  featured?: boolean;
};

export type CaseStudyEvidence = {
  key: string;
  title: string;
  evidenceType: string;
  attachmentType: "image" | "file";
  caption: string;
  altText?: string;
  redactionNote: string;
  imageUrl?: string;
  fileUrl?: string;
  originalFilename?: string;
};

export type CaseStudyDetail = CaseStudy & {
  sections: CaseStudySection[];
  body?: unknown[];
  publicationPermissionConfirmed?: boolean;
  evidenceItems?: CaseStudyEvidence[];
};

export type InsightPostFrontmatter = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  authorCredentials?: string[];
  authorBio?: string;
  reviewedBy?: string;
  reviewerCredentials?: string[];
  lastReviewedAt?: string;
  articleFormat?: string;
  intendedAudience?: string[];
  sources?: Array<{
    title: string;
    publisher: string;
    url: string;
    publishedAt?: string;
    accessedAt?: string;
    claimSupported?: string;
  }>;
  publishedAt: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  relatedService: BookableServiceSlug;
  relatedArticles?: Array<{
    title: string;
    slug: string;
    category: string;
    author: string;
    publishedAt: string;
    readTime: string;
  }>;
  readTime: string;
};

export type InsightPost = InsightPostFrontmatter & {
  content: string;
};
