import type { MapArea, RiskAssessmentCategory, RiskLayer, RiskLayerKey, RiskTier } from "@/lib/types";

type MapAreaSeed = Omit<MapArea, "geojsonFeature" | "assessmentCategories"> & {
  coordinates: Array<[number, number]>;
  assessmentNotes: Record<AssessmentCategoryKey, string>;
};

type AssessmentBlueprintItem = {
  key: string;
  title: string;
  code: string;
  label: string;
};

const assessmentBlueprint = [
  {
    key: "documentation-quality",
    title: "DOCUMENTATION QUALITY",
    code: "1.1",
    label: "Title chain and documentation confidence"
  },
  {
    key: "tenure-security-revocation",
    title: "TENURE SECURITY & REVOCATION RISK",
    code: "2.1",
    label: "Competing claims and tenure security"
  },
  {
    key: "government-action-demolition",
    title: "Government Action & Demolition",
    code: "3.1",
    label: "Demolition and acquisition exposure"
  },
  {
    key: "flooding-drainage",
    title: "FLOODING & DRAINAGE",
    code: "4.1",
    label: "Drainage resilience and flood sensitivity"
  },
  {
    key: "zoning-development-control",
    title: "ZONING & DEVELOPMENT CONTROL",
    code: "5.1",
    label: "Planning alignment and land-use control"
  },
  {
    key: "infrastructure-accessibility",
    title: "INFRASTRUCTURE & ACCESSIBILITY",
    code: "6.1",
    label: "Access and infrastructure readiness"
  },
  {
    key: "security-environment",
    title: "SECURITY ENVIRONMENT",
    code: "7.1",
    label: "Operating security profile"
  },
  {
    key: "market-liquidity-demand",
    title: "MARKET LIQUIDITY & DEMAND",
    code: "8.1",
    label: "Exit demand and buyer absorption"
  },
  {
    key: "environmental-nuisance",
    title: "ENVIRONMENTAL & NUISANCE",
    code: "9.1",
    label: "Environmental pressure and nuisance load"
  }
] as const satisfies readonly AssessmentBlueprintItem[];

type AssessmentCategoryKey = (typeof assessmentBlueprint)[number]["key"];

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

function buildAssessmentCategories(
  notes: Record<AssessmentCategoryKey, string>
): RiskAssessmentCategory[] {
  return assessmentBlueprint.map((category) => ({
    key: category.key,
    title: category.title,
    indicators: [
      {
        code: category.code,
        label: category.label,
        note: notes[category.key]
      }
    ]
  }));
}

export const riskLayers: RiskLayer[] = [
  {
    key: "flooding",
    label: "Flooding",
    shortLabel: "Flood",
    description: "Flood exposure, drainage conditions, and coastal pressure.",
    available: true
  },
  {
    key: "title-complexity",
    label: "Title Complexity",
    shortLabel: "Title",
    description: "Ownership records, document consistency, and title concerns.",
    available: true
  },
  {
    key: "planning-zoning",
    label: "Planning & Zoning",
    shortLabel: "Planning",
    description: "Land use, building approvals, zoning, and demolition exposure.",
    available: true
  },
  {
    key: "infrastructure",
    label: "Infrastructure",
    shortLabel: "Infra",
    description: "Road access, utilities, drainage, and other essential infrastructure.",
    available: true
  },
  {
    key: "security",
    label: "Security",
    shortLabel: "Security",
    description: "Safety conditions, access control, and local security concerns.",
    available: true
  },
  {
    key: "environmental",
    label: "Environmental",
    shortLabel: "Env",
    description: "Noise, pollution, erosion, and other environmental concerns.",
    available: true
  },
  {
    key: "market-liquidity",
    label: "Market Liquidity",
    shortLabel: "Market",
    description: "Buyer demand, pricing support, and how easily a property may be resold.",
    available: true
  }
];

export function scoreToTier(score: number): RiskTier {
  if (score >= 55) return "high";
  if (score >= 35) return "medium";
  return "low";
}

