import type {
  MapArea,
  RiskBreakdownItem,
  RiskBreakdownStatus,
  RiskLayer,
  RiskLayerKey,
  RiskTier
} from "@/lib/types";

function riskItem(
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

function polygon(
  coordinates: Array<[number, number]>
): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[...coordinates, coordinates[0]]]
    }
  };
}

export const riskLayers: RiskLayer[] = [
  {
    key: "flooding",
    label: "Flooding",
    shortLabel: "Flood",
    description: "Drainage pressure, coastal exposure, and failure-condition resilience.",
    available: true
  },
  {
    key: "title-complexity",
    label: "Title Complexity",
    shortLabel: "Title",
    description: "Title-chain quality, documentation friction, and ownership complexity.",
    available: true
  },
  {
    key: "planning-zoning",
    label: "Planning & Zoning",
    shortLabel: "Planning",
    description: "Planning alignment, demolition exposure, and zoning pressure.",
    available: true
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    shortLabel: "Infra",
    description: "Access, utilities, and neighbourhood readiness.",
    available: true
  },
  {
    key: "security",
    label: "Security",
    shortLabel: "Security",
    description: "Security profile, access control, and general operating comfort.",
    available: true
  },
  {
    key: "environmental",
    label: "Environmental",
    shortLabel: "Env",
    description: "Environmental constraints and location-specific externalities.",
    available: true
  },
  {
    key: "market-liquidity",
    label: "Market Liquidity",
    shortLabel: "Market",
    description: "Absorption strength, exit flexibility, and premium-demand resilience.",
    available: true
  }
];

export function scoreToTier(score: number): RiskTier {
  if (score >= 55) return "high";
  if (score >= 35) return "medium";
  return "low";
}

export function getLayerAverage(area: MapArea, activeLayers: RiskLayerKey[]) {
  const selected = activeLayers.length ? activeLayers : riskLayers.map((layer) => layer.key);
  const total = selected.reduce((sum, key) => sum + area.layerScores[key], 0);
  return Math.round(total / selected.length);
}

export function getLayerTier(area: MapArea, activeLayers: RiskLayerKey[]) {
  return scoreToTier(getLayerAverage(area, activeLayers));
}

