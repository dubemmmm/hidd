import type { MapAreaShape, RiskBreakdownItem, RiskBreakdownStatus } from "@/lib/types";

function metric(
  key: RiskBreakdownItem["key"],
  label: string,
  score: number,
  summary: string
): RiskBreakdownItem {
  const status: RiskBreakdownStatus = score >= 70 ? "critical" : score >= 40 ? "watch" : "clear";

  return {
    key,
    label,
    score,
    status,
    summary
  };
}

export const mapAreas: MapAreaShape[] = [
  {
    id: "ikoyi",
    name: "Ikoyi",
    label: "Ikoyi",
    tier: "low",
    pathData: "M248 132 L364 112 L430 166 L410 258 L300 286 L222 218 Z",
    focusX: 320,
    focusY: 194,
    headline: "Premium core with strong defensibility, but still requires disciplined title and zoning review.",
    summary:
      "Ikoyi remains one of Lagos' strongest premium markets, with resilient demand and relatively mature infrastructure, but planning edge cases and title chain quality still need verification.",
    breakdown: [
      metric("demolition", "Demolition", 18, "Lower enforcement pressure than emerging corridors, but planning status still matters."),
      metric("flooding", "Flooding", 22, "Flood exposure is comparatively contained, though site-specific drainage still matters."),
      metric("litigation", "Litigation", 24, "Title chains are generally stronger, but family-held assets can still carry dispute risk."),
      metric("infrastructure", "Infrastructure", 18, "Road access and utilities are stronger than most Lagos submarkets."),
      metric("security", "Security", 20, "Premium estates and institutional presence support stronger security conditions."),
      metric("zoning", "Zoning", 34, "Redevelopment pressure makes planning compliance worth checking closely."),
      metric("environmental", "Environmental", 28, "Environmental pressure is moderate and usually site-specific."),
      metric("market-liquidity", "Market Liquidity", 26, "Liquidity is strong for the right stock, but pricing discipline still matters.")
    ]
  },
  {
    id: "victoria-island",
    name: "Victoria Island",
    label: "V.I.",
    tier: "low",
    pathData: "M450 244 L570 232 L652 288 L628 382 L504 404 L428 334 Z",
    focusX: 542,
    focusY: 318,
    headline: "Institutional depth and mature infrastructure support a low-risk premium position.",
    summary:
      "Victoria Island benefits from strong commercial demand drivers and better infrastructure depth, but development intensity still means buyers should check title, planning, and environmental context carefully.",
    breakdown: [
      metric("demolition", "Demolition", 20, "Planning enforcement risk is lower than speculative fringe zones."),
      metric("flooding", "Flooding", 34, "Flood sensitivity varies block by block and needs property-level validation."),
      metric("litigation", "Litigation", 24, "Documentation quality is often stronger, but transaction history still needs review."),
      metric("infrastructure", "Infrastructure", 20, "Utilities, access, and market support remain relatively mature."),
      metric("security", "Security", 24, "Security conditions are comparatively stable for a core premium district."),
      metric("zoning", "Zoning", 36, "Mixed-use pressure makes planning and land-use alignment important."),
      metric("environmental", "Environmental", 38, "Coastal and drainage considerations should still be assessed."),
      metric("market-liquidity", "Market Liquidity", 24, "Liquidity is relatively strong, but not an excuse for weak diligence.")
    ]
  },
  {
    id: "banana-island",
    name: "Banana Island",
    label: "Banana Island",
    tier: "low",
    pathData: "M410 96 C478 76 556 118 560 170 C562 224 470 232 412 206 C364 184 352 118 410 96 Z",
    focusX: 462,
    focusY: 152,
    headline: "High-status enclave with strong market positioning, but premium pricing demands exacting review.",
    summary:
      "Banana Island remains one of Lagos' most prestige-sensitive micro-markets. Buyers should assume stronger market support, but still verify title, serviceability, environmental conditions, and price discipline independently.",
    breakdown: [
      metric("demolition", "Demolition", 16, "Lower demolition exposure, but planning assumptions still need verification."),
      metric("flooding", "Flooding", 30, "Water-adjacent conditions make drainage and resilience checks essential."),
      metric("litigation", "Litigation", 18, "Title quality tends to be stronger, though documentation should never be assumed."),
      metric("infrastructure", "Infrastructure", 16, "Infrastructure maturity is high by Lagos standards."),
      metric("security", "Security", 18, "Access controls and neighbourhood profile support a lower risk position."),
      metric("zoning", "Zoning", 28, "Redevelopment intensity still warrants planning confirmation."),
      metric("environmental", "Environmental", 36, "Environmental exposure remains relevant due to coastal conditions."),
      metric("market-liquidity", "Market Liquidity", 32, "Liquidity is premium but price sensitivity is high at the top end.")
    ]
  },
  {
    id: "eko-atlantic",
    name: "Eko Atlantic",
    label: "Eko Atlantic",
    tier: "medium",
    pathData: "M660 350 L844 334 L924 430 L914 584 L732 604 L640 490 Z",
    focusX: 788,
    focusY: 470,
    headline: "High-ambition district with strong upside, but delivery, infrastructure, and market absorption need sharper scrutiny.",
    summary:
      "Eko Atlantic represents a premium future-facing market with strong branding and long-term upside. Buyers should still assess execution risk, utility readiness, market absorption, and environmental resilience carefully.",
    breakdown: [
      metric("demolition", "Demolition", 22, "Formal planning reduces demolition pressure relative to informal corridors."),
      metric("flooding", "Flooding", 44, "Coastal engineering is a core proposition, but resilience assumptions still need scrutiny."),
      metric("litigation", "Litigation", 28, "Documentation paths are structured, but transaction review should still be independent."),
      metric("infrastructure", "Infrastructure", 40, "Infrastructure promise is strong, but delivery maturity varies by location."),
      metric("security", "Security", 24, "Controlled access supports a lower security risk profile."),
      metric("zoning", "Zoning", 30, "Master-planned positioning helps, though scheme-specific approvals still matter."),
      metric("environmental", "Environmental", 46, "Coastal and reclamation context justify closer environmental review."),
      metric("market-liquidity", "Market Liquidity", 52, "Liquidity depends heavily on product type, timing, and buyer profile.")
    ]
  },
  {
    id: "lekki-phase-1",
    name: "Lekki Phase 1",
    label: "Lekki Phase 1",
    tier: "medium",
    pathData: "M548 128 L732 112 L812 194 L790 308 L646 338 L530 244 Z",
    focusX: 674,
    focusY: 220,
    headline: "Demand remains strong, but flood pressure, access, and planning quality can vary materially by pocket.",
    summary:
      "Lekki Phase 1 continues to attract premium residential demand, though drainage pressure, traffic strain, and development inconsistency mean property-level review remains essential before capital moves.",
    breakdown: [
      metric("demolition", "Demolition", 30, "Enforcement exposure is moderate and depends on planning compliance."),
      metric("flooding", "Flooding", 54, "Flood and drainage performance can diverge meaningfully between blocks."),
      metric("litigation", "Litigation", 34, "Documentation quality can vary with development history and transaction chain."),
      metric("infrastructure", "Infrastructure", 42, "Infrastructure is relatively mature, but access pressure remains real."),
      metric("security", "Security", 28, "Security profile is better than fringe corridors, but still estate-specific."),
      metric("zoning", "Zoning", 40, "Mixed residential and commercial pressure makes zoning review important."),
      metric("environmental", "Environmental", 38, "Environmental exposure is moderate and location dependent."),
      metric("market-liquidity", "Market Liquidity", 34, "Liquidity is healthy, though pricing discipline should not be relaxed.")
    ]
  }
];
