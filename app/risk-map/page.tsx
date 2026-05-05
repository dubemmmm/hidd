import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import RiskComparison from "@/components/risk-comparison";
import { getMapAreas } from "@/lib/map-areas";

export const metadata: Metadata = {
  title: "Area Compare",
  description:
    "Compare HIDD's launch neighbourhoods across risk dimensions including flooding, title complexity, planning, infrastructure, security, environmental pressure, and market liquidity."
};

export const revalidate = 60;

export default async function RiskMapPage() {
  const mapAreas = await getMapAreas();

  return (
    <>
      <section className="page-hero page-hero--map">
        <div className="shell shell--map-page">
          <Reveal>
            <div className="page-hero__content page-hero__content--map-page">
              <div className="section-heading__eyebrow">Area Compare</div>
              <h1>Neighbourhood-level judgement before you commit capital.</h1>
              <p>
                HIDD&apos;s launch comparison tool lets you stack premium Lagos districts against one
                another, read the shape of their risk exposure, and move straight into a dedicated
                district brief when you need deeper context.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--map-page">
          <Reveal>
            <RiskComparison areas={mapAreas} />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Need the full Risk Intelligence engagement?"
        description="The public map is an entry point. The full HIDD service goes deeper into neighbourhood and transaction risk."
        primaryHref="/contact?service=risk-intelligence"
        primaryLabel="Book Risk Intelligence"
      />
    </>
  );
}
