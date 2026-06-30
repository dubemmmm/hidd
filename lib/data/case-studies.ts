import type { CaseStudyDetail } from "@/lib/types";

export const caseStudies: CaseStudyDetail[] = [
  {
    slug: "lekki-phase-1-overpriced-duplex",
    title: "How HIDD Helped a Buyer Renegotiate an Overpriced Lekki Phase 1 Duplex",
    summary:
      "A diaspora buyer was close to accepting the asking price until HIDD's inspection and valuation work exposed repair costs and weak comparable support.",
    clientProfile: "Diaspora residential buyer",
    location: "Lekki Phase 1, Lagos",
    service: "valuation",
    preventedRisk: "Overpaying for visible finish quality while ignoring defects and weak pricing evidence.",
    publishedAt: "2026-05-20T09:00:00.000Z",
    readTime: "4 min read",
    metaTitle: "Lekki Phase 1 Buyer Renegotiation Case Study",
    metaDescription:
      "How HIDD Advisory helped a Lagos property buyer identify defects, pricing gaps, and negotiation leverage before buying in Lekki Phase 1.",
    featured: true,
    sections: [
      {
        title: "The Situation",
        body: [
          "The client had found a recently finished duplex in Lekki Phase 1 and wanted a fast answer before sending funds from abroad. The seller's positioning leaned heavily on premium finishes, new appliances, and scarcity in the immediate neighbourhood.",
          "HIDD was asked to review the asset from a buyer-side perspective: condition, market value, and whether the asking price reflected the actual risk profile."
        ]
      },
      {
        title: "What HIDD Found",
        body: [
          "The inspection surfaced dampness around wet areas, inconsistent external drainage falls, and finish defects that would have become the buyer's cost immediately after handover.",
          "The valuation review also showed that the seller's preferred comparables were stronger assets on better streets, while closer evidence supported a lower negotiating range."
        ]
      },
      {
        title: "The Outcome",
        body: [
          "HIDD packaged the defects, likely remediation exposure, and comparable evidence into a concise buyer decision report. The client paused the initial payment request and reopened the commercial discussion.",
          "The result was clear leverage before commitment: the buyer had a defensible basis to negotiate instead of relying on instinct, seller pressure, or informal agent commentary."
        ]
      }
    ]
  },
  {
    slug: "ajah-title-complexity-purchase-pause",
    title: "Why a Land Purchase in Ajah Was Paused Before Payment",
    summary:
      "HIDD's title review flagged document inconsistencies that made the proposed purchase too exposed for the buyer's timeline.",
    clientProfile: "Private land investor",
    location: "Ajah, Lagos",
    service: "legal-due-diligence",
    preventedRisk: "Paying into a transaction with unresolved title-chain and survey inconsistencies.",
    publishedAt: "2026-05-08T09:00:00.000Z",
    readTime: "3 min read",
    metaTitle: "Ajah Land Purchase Pause Case Study",
    metaDescription:
      "How HIDD Advisory's legal due diligence helped a Lagos land buyer pause an exposed Ajah transaction before payment.",
    featured: true,
    sections: [
      {
        title: "The Situation",
        body: [
          "The client was considering a land purchase in Ajah and had been told the documents were straightforward. The transaction was moving quickly, with pressure to make a substantial payment to secure the plot.",
          "HIDD was engaged to review the document set and highlight whether the buyer could proceed, renegotiate, or pause."
        ]
      },
      {
        title: "What HIDD Found",
        body: [
          "The review found inconsistencies between the survey description, seller representations, and the supporting title history. None of the issues automatically meant the asset was impossible to buy, but they did mean the risk was not priced or resolved.",
          "The buyer would have been accepting open documentation questions while giving up leverage through payment."
        ]
      },
      {
        title: "The Outcome",
        body: [
          "HIDD advised the client to pause payment until the seller corrected the document gaps and provided stronger evidence. That prevented the buyer from absorbing seller-side uncertainty as buyer-side risk.",
          "The client retained capital control and avoided becoming locked into a transaction that required more diligence than the seller had disclosed."
        ]
      }
    ]
  },
  {
    slug: "victoria-island-drainage-risk-before-close",
    title: "The Drainage Issue That Changed a Victoria Island Closing Decision",
    summary:
      "A premium apartment looked clean on presentation, but HIDD's inspection reframed the risk around drainage, moisture, and post-closing repair exposure.",
    clientProfile: "Owner-occupier buyer",
    location: "Victoria Island, Lagos",
    service: "home-inspection",
    preventedRisk: "Accepting a premium apartment without pricing in drainage and dampness exposure.",
    publishedAt: "2026-04-26T09:00:00.000Z",
    readTime: "4 min read",
    metaTitle: "Victoria Island Inspection Case Study",
    metaDescription:
      "How HIDD Advisory helped a Victoria Island buyer identify drainage and dampness exposure before closing.",
    featured: false,
    sections: [
      {
        title: "The Situation",
        body: [
          "The buyer was reviewing a premium Victoria Island apartment that presented well during walkthroughs. The finishes were strong, the building was occupied, and the seller wanted a quick close.",
          "HIDD was asked to perform a technical review focused on what a typical visual walkthrough might miss."
        ]
      },
      {
        title: "What HIDD Found",
        body: [
          "The inspection identified dampness signals, poor drainage behavior around key external areas, and early signs that water management had not been properly resolved.",
          "Those issues changed the discussion from aesthetic quality to operational cost after purchase."
        ]
      },
      {
        title: "The Outcome",
        body: [
          "The buyer used HIDD's report to require remedial work before closing. Instead of inheriting the repairs, the buyer made the problem visible while commercial leverage still existed.",
          "The transaction did not have to collapse, but it moved forward with clearer conditions and a better understanding of post-closing risk."
        ]
      }
    ]
  }
];

export function getLocalCaseStudy(slug: string) {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}