const mapAreaSeeds: MapAreaSeed[] = [
  {
    slug: "victoria-island",
    name: "Victoria Island",
    label: "Victoria Island",
    riskGrade: "low",
    // Compact assessment zone around the OSM/Nominatim Victoria Island centre
    // (lat 6.4300279, lon 3.4259904). These are intentionally inset display
    // polygons, not administrative boundaries, so adjacent districts do not overlap.
    coordinates: [
      [3.41749, 6.43003],
      [3.42174, 6.43566],
      [3.43024, 6.43566],
      [3.43449, 6.43003],
      [3.43024, 6.4244],
      [3.42174, 6.4244]
    ],
    headline: "Institutional depth and mature infrastructure support a relatively low-risk premium position.",
    summary:
      "Victoria Island benefits from stronger commercial density, better infrastructure, and more mature demand support, but planning intensity and coastal conditions still need disciplined review.",
    framingNote:
      "Victoria Island remains one of Lagos' most defensible premium districts, but buyers should still test flood exposure, title quality, and mixed-use planning pressure at property level.",
    assessmentDate: "May 5, 2026",
    analyst: "HIDD Advisory",
    redFlag: "None",
    layerScores: {
      flooding: 34,
      "title-complexity": 26,
      "planning-zoning": 36,
      infrastructure: 20,
      security: 24,
      environmental: 38,
      "market-liquidity": 24
    },
    assessmentNotes: {
      "documentation-quality":
        "Registered title quality is often stronger here, but transaction chain review still matters.",
      "tenure-security-revocation":
        "Competing-claim exposure is comparatively lower, though the property documents still need to be checked.",
      "government-action-demolition":
        "Planning enforcement risk is lower than speculative corridors, but assumptions still need verification.",
      "flooding-drainage":
        "Flood sensitivity varies block by block and still requires property-level validation.",
      "zoning-development-control":
        "Mixed-use pressure makes planning alignment and land-use discipline important.",
      "infrastructure-accessibility":
        "Utilities, access, and market support remain relatively mature for a premium core district.",
      "security-environment":
        "Security conditions are comparatively stable for a high-value commercial and residential zone.",
      "market-liquidity-demand":
        "Liquidity is strong, but weak diligence still gets punished at the premium end.",
      "environmental-nuisance":
        "Coastal and drainage considerations remain relevant despite stronger underlying infrastructure."
    }
  },
  {
    slug: "ikoyi",
    name: "Ikoyi",
    label: "Ikoyi",
    riskGrade: "low",
    // Compact assessment zone around the OSM/Nominatim Ikoyi centre
    // (lat 6.4523431, lon 3.4280523).
    coordinates: [
      [3.41905, 6.45234],
      [3.42355, 6.45754],
      [3.43255, 6.45754],
      [3.43705, 6.45234],
      [3.43255, 6.44714],
      [3.42355, 6.44714]
    ],
    headline: "Premium district with strong demand, but title and planning checks still matter.",
    summary:
      "Ikoyi remains one of Lagos' strongest premium districts, with resilient demand and relatively mature infrastructure, but buyers should still test title chains, zoning edge cases, and pricing discipline.",
    framingNote:
      "Ikoyi's reputation does not remove the need for careful checks. Family-held properties, redevelopment pressure, and assumptions about title quality can still create buyer risk.",
    assessmentDate: "May 5, 2026",
    analyst: "HIDD Advisory",
    redFlag: "None",
    layerScores: {
      flooding: 22,
      "title-complexity": 28,
      "planning-zoning": 34,
      infrastructure: 18,
      security: 20,
      environmental: 28,
      "market-liquidity": 26
    },
    assessmentNotes: {
      "documentation-quality":
        "Title records are generally stronger, though family-held properties can still have document gaps or inconsistencies.",
      "tenure-security-revocation":
        "Competing-claim risk is lower than many Lagos corridors, but tenure assumptions still need proof.",
      "government-action-demolition":
        "Enforcement pressure is lower than emerging corridors, but planning status still matters.",
      "flooding-drainage":
        "Flood exposure is comparatively contained, though site-specific drainage checks still matter.",
      "zoning-development-control":
        "Redevelopment pressure makes planning compliance worth checking closely.",
      "infrastructure-accessibility":
        "Road access and utilities are stronger than most Lagos submarkets.",
      "security-environment":
        "Premium estates and institutional presence support stronger operating security conditions.",
      "market-liquidity-demand":
        "Liquidity is strong for the right stock, but pricing discipline still matters.",
      "environmental-nuisance":
        "Environmental pressure is moderate and usually site-specific rather than district-wide."
    }
  },
  {
    slug: "banana-island",
    name: "Banana Island",
    label: "Banana Island",
    riskGrade: "low",
    // Compact assessment zone around the centre of OSM way 1020019238
    // (lat 6.4600581, lon 3.4593152). It is inset from greater Ikoyi so the
    // two selectable assessment zones remain visually and spatially distinct.
    coordinates: [
      [3.45332, 6.46006],
      [3.45632, 6.46396],
      [3.46232, 6.46396],
      [3.46532, 6.46006],
      [3.46232, 6.45616],
      [3.45632, 6.45616]
    ],
    headline: "Prestige and control support a low-risk profile, but premium pricing still demands exacting review.",
    summary:
      "Banana Island benefits from stronger access control and market positioning, but buyers should still pressure-test environmental resilience, serviceability, and title quality rather than assuming comfort.",
    framingNote:
      "This is a prestige micro-market. The strongest risk here is buyer overconfidence: premium branding can hide weak technical assumptions, especially on pricing and environmental exposure.",
    assessmentDate: "May 5, 2026",
    analyst: "HIDD Advisory",
    redFlag: "Coastal exposure",
    layerScores: {
      flooding: 30,
      "title-complexity": 18,
      "planning-zoning": 28,
      infrastructure: 16,
      security: 18,
      environmental: 36,
      "market-liquidity": 32
    },
    assessmentNotes: {
      "documentation-quality":
        "Title quality tends to be stronger here, though documentation should never be assumed.",
      "tenure-security-revocation":
        "Tenure security is relatively stronger, but premium acquisitions still need independent verification.",
      "government-action-demolition":
        "Demolition exposure is lower, though planning assumptions still need confirmation.",
      "flooding-drainage":
        "Water-adjacent conditions make drainage and resilience checks essential.",
      "zoning-development-control":
        "Redevelopment intensity still warrants planning confirmation despite the controlled environment.",
      "infrastructure-accessibility":
        "Infrastructure maturity is high by Lagos standards, with stronger service expectations built in.",
      "security-environment":
        "Access controls and neighbourhood profile support a lower day-to-day operating risk position.",
      "market-liquidity-demand":
        "Liquidity is premium, but price sensitivity is high at the top end of the market.",
      "environmental-nuisance":
        "Environmental exposure remains relevant because of coastal conditions and resilience assumptions."
    }
  },
  {
    slug: "lekki-phase-1",
    name: "Lekki Phase 1",
    label: "Lekki Phase 1",
    riskGrade: "medium",
    // Compact assessment zone around the OSM/Nominatim Lekki Phase I centre
    // (lat 6.4413987, lon 3.4704698).
    coordinates: [
      [3.46147, 6.4414],
      [3.46597, 6.4466],
      [3.47497, 6.4466],
      [3.47947, 6.4414],
      [3.47497, 6.4362],
      [3.46597, 6.4362]
    ],
    headline: "Demand remains strong, but flood pressure, access, and planning quality vary materially by pocket.",
    summary:
      "Lekki Phase 1 continues to attract strong demand, but drainage, road access, and uneven development make a property-specific review essential before you buy.",
    framingNote:
      "Lekki Phase 1 should not be treated as uniformly low-risk. Buyers need to read it block by block, especially on drainage, access, and development quality.",
    assessmentDate: "May 5, 2026",
    analyst: "HIDD Advisory",
    redFlag: "Block-by-block flood variance",
    layerScores: {
      flooding: 54,
      "title-complexity": 34,
      "planning-zoning": 40,
      infrastructure: 42,
      security: 28,
      environmental: 38,
      "market-liquidity": 34
    },
    assessmentNotes: {
      "documentation-quality":
        "Documentation quality can vary with development history and transaction chain complexity.",
      "tenure-security-revocation":
        "Competing-claim risk is moderate and should be checked carefully for the specific property.",
      "government-action-demolition":
        "Enforcement exposure is moderate and often turns on planning compliance.",
      "flooding-drainage":
        "Flood and drainage performance can diverge meaningfully between blocks.",
      "zoning-development-control":
        "Mixed residential and commercial pressure makes zoning review important.",
      "infrastructure-accessibility":
        "Infrastructure is relatively mature, but access pressure remains a live operating issue.",
      "security-environment":
        "Security is better than fringe corridors, but still estate-specific rather than uniform.",
      "market-liquidity-demand":
        "Liquidity is healthy, though pricing discipline should not be relaxed.",
      "environmental-nuisance":
        "Environmental exposure is moderate and strongly location dependent."
    }
  },
  {
    slug: "eko-atlantic",
    name: "Eko Atlantic",
    label: "Eko Atlantic",
    riskGrade: "medium",
    // Compact assessment zone around the centre of OSM way 375803555
    // (lat 6.4096024, lon 3.4182044).
    coordinates: [
      [3.4092, 6.4096],
      [3.4137, 6.4148],
      [3.4227, 6.4148],
      [3.4272, 6.4096],
      [3.4227, 6.4044],
      [3.4137, 6.4044]
    ],
    headline: "High-ambition district with strong upside, but delivery, infrastructure, and market absorption need sharper scrutiny.",
    summary:
      "Eko Atlantic represents a premium future-facing district with strong branding and long-term upside. Buyers should still assess execution risk, utility readiness, market absorption, and environmental resilience carefully.",
    framingNote:
      "Eko Atlantic operates under a distinct title and governance regime, separate from the Lagos State Lands Bureau framework that applies elsewhere on Lagos Island. Buyers should treat the ambitious market story as a reason to raise the diligence standard, not relax it — particularly on title structure, infrastructure delivery, and market absorption.",
    assessmentDate: "May 5, 2026",
    analyst: "HIDD Advisory",
    redFlag: "Delivery & absorption risk",
    layerScores: {
      flooding: 44,
      "title-complexity": 28,
      "planning-zoning": 30,
      infrastructure: 40,
      security: 24,
      environmental: 46,
      "market-liquidity": 52
    },
    assessmentNotes: {
      "documentation-quality":
        "Documentation paths are structured, but transaction review should still be independent.",
      "tenure-security-revocation":
        "The title and governance regime is distinct, so buyers should treat tenure assumptions carefully.",
      "government-action-demolition":
        "Formal planning reduces demolition pressure relative to informal corridors.",
      "flooding-drainage":
        "Coastal engineering is core to the proposition, but resilience assumptions still need scrutiny.",
      "zoning-development-control":
        "Master-planned positioning helps, though scheme-specific approvals still matter.",
      "infrastructure-accessibility":
        "Infrastructure promise is strong, but delivery maturity still varies by location and phase.",
      "security-environment":
        "Controlled access supports a lower security risk profile than more porous districts.",
      "market-liquidity-demand":
        "Liquidity depends heavily on product type, timing, and buyer profile.",
      "environmental-nuisance":
        "Coastal and reclamation context justify closer environmental review."
    }
  }
];

export const mapAreas: MapArea[] = mapAreaSeeds.map(
  ({ coordinates, assessmentNotes, ...area }) => ({
    ...area,
    geojsonFeature: polygon(coordinates),
    assessmentCategories: buildAssessmentCategories(assessmentNotes)
  })
);

export function getMapArea(slug: string) {
  return mapAreas.find((area) => area.slug === slug);
}
