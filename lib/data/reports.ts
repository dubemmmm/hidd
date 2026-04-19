import type { ReportAsset } from "@/lib/types";

export const reportAssets: ReportAsset[] = [
  {
    slug: "lagos-neighbourhood-risk-index",
    title: "Lagos Neighbourhood Risk Index",
    summary:
      "Flagship HIDD authority asset benchmarking premium Lagos districts through a buyer-risk lens.",
    category: "Flagship Report",
    status: "live",
    gated: true,
    assetUrl: "/library/lagos-neighbourhood-risk-index.txt",
    featured: true
  },
  {
    slug: "lagos-buyer-risk-checklist",
    title: "Lagos Buyer Risk Checklist",
    summary:
      "A practical pre-deposit checklist for buyers who want a cleaner diligence process before funds move.",
    category: "Checklist",
    status: "live",
    gated: true,
    assetUrl: "/library/lagos-buyer-risk-checklist.txt",
    featured: true
  },
  {
    slug: "lekki-phase-1-risk-brief",
    title: "Lekki Phase 1 Risk Brief",
    summary:
      "Area-specific intelligence framing flood pressure, access, title complexity, and buyer defensibility.",
    category: "Neighbourhood Brief",
    status: "coming-soon",
    gated: true
  },
  {
    slug: "ikoyi-vs-victoria-island-risk-comparison",
    title: "Ikoyi vs Victoria Island Risk Comparison",
    summary:
      "A direct comparison asset for buyers weighing premium residential defensibility across both districts.",
    category: "Comparison Report",
    status: "coming-soon",
    gated: true
  },
  {
    slug: "understanding-property-title-comfort-in-lagos",
    title: "Understanding Property Title Comfort in Lagos",
    summary:
      "A plain-language authority asset explaining how buyers should think about title confidence before signing.",
    category: "Explainer",
    status: "coming-soon",
    gated: true
  }
];

export function getReportAsset(slug: string) {
  return reportAssets.find((asset) => asset.slug === slug);
}

export const featuredReportAssets = reportAssets.filter((asset) => asset.featured);
