import type { Metadata } from "next";

import { InsightsFilter } from "@/components/insights-filter";
import { ReportsLibrary } from "@/components/reports-library";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getAllInsights } from "@/lib/insights";
import { getReportAssets } from "@/lib/reports";
import { createPageMetadata } from "@/lib/seo";

type InsightsPageProps = {
  searchParams?: Promise<{ asset?: string }> | { asset?: string };
};

export const metadata: Metadata = createPageMetadata({
  title: "Property Insights and Buyer Resources",
  description:
    "Browse HIDD reports, checklists, neighbourhood briefs, comparisons, and expert guidance for Lagos property buyers.",
  path: "/insights"
});

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const [posts, reportAssets] = await Promise.all([getAllInsights(), getReportAssets()]);

  return (
    <>
      <section className="page-hero page-hero--reports page-hero--insights">
        <div className="shell shell--reports">
          <Reveal>
            <div className="page-hero__content page-hero__content--reports insights-hero">
              <div className="section-heading__eyebrow">Insights</div>
              <h1>Reports and expert guidance for Lagos property buyers.</h1>
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
                title="Download available resources and see what is coming next."
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

      <section id="browse-articles" className="section section--insights-articles">
        <div className="shell shell--reports insights-articles">
          <Reveal>
            <div className="insights-section-heading">
              <SectionHeading
                eyebrow="Browse articles"
                title="Find articles by topic"
                description="Choose a topic to find practical guidance and the HIDD service that can help with your property decision."
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