export const mapAreas: MapArea[] = [
  {
    slug: "victoria-island",
    name: "Victoria Island",
    label: "Victoria Island",
    riskGrade: "low",
    geojsonFeature: polygon([
      [3.3995, 6.4194],
      [3.4294, 6.4211],
      [3.4425, 6.4069],
      [3.4319, 6.3907],
      [3.4033, 6.3946],
      [3.3949, 6.4067]
    ]),
    headline: "Institutional depth and mature infrastructure support a relatively low-risk premium position.",
    summary:
      "Victoria Island benefits from stronger commercial density, better infrastructure, and more mature demand support, but planning intensity and coastal conditions still need disciplined review.",
    framingNote:
      "Victoria Island remains one of Lagos' most defensible premium districts, but buyers should still test flood exposure, title quality, and mixed-use planning pressure at property level.",
    layerScores: {
      flooding: 34,
      "title-complexity": 26,
      "planning-zoning": 36,
      infrastructure: 20,
      security: 24,
      environmental: 38,
      "market-liquidity": 24
    },
    breakdown: [
      riskItem("demolition", "Demolition", 20, "Planning enforcement risk is lower than speculative corridors."),
      riskItem("flooding", "Flooding", 34, "Flood sensitivity varies block by block and needs property-level validation."),
      riskItem("litigation", "Litigation", 24, "Documentation quality is often stronger, but transaction history still needs review."),
      riskItem("infrastructure", "Infrastructure", 20, "Utilities, access, and market support remain relatively mature."),
      riskItem("security", "Security", 24, "Security conditions are comparatively stable for a core premium district."),
      riskItem("zoning", "Zoning", 36, "Mixed-use pressure makes planning and land-use alignment important."),
      riskItem("environmental", "Environmental", 38, "Coastal and drainage considerations should still be assessed."),
      riskItem("market-liquidity", "Market Liquidity", 24, "Liquidity is strong, but weak diligence still gets punished.")
    ]
  },
  {
    slug: "ikoyi",
    name: "Ikoyi",
    label: "Ikoyi",
    riskGrade: "low",
    geojsonFeature: polygon([
      [3.4317, 6.4513],
      [3.4552, 6.4501],
      [3.4687, 6.4381],
      [3.4631, 6.4141],
      [3.4415, 6.4127],
      [3.4281, 6.4279]
    ]),
    headline: "Premium core with strong defensibility, but title and planning diligence still matter.",
    summary:
      "Ikoyi remains one of Lagos' strongest premium districts, with resilient demand and relatively mature infrastructure, but buyers should still test title chains, zoning edge cases, and pricing discipline.",
    framingNote:
      "Ikoyi's reputation does not remove diligence requirements. The district is premium, but family-held assets, redevelopment pressure, and overconfidence in title quality still create buyer risk.",
    layerScores: {
      flooding: 22,
      "title-complexity": 28,
      "planning-zoning": 34,
      infrastructure: 18,
      security: 20,
      environmental: 28,
      "market-liquidity": 26
    },
    breakdown: [
      riskItem("demolition", "Demolition", 18, "Lower enforcement pressure than emerging corridors, but planning status still matters."),
      riskItem("flooding", "Flooding", 22, "Flood exposure is comparatively contained, though site-specific drainage still matters."),
      riskItem("litigation", "Litigation", 24, "Title chains are generally stronger, but family-held assets can still carry dispute risk."),
      riskItem("infrastructure", "Infrastructure", 18, "Road access and utilities are stronger than most Lagos submarkets."),
      riskItem("security", "Security", 20, "Premium estates and institutional presence support stronger security conditions."),
      riskItem("zoning", "Zoning", 34, "Redevelopment pressure makes planning compliance worth checking closely."),
      riskItem("environmental", "Environmental", 28, "Environmental pressure is moderate and usually site-specific."),
      riskItem("market-liquidity", "Market Liquidity", 26, "Liquidity is strong for the right stock, but pricing discipline still matters.")
    ]
  },
  {
    slug: "banana-island",
    name: "Banana Island",
    label: "Banana Island",
    riskGrade: "low",
    geojsonFeature: polygon([
      [3.4586, 6.4449],
      [3.4769, 6.4437],
      [3.4839, 6.4332],
      [3.4761, 6.4215],
      [3.4584, 6.4232],
      [3.4518, 6.4341]
    ]),
    headline: "Prestige and control support a low-risk profile, but premium pricing still demands exacting review.",
    summary:
      "Banana Island benefits from stronger access control and market positioning, but buyers should still pressure-test environmental resilience, serviceability, and title quality rather than assuming comfort.",
    framingNote:
      "This is a prestige micro-market. The strongest risk here is buyer overconfidence: premium branding can hide weak technical assumptions, especially on pricing and environmental exposure.",
    layerScores: {
      flooding: 30,
      "title-complexity": 18,
      "planning-zoning": 28,
      infrastructure: 16,
      security: 18,
      environmental: 36,
      "market-liquidity": 32
    },
    breakdown: [
      riskItem("demolition", "Demolition", 16, "Lower demolition exposure, but planning assumptions still need verification."),
      riskItem("flooding", "Flooding", 30, "Water-adjacent conditions make drainage and resilience checks essential."),
      riskItem("litigation", "Litigation", 18, "Title quality tends to be stronger, though documentation should never be assumed."),
      riskItem("infrastructure", "Infrastructure", 16, "Infrastructure maturity is high by Lagos standards."),
      riskItem("security", "Security", 18, "Access controls and neighbourhood profile support a lower risk position."),
      riskItem("zoning", "Zoning", 28, "Redevelopment intensity still warrants planning confirmation."),
      riskItem("environmental", "Environmental", 36, "Environmental exposure remains relevant due to coastal conditions."),
      riskItem("market-liquidity", "Market Liquidity", 32, "Liquidity is premium but price sensitivity is high at the top end.")
    ]
  },
  {
    slug: "lekki-phase-1",
    name: "Lekki Phase 1",
    label: "Lekki Phase 1",
    riskGrade: "medium",
    geojsonFeature: polygon([
      [3.4688, 6.4584],
      [3.5107, 6.4595],
      [3.5274, 6.4371],
      [3.5178, 6.4082],
      [3.4769, 6.4096],
      [3.4628, 6.4307]
    ]),
    headline: "Demand remains strong, but flood pressure, access, and planning quality vary materially by pocket.",
    summary:
      "Lekki Phase 1 continues to attract premium demand, though drainage exposure, access strain, and development inconsistency mean asset-level review remains essential before capital moves.",
    framingNote:
      "Lekki Phase 1 should not be treated as uniformly low-risk. Buyers need to read it block by block, especially on drainage, access, and development quality.",
    layerScores: {
      flooding: 54,
      "title-complexity": 34,
      "planning-zoning": 40,
      infrastructure: 42,
      security: 28,
      environmental: 38,
      "market-liquidity": 34
    },
    breakdown: [
      riskItem("demolition", "Demolition", 30, "Enforcement exposure is moderate and depends on planning compliance."),
      riskItem("flooding", "Flooding", 54, "Flood and drainage performance can diverge meaningfully between blocks."),
      riskItem("litigation", "Litigation", 34, "Documentation quality can vary with development history and transaction chain."),
      riskItem("infrastructure", "Infrastructure", 42, "Infrastructure is relatively mature, but access pressure remains real."),
      riskItem("security", "Security", 28, "Security profile is better than fringe corridors, but still estate-specific."),
      riskItem("zoning", "Zoning", 40, "Mixed residential and commercial pressure makes zoning review important."),
      riskItem("environmental", "Environmental", 38, "Environmental exposure is moderate and location dependent."),
      riskItem("market-liquidity", "Market Liquidity", 34, "Liquidity is healthy, though pricing discipline should not be relaxed.")
    ]
  },
  {
    slug: "eko-atlantic",
    name: "Eko Atlantic",
    label: "Eko Atlantic",
    riskGrade: "medium",
    geojsonFeature: polygon([
      [3.3845, 6.3977],
      [3.4188, 6.3987],
      [3.4301, 6.3832],
      [3.4259, 6.3678],
      [3.3946, 6.3654],
      [3.3812, 6.3801]
    ]),
    headline: "High-ambition district with strong upside, but delivery, infrastructure, and market absorption need sharper scrutiny.",
    summary:
      "Eko Atlantic represents a premium future-facing district with strong branding and long-term upside. Buyers should still assess execution risk, utility readiness, market absorption, and environmental resilience carefully.",
    framingNote:
      "Eko Atlantic operates under a distinct title and governance regime, separate from the Lagos State Lands Bureau framework that applies elsewhere on Lagos Island. Buyers should treat the ambitious market story as a reason to raise the diligence standard, not relax it — particularly on title structure, infrastructure delivery, and market absorption.",
    layerScores: {
      flooding: 44,
      "title-complexity": 28,
      "planning-zoning": 30,
      infrastructure: 40,
      security: 24,
      environmental: 46,
      "market-liquidity": 52
    },
    breakdown: [
      riskItem("demolition", "Demolition", 22, "Formal planning reduces demolition pressure relative to informal corridors."),
      riskItem("flooding", "Flooding", 44, "Coastal engineering is a core proposition, but resilience assumptions still need scrutiny."),
      riskItem("litigation", "Litigation", 28, "Documentation paths are structured, but transaction review should still be independent."),
      riskItem("infrastructure", "Infrastructure", 40, "Infrastructure promise is strong, but delivery maturity varies by location."),
      riskItem("security", "Security", 24, "Controlled access supports a lower security risk profile."),
      riskItem("zoning", "Zoning", 30, "Master-planned positioning helps, though scheme-specific approvals still matter."),
      riskItem("environmental", "Environmental", 46, "Coastal and reclamation context justify closer environmental review."),
      riskItem("market-liquidity", "Market Liquidity", 52, "Liquidity depends heavily on product type, timing, and buyer profile.")
    ]
  }
];

export function getMapArea(slug: string) {
  return mapAreas.find((area) => area.slug === slug);
}
