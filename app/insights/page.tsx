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
      <section className="page-hero page-hero--reports">
        <div className="shell shell--reports">
          <Reveal>
            <div className="page-hero__content page-hero__content--reports">
              <div className="section-heading__eyebrow">Insights / Library</div>
              <h1>Editorial and downloadable intelligence in one HIDD browse layer.</h1>
              <p>
                Browse HIDD&apos;s reports, checklists, neighbourhood briefs, and editorial in one
                place instead of splitting the authority layer across separate tabs.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--reports">
          <Reveal>
            <SectionHeading
              eyebrow="The library"
              title="Unlock what&apos;s live. Browse what&apos;s published."
              description="Downloadable assets and editorial now sit on one authority page so the HIDD browse layer feels unified."
              centered
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ReportsLibrary
              assets={reportAssets}
              initialAssetSlug={resolvedSearchParams.asset}
            />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Browse articles"
              title="Filter by content pillar"
              description="Each article links back to the relevant HIDD service, carries an explicit read time, and appears once in the browse layer."
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
