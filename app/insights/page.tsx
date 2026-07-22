import type { Metadata } from "next";

import { InsightsFilter } from "@/components/insights-filter";
import { ReportsLibrary } from "@/components/reports-library";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getAllInsights } from "@/lib/insights";
import { getReportAssets } from "@/lib/reports";

type InsightsPageProps = {
  searchParams?: Promise<{ asset?: string }> | { asset?: string };
};

export const metadata: Metadata = {
  title: "Insights / Library",
  description:
    "Editorial and downloadable HIDD intelligence assets in one browse layer for Lagos property decisions."
};

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const [posts, reportAssets] = await Promise.all([getAllInsights(), getReportAssets()]);

  return (
    <>
      <section className="page-hero page-hero--reports page-hero--insights">
        <div className="shell shell--reports">
          <Reveal>
            <div className="page-hero__content page-hero__content--reports insights-hero">
              <div className="section-heading__eyebrow">Insights / Library</div>
              <h1>Editorial and downloadable intelligence in one HIDD browse layer.</h1>
              <p>
                Explore HIDD reports, checklists, neighbourhood briefs, and expert articles—all in
                one place.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--insights-library">
        <div className="shell shell--reports">
          <Reveal>
            <div className="insights-section-heading">
              <SectionHeading
                eyebrow="The library"
                title="Unlock what&apos;s live. Browse what&apos;s published."
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ReportsLibrary
              assets={reportAssets}
              initialAssetSlug={resolvedSearchParams.asset}
            />
          </Reveal>
        </div>
      </section>

      <section className="section section--insights-articles">
        <div className="shell shell--reports insights-articles">
          <Reveal>
            <div className="insights-section-heading">
              <SectionHeading
                eyebrow="Browse articles"
                title="Filter by content pillar"
                description="Each article links back to the relevant HIDD service, carries an explicit read time, and appears once in the browse layer."
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <InsightsFilter posts={posts} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
