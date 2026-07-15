import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";

import { CtaBand } from "@/components/cta-band";
import { portableTextComponents } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getMapArea } from "@/lib/map-areas";
import type { RiskTier } from "@/lib/types";

type NeighbourhoodPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: NeighbourhoodPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const area = await getMapArea(slug);

  if (!area) return {};

  return {
    title: area.name,
    description: area.summary
  };
}

export default async function NeighbourhoodPage({ params }: NeighbourhoodPageProps) {
  const { slug } = await Promise.resolve(params);
  const area = await getMapArea(slug);

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
                Back to Area Compare
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
                  <strong>{formatRiskTier(area.riskGrade)}</strong>
                </div>
              </div>
              <div className="district-assessment-meta">
                <div>
                  <span>Assessment date</span>
                  <strong>{area.assessmentDate}</strong>
                </div>
                <div>
                  <span>Analyst</span>
                  <strong>{area.analyst}</strong>
                </div>
                <div>
                  <span>Red flag</span>
                  <strong>{area.redFlag}</strong>
                </div>
              </div>
              <div className="district-framing-note">
                <span className="district-framing-note__eyebrow">Framing note</span>
                <p>{area.framingNote}</p>
              </div>
              {area.briefBody && area.briefBody.length > 0 ? (
                <div className="district-brief-body">
                  <PortableText
                    value={area.briefBody as Parameters<typeof PortableText>[0]["value"]}
                    components={portableTextComponents}
                  />
                </div>
              ) : (
                <p className="district-summary-card__note">
                  Full neighbourhood intelligence content is still being built. This page exists to
                  give each district a clean destination now, without overloading the launch version.
                </p>
              )}
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section section--muted">
        <div className="shell shell--district">
          <Reveal>
            <SectionHeading
              eyebrow="Assessment categories"
              title="Structured neighbourhood assessment"
              description="A compact launch-format assessment using short indicator notes."
            />
          </Reveal>
          <div className="district-breakdown-grid">
            {area.assessmentCategories.map((category, index) => (
              <Reveal key={category.key} delay={index * 0.03}>
                <article className="district-breakdown-card">
                  <div className="district-breakdown-card__header">
                    <span>{category.title}</span>
                  </div>
                  <div className="district-breakdown-card__items">
                    {category.indicators.map((indicator) => (
                      <div key={indicator.code} className="district-breakdown-card__item">
                        <div className="district-breakdown-card__item-meta">
                          <span>{indicator.code}</span>
                        </div>
                        <div>
                          <strong>{indicator.label}</strong>
                          <p>{indicator.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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

function formatRiskTier(tier: RiskTier) {
  if (tier === "low") return "Low risk";
  if (tier === "medium") return "Mid risk";
  return "High risk";
}
