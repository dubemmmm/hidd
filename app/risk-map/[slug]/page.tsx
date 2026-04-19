import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getMapArea, mapAreas } from "@/lib/data/map-areas";

type NeighbourhoodPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  return mapAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: NeighbourhoodPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const area = getMapArea(slug);

  if (!area) return {};

  return {
    title: area.name,
    description: area.summary
  };
}

export default async function NeighbourhoodPage({ params }: NeighbourhoodPageProps) {
  const { slug } = await Promise.resolve(params);
  const area = getMapArea(slug);

  if (!area) {
    notFound();
  }

  return (
    <>
      <section className="page-hero page-hero--district">
        <div className="shell shell--district">
          <Reveal>
            <div className="page-hero__content page-hero__content--district">
              <Link href="/risk-map" className="back-link">
                Back to Risk Map
              </Link>
              <div className="section-heading__eyebrow">Neighbourhood brief</div>
              <h1>{area.name}</h1>
              <p>{area.headline}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--district">
          <Reveal>
            <article className="district-summary-card">
              <div className="district-summary-card__intro">
                <div className="district-summary-card__copy">
                  <div className="section-heading__eyebrow">Area overview</div>
                  <h2>Current framing</h2>
                  <p>{area.summary}</p>
                </div>
                <div className={`district-grade district-grade--${area.riskGrade}`}>
                  <span>Current risk grade</span>
                  <strong>{area.riskGrade === "low" ? "Low risk" : area.riskGrade === "medium" ? "Watch closely" : "Elevated risk"}</strong>
                </div>
              </div>
              <div className="district-framing-note">
                <span className="district-framing-note__eyebrow">Framing note</span>
                <p>{area.framingNote}</p>
              </div>
              <p className="district-summary-card__note">
                Full neighbourhood intelligence content is still being built. This page exists to
                give each district a clean destination now, without overloading the launch version.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section section--muted">
        <div className="shell shell--district">
          <Reveal>
            <SectionHeading
              eyebrow="Current risk dimensions"
              title="Current risk breakdown"
              description="A compact placeholder structure for the fuller neighbourhood intelligence layer."
            />
          </Reveal>
          <div className="district-breakdown-grid">
            {area.breakdown.map((item, index) => (
              <Reveal key={item.key} delay={index * 0.03}>
                <article className="district-breakdown-card">
                  <div className={`risk-score risk-score--${item.status}`}>{item.score}</div>
                  <strong>{item.label}</strong>
                  <p>{item.summary}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={`Need deeper diligence on ${area.name}?`}
        description="Move from public neighbourhood framing into the full HIDD Risk Intelligence engagement."
        primaryHref={`/contact?service=risk-intelligence&area=${encodeURIComponent(area.name)}`}
        primaryLabel="Book Risk Intelligence"
      />
    </>
  );
}
