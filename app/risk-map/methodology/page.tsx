import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { riskLayers } from "@/lib/data/map-areas";
import { radarAxisLabels } from "@/lib/data/radar-config";
import { getMapAreas } from "@/lib/map-areas";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Area Compare Methodology",
  description:
    "How HIDD collects, dates, scores, and presents its Lagos neighbourhood risk assessments.",
  path: "/risk-map/methodology"
});

export const revalidate = 60;

const sourceGroups = [
  {
    title: "Land, title and planning evidence",
    description:
      "Available title, survey, planning, zoning, development-control, acquisition and demolition information relevant to the district."
  },
  {
    title: "Physical and environmental evidence",
    description:
      "Observed or documented drainage, flood and coastal exposure, road access, utilities, infrastructure, pollution, erosion and nuisance conditions."
  },
  {
    title: "Market evidence",
    description:
      "Available demand, resale, pricing-support and absorption evidence used to assess how readily property in the district may trade."
  },
  {
    title: "Local operating context",
    description:
      "Available safety information, access-control conditions and other location-specific observations relevant to day-to-day ownership."
  },
  {
    title: "Professional review",
    description:
      "HIDD reviews the available evidence and records the supporting assessment notes, analyst and applicable assessment date for each district."
  }
];

export default async function AreaCompareMethodologyPage() {
  const areas = await getMapAreas();

  return (
    <>
      <section className="page-hero page-hero--methodology">
        <div className="shell shell--editorial">
          <Reveal>
            <div className="methodology-hero">
              <Link href="/risk-map" className="back-link">Back to Area Compare</Link>
              <div className="section-heading__eyebrow">Methodology</div>
              <h1>How HIDD produces district ratings.</h1>
              <p>
                Area Compare is a screening view of neighbourhood-level evidence. This page sets
                out what informs the ratings, how the scale works, when the data was assessed, and
                what the comparison cannot tell you.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--editorial methodology-layout">
          <Reveal>
            <aside className="methodology-index" aria-label="Methodology contents">
              <span>On this page</span>
              <a href="#sources">Data sources</a>
              <a href="#scoring">Scoring</a>
              <a href="#dates">Data dates</a>
              <a href="#updates">Updates</a>
              <a href="#limitations">Limitations</a>
            </aside>
          </Reveal>

          <div className="methodology-content">
            <Reveal>
              <section id="sources" className="methodology-section">
                <div className="methodology-section__heading">
                  <span>01</span>
                  <div>
                    <p>Data sources</p>
                    <h2>Evidence reviewed for each district</h2>
                  </div>
                </div>
                <p className="methodology-lead">
                  The exact documents and observations available differ by district. HIDD draws
                  from the following evidence groups and records district-specific supporting notes
                  in each neighbourhood brief.
                </p>
                <div className="methodology-source-list">
                  {sourceGroups.map((source) => (
                    <article key={source.title}>
                      <h3>{source.title}</h3>
                      <p>{source.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section id="scoring" className="methodology-section">
                <div className="methodology-section__heading">
                  <span>02</span>
                  <div>
                    <p>Scoring dimensions</p>
                    <h2>Seven factors, one fixed scale</h2>
                  </div>
                </div>
                <p className="methodology-lead">
                  Each factor is assessed from 0 to 100 in risk direction: a higher stored score
                  means greater concern. The scale is always fixed at 0–100 and never expands or
                  contracts to fit the districts currently selected.
                </p>

                <div className="methodology-band-table" aria-label="Risk band thresholds">
                  <div><span>0–34</span><strong>Low risk</strong></div>
                  <div><span>35–54</span><strong>Mid risk</strong></div>
                  <div><span>55–100</span><strong>High risk</strong></div>
                </div>

                <div className="methodology-dimensions">
                  {riskLayers.map((layer) => (
                    <article key={layer.key}>
                      <span>{radarAxisLabels[layer.key]}</span>
                      <h3>{layer.label}</h3>
                      <p>{layer.description}</p>
                    </article>
                  ))}
                </div>

              </section>
            </Reveal>

            <Reveal>
              <section id="dates" className="methodology-section">
                <div className="methodology-section__heading">
                  <span>03</span>
                  <div>
                    <p>Data collection dates</p>
                    <h2>The date belongs to the rating</h2>
                  </div>
                </div>
                <p className="methodology-lead">
                  Ratings describe the evidence available at the date shown. Every comparison and
                  district brief displays its applicable date; it should be considered part of the
                  rating, not a footnote.
                </p>
                <div className="methodology-date-register">
                  {areas.map((area) => (
                    <Link key={area.slug} href={`/risk-map/${area.slug}`}>
                      <span>{area.name}</span>
                      <strong>{area.assessmentDate}</strong>
                      <small>Open district brief →</small>
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal>
              <section id="updates" className="methodology-section">
                <div className="methodology-section__heading">
                  <span>04</span>
                  <div>
                    <p>Update frequency</p>
                    <h2>Rolling review, not live monitoring</h2>
                  </div>
                </div>
                <p className="methodology-lead">
                  District assessments are reviewed on a rolling basis and may be updated when HIDD
                  identifies material new evidence. They are not real-time feeds. Before relying on
                  a rating for a transaction, check its displayed date and request a current,
                  property-specific assessment where the timing or exposure matters.
                </p>
              </section>
            </Reveal>

            <Reveal>
              <section id="limitations" className="methodology-section">
                <div className="methodology-section__heading">
                  <span>05</span>
                  <div>
                    <p>Limitations</p>
                    <h2>What Area Compare does not establish</h2>
                  </div>
                </div>
                <ul className="methodology-limitations">
                  <li>A district rating does not determine the condition, title or value of a particular property.</li>
                  <li>Conditions can vary materially by street, estate, building and date.</li>
                  <li>Available records may be incomplete, delayed, disputed or changed after assessment.</li>
                  <li>The radar shape is a comparison aid and must not be read as a probability or forecast.</li>
                  <li>Area Compare does not replace inspection, legal due diligence, valuation or transaction-specific risk review.</li>
                </ul>
                <div className="methodology-actions">
                  <Link href="/risk-map" className="button button--ghost">Return to Area Compare</Link>
                  <Link href="/contact?service=risk-intelligence" className="button button--primary">
                    Request a current assessment
                  </Link>
                </div>
              </section>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
