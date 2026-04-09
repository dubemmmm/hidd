import type { Metadata } from "next";

import { InsightsFilter } from "@/components/insights-filter";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getAllInsights } from "@/lib/insights";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Market analysis, neighbourhood guides, legal explainers, and buying discipline for Lagos property decisions."
};

export default async function InsightsPage() {
  const posts = await getAllInsights();

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <Reveal>
            <div className="page-hero__content">
              <div className="section-heading__eyebrow">Insights</div>
              <h1>The content hub for Lagos property risk, due diligence, and market intelligence.</h1>
              <p>
                Published editorial content for buyers, investors, and operators who need sharper
                Lagos property judgement before capital moves.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Browse articles"
              title="Filter by content pillar"
              description="Each article is structured for SEO, sharing, and a direct route back into the relevant HIDD service."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <InsightsFilter posts={posts} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
