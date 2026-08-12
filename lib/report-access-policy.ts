import type { ReportAsset } from "@/lib/types";

const EMAIL_GATED_CATEGORIES = new Set([
  "Flagship Report",
  "Report",
  "Checklist",
  "Guide",
  "Neighbourhood Brief",
  "Comparison Report",
  "Explainer",
  "Sample Report"
]);

export function requiresReportEmail(asset: Pick<ReportAsset, "category" | "fileFormat" | "gated">) {
  return (
    asset.gated ||
    asset.fileFormat?.trim().toUpperCase() === "PDF" ||
    EMAIL_GATED_CATEGORIES.has(asset.category)
  );
}
