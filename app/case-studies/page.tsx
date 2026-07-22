import type { Metadata } from "next";

import { CaseStudiesBrowser } from "@/components/case-studies-browser";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getCaseStudies } from "@/lib/case-studies";

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
      <section className="page-hero page-hero--case-studies">
        <div className="shell shell--case-studies">
          <Reveal>
            <div className="page-hero__content case-studies-hero">
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

      <section className="section section--case-studies-archive">
        <div className="shell shell--case-studies">
          <Reveal>
            <div className="case-studies-archive-heading">
              <SectionHeading
                eyebrow="Case archive"
                title="What changed before the buyer committed"
                description="Each case study focuses on the decision point: the risk identified, what HIDD prevented, and how the buyer used the evidence."
              />
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <CaseStudiesBrowser items={caseStudies} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
