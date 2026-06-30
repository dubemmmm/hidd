import Link from "next/link";
import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getCaseStudies } from "@/lib/case-studies";
import { comprehensiveReport, getService } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real HIDD Advisory transaction-impact stories showing what buyers avoided, renegotiated, or clarified before committing capital."
};

export const revalidate = 60;

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <>
      <section className="page-hero">
        <div className="shell shell--reports">
          <Reveal>
            <div className="page-hero__content page-hero__content--reports">
              <div className="section-heading__eyebrow">Case Studies</div>
              <h1>Buyer-side case studies from HIDD advisory work.</h1>
              <p>
                See what HIDD helped buyers prevent, renegotiate, or clarify before they committed
                to exposed property transactions.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--reports">
          <Reveal>
            <SectionHeading
              eyebrow="Case archive"
              title="What changed before the buyer committed"
              description="Each case study focuses on the decision point: the risk identified, what HIDD prevented, and how the buyer used the evidence."
              centered
            />
          </Reveal>

          <div className="case-study-grid" aria-label="Browse case studies">
            {caseStudies.map((caseStudy, index) => {
              const relatedService =
                caseStudy.service === "comprehensive-report"
                  ? comprehensiveReport
                  : getService(caseStudy.service);

              return (
                <Reveal key={caseStudy.slug} delay={index * 0.05}>
                  <Link href={`/case-studies/${caseStudy.slug}`} className="case-study-card">
                    <span className="case-study-card__meta">
                      {caseStudy.location} · {relatedService?.name ?? "HIDD Advisory"}
                    </span>
                    <h2>{caseStudy.title}</h2>
                    <p>{caseStudy.summary}</p>
                    <div className="case-study-card__prevented">
                      <span>What HIDD prevented</span>
                      <strong>{caseStudy.preventedRisk}</strong>
                    </div>
                    <div className="case-study-card__footer">
                      <span>{caseStudy.clientProfile}</span>
                      <span>
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }).format(new Date(caseStudy.publishedAt))}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CtaBand
        title="Want HIDD to review a live transaction?"
        description="Send the property details before payment, signing, or closing so the risk can be assessed while leverage still exists."
        primaryHref="/contact"
        primaryLabel="Start an enquiry"
      />
    </>
  );
}
