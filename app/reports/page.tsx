import type { Metadata } from "next";

import { ReportsLibrary } from "@/components/reports-library";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { reportAssets } from "@/lib/data/reports";

type ReportsPageProps = {
  searchParams?: Promise<{ asset?: string }> | { asset?: string };
};

export const metadata: Metadata = {
  title: "Reports / Library",
  description:
    "Downloadable HIDD intelligence assets, gated behind email capture and structured for later CRM integration."
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});

  return (
    <>
      <section className="page-hero page-hero--reports">
        <div className="shell shell--reports">
          <Reveal>
            <div className="page-hero__content page-hero__content--reports">
              <div className="section-heading__eyebrow">Reports / Library</div>
              <h1>Downloadable intelligence assets that convert before the service sale.</h1>
              <p>
                This library gives HIDD a dedicated conversion surface for flagship reports,
                checklists, and neighbourhood briefs, all behind a structured email gate.
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
              title="Unlock what's live. Join the waitlist for what's next."
              centered
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ReportsLibrary assets={reportAssets} initialAssetSlug={resolvedSearchParams.asset} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
