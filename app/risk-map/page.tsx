import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import RiskMap from "@/components/risk-map";

export const metadata: Metadata = {
  title: "Risk Map",
  description:
    "Explore HIDD's launch neighbourhood risk map covering Victoria Island, Ikoyi, Banana Island, Lekki Phase 1, and Eko Atlantic."
};

export default function RiskMapPage() {
  return (
    <>
      <section className="page-hero page-hero--map">
        <div className="shell shell--map-page">
          <Reveal>
            <div className="page-hero__content page-hero__content--map-page">
              <div className="section-heading__eyebrow">Risk Map</div>
              <h1>Neighbourhood-level judgement before you commit capital.</h1>
              <p>
                HIDD&apos;s launch map is built around five premium Lagos districts with polygon
                selection, compact risk summaries, and direct routing into dedicated district briefs.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--map-page">
          <Reveal>
            <RiskMap variant="page" />
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
