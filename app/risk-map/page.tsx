import type { Metadata } from "next";
import { draftMode } from "next/headers";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import RiskComparison from "@/components/risk-comparison";
import { SanityPreviewBanner } from "@/components/sanity-preview-banner";
import { getMapAreas } from "@/lib/map-areas";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Compare Lagos Neighbourhood Risks",
  description:
    "Compare Lagos districts across flooding, title, planning, infrastructure, safety, environment, and market liquidity before you buy.",
  path: "/risk-map"
});

export const revalidate = 60;

export default async function RiskMapPage() {
  const { isEnabled: isPreview } = await draftMode();
  const mapAreas = await getMapAreas(isPreview);

  return (
    <>
      {isPreview ? (
        <SanityPreviewBanner gateOpen />
      ) : null}
      <section className="page-hero page-hero--map">
        <div className="shell shell--map-page">
          <Reveal>
            <div className="page-hero__content page-hero__content--map-page">
              <div className="section-heading__eyebrow">Area Compare</div>
              <h1>Neighbourhood-level judgement before you commit capital.</h1>
              <p>
                Compare premium Lagos districts, see where their strengths and risks differ, and
                open a district brief for a closer review.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--map-page">
          <Reveal>
            <RiskComparison areas={mapAreas} isPreview={isPreview} />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Need a detailed review of an area?"
        description="HIDD Risk Intelligence examines the neighbourhood and transaction risks that may affect your purchase."
        primaryHref="/contact?service=risk-intelligence"
        primaryLabel="Book Risk Intelligence"
        className="cta-band--hide-mobile"
      />
    </>
  );
}
