import { comprehensiveReportFee, serviceFee } from "@/lib/site";
import type { Service } from "@/lib/types";

export const services: Service[] = [
  {
    slug: "home-inspection",
    name: "Home Inspection",
    shortName: "Inspection",
    eyebrow: "Built condition clarity",
    summary:
      "Independent property inspections that expose structural, mechanical, and finishing risks before you commit capital.",
    longDescription:
      "HIDD's home inspection service gives buyers and investors a disciplined technical view of a target property. We assess visible defects, workmanship quality, life-safety concerns, and likely remediation costs so decisions are based on facts instead of seller assurances.",
    heroKicker: "Certified engineers reviewing what the brochure will not show you.",
    fee: serviceFee,
    turnaround: "Turnaround confirmed at engagement",
    accent: "#77a2ff",
    accreditation: ["InterNACHI"],
    included: [
      "Structural observations across walls, slabs, roofing, and settlement indicators",
      "Electrical, plumbing, drainage, and water-pressure checks",
      "Interior and exterior finish review for defects, dampness, and workmanship issues",
      "Snag list prioritised by severity and repair urgency"
    ],
    deliverables: [
      "Written inspection report with annotated issues",
      "Photo-backed defect schedule",
      "Executive summary for buyer decision-making",
      "Follow-up walkthrough call with the HIDD team"
    ],
    process: [
      "Briefing call to understand the asset, location, and transaction timeline",
      "On-site inspection by HIDD technical specialists",
      "Issue grading, cost-risk review, and internal quality check",
      "Digital delivery of the report with next-step recommendations"
    ],
    suitableFor: ["High-value residential purchases", "Diaspora buyers", "Pre-handover snagging"],
    keyMetric: "InterNACHI-focused inspection discipline built for premium Lagos housing stock",
    relatedInsights: ["lagos-buyers-checklist", "lekki-flood-risk-guide"],
    relatedFaqIds: ["report-timeline", "interactive-risk-map", "how-to-get-started"]
  },
  {
    slug: "legal-due-diligence",
    name: "Legal Due Diligence",
    shortName: "Legal",
    eyebrow: "Title and documentation certainty",
    summary:
      "Title verification and land document review designed to protect buyers from forged documents, encumbrances, and transaction blind spots.",
    longDescription:
      "This service is for buyers who need confidence that the seller has the legal right to transfer the asset and that the documentation stack can withstand scrutiny. HIDD coordinates document checks, registry research, and legal risk summaries that help clients avoid expensive disputes.",
    heroKicker: "Clear title strategy for buyers who cannot afford documentation surprises.",
    fee: serviceFee,
    turnaround: "5 to 7 business days",
    accent: "#6ed7bd",
    included: [
      "Review of title documents, surveys, deeds, consent history, and seller representations",
      "Encumbrance and ownership-risk checks using available registry and transaction records",
      "Consistency review between survey, title, and site particulars",
      "Red-flag summary covering gaps, conflicts, and required follow-up"
    ],
    deliverables: [
      "Legal due diligence memorandum",
      "Document checklist with pass / caution / fail flags",
      "Risk summary for buyer counsel or transaction team",
      "Recommended next actions before payment or signing"
    ],
    process: [
      "Document intake and transaction-context review",
      "Legal and title verification workflow",
      "Escalation of material inconsistencies for deeper scrutiny",
      "Delivery of an actionable diligence summary"
    ],
    suitableFor: ["Land purchases", "Estate acquisitions", "Institutional review support"],
    keyMetric: "Built for Lagos title complexity, not generic checklist work",
    relatedInsights: ["governors-consent-explained", "lagos-buyers-checklist"],
    relatedFaqIds: ["documents-needed", "pricing-flat-fee", "is-hidd-regulated"]
  },
  {
    slug: "risk-intelligence",
    name: "Risk Intelligence",
    shortName: "Risk",
    eyebrow: "Area-level investment intelligence",
    summary:
      "Neighbourhood risk analysis covering flood exposure, infrastructure maturity, title friction, and broader development signals.",
    longDescription:
      "HIDD's flagship risk intelligence work helps buyers understand whether an area justifies the asking price and long-term exposure. We combine local market context with risk scoring so the client sees the neighbourhood the way an informed operator would.",
    heroKicker: "The flagship HIDD lens for reading Lagos before you buy into it.",
    fee: serviceFee,
    turnaround: "3 to 5 business days",
    accent: "#f2b764",
    included: [
      "Flood-risk and drainage context review",
      "Infrastructure maturity assessment covering access, utilities, and planned works",
      "Title-complexity and transaction-friction risk grading",
      "Narrative on demand drivers, buyer profile, and downside signals"
    ],
    deliverables: [
      "Area risk scorecard",
      "Neighbourhood narrative summary",
      "Visual dashboard with HIDD ratings",
      "Recommendation on whether to proceed, negotiate, or pause"
    ],
    process: [
      "Confirm target location, intent, and budget range",
      "Pull area intelligence from HIDD data layers and analyst review",
      "Synthesize risk findings into a client-ready dashboard",
      "Deliver recommendation with escalation options for deeper diligence"
    ],
    suitableFor: ["Remote investors", "Site selection", "Land banking decisions"],
    keyMetric: "Built around HIDD's neighbourhood-level risk edge",
    relatedInsights: ["lekki-flood-risk-guide", "ikoyi-vs-victoria-island"],
    relatedFaqIds: ["coverage-areas", "interactive-risk-map", "comprehensive-report"]
  },
  {
    slug: "valuation",
    name: "Valuation",
    shortName: "Valuation",
    eyebrow: "Independent pricing discipline",
    summary:
      "A market-aware view of what a property is worth now, what is driving that value, and where negotiation leverage exists.",
    longDescription:
      "HIDD valuation is built for buyers who need more than seller pricing or informal agent guidance. We frame the subject asset against comparable deals, replacement considerations, and local demand context so clients can pressure-test the asking price before committing.",
    heroKicker: "Independent valuation grounded in Lagos transaction logic and buyer realism.",
    fee: serviceFee,
    turnaround: "5 business days",
    accent: "#de8dd0",
    included: [
      "Comparable market analysis using relevant local benchmarks",
      "Replacement-cost and condition context where appropriate",
      "Demand-side pricing narrative and downside flags",
      "Negotiation guidance on value versus asking expectations"
    ],
    deliverables: [
      "Valuation report with pricing rationale",
      "Comparable evidence summary",
      "Negotiation talking points",
      "Short-form executive summary for decision-makers"
    ],
    process: [
      "Review asset details, seller pricing, and transaction timeline",
      "Benchmark against local comparables and risk profile",
      "Stress-test assumptions affecting current value",
      "Issue the final valuation view with negotiation guidance"
    ],
    suitableFor: ["Luxury residential buyers", "Portfolio reviews", "Pre-acquisition negotiations"],
    keyMetric: "Built to stop buyers overpaying for presentation or hype",
    relatedInsights: ["ikoyi-vs-victoria-island", "lagos-buyers-checklist"],
    relatedFaqIds: ["pricing-flat-fee", "mortgage-support", "comprehensive-report"]
  }
];

export const comprehensiveReport = {
  name: "Comprehensive Report",
  fee: comprehensiveReportFee,
  summary:
    "A bundled engagement that combines inspection, legal diligence, risk intelligence, and valuation into one coordinated buyer decision package.",
  includes: [
    "All four HIDD service verticals under one coordinated workflow",
    "One integrated report pack for high-value acquisitions",
    "A single engagement path for diaspora and institutional buyers",
    "Priority orchestration across inspection, legal, and market review"
  ]
};

export function getService(slug: Service["slug"]) {
  return services.find((service) => service.slug === slug);
}
