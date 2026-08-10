import type { ReportAsset } from "@/lib/types";

export const reportAssets: ReportAsset[] = [
  {
    slug: "lagos-neighbourhood-risk-index",
    title: "Lagos Neighbourhood Risk Index",
    summary:
      "An HIDD report comparing the risks that affect property buyers across premium Lagos districts.",
    category: "Flagship Report",
    publishedAt: "2026-04-16T09:00:00.000Z",
    status: "live",
    gated: true,
    assetUrl: "/library/lagos-neighbourhood-risk-index.txt",
    featured: true
  },
  {
    slug: "lagos-buyer-risk-checklist",
    title: "Lagos Buyer Risk Checklist",
    summary:
      "A practical checklist of what to verify before you pay a property deposit.",
    category: "Checklist",
    publishedAt: "2026-04-15T09:00:00.000Z",
    status: "live",
    gated: true,
    assetUrl: "/library/lagos-buyer-risk-checklist.txt",
    featured: true
  },
  {
    slug: "lekki-phase-1-risk-brief",
    title: "Lekki Phase 1 Risk Brief",
    summary:
      "A practical guide to flood exposure, access, title concerns, and other risks in Lekki Phase 1.",
    category: "Neighbourhood Brief",
    publishedAt: "2026-05-05T09:00:00.000Z",
    status: "coming-soon",
    gated: true
  },
  {
    slug: "ikoyi-vs-victoria-island-risk-comparison",
    title: "Ikoyi vs Victoria Island Risk Comparison",
    summary:
      "A side-by-side comparison for buyers choosing between Ikoyi and Victoria Island.",
    category: "Comparison Report",
    publishedAt: "2026-05-12T09:00:00.000Z",
    status: "coming-soon",
    gated: true
  },
  {
    slug: "understanding-property-title-comfort-in-lagos",
    title: "Understanding Property Title Comfort in Lagos",
    summary:
      "A plain-language guide to checking title documents and ownership confidence before signing.",
    category: "Explainer",
    publishedAt: "2026-05-19T09:00:00.000Z",
    status: "coming-soon",
    gated: true
  }
];

export function getReportAsset(slug: string) {
  return reportAssets.find((asset) => asset.slug === slug);
}

export const featuredReportAssets = reportAssets.filter((asset) => asset.featured);
