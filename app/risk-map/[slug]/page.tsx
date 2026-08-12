import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";

import { BackButton } from "@/components/back-button";
import { CtaBand } from "@/components/cta-band";
import { DistrictAssessmentGrid } from "@/components/district-assessment-grid";
import { portableTextComponents } from "@/components/portable-text";
import { Reveal } from "@/components/reveal";
import { SanityPreviewBanner } from "@/components/sanity-preview-banner";
import { SectionHeading } from "@/components/section-heading";
import { getMapArea } from "@/lib/map-areas";
import { createPageMetadata } from "@/lib/seo";
import type { RiskTier } from "@/lib/types";

type NeighbourhoodPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export const revalidate = 60;

export async function generateMetadata({ params }: NeighbourhoodPageProps): Promise<Metadata> {
  const { slug } = await Promise.resolve(params);
  const area = await getMapArea(slug);

  if (!area) return {};

  return createPageMetadata({
    title: area.name,
    description: area.summary,
    path: `/risk-map/${area.slug}`
  });
}

export default async function NeighbourhoodPage({ params }: NeighbourhoodPageProps) {
  const { slug } = await Promise.resolve(params);
  const { isEnabled: isPreview } = await draftMode();
  const area = await getMapArea(slug, isPreview);

  if (!area) {
    notFound();
  }

  return (
    <>
      {isPreview ? (
        <SanityPreviewBanner />
      ) : null}
      <section className="page-hero page-hero--district">
        <div className="shell shell--district">
          <Reveal>
            <div className="page-hero__content page-hero__content--district">
              <BackButton fallbackHref="/risk-map" label="Back" className="back-link back-link--button" />
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
              <div className="section-heading__eyebrow district-summary-card__eyebrow">
                Area overview
              </div>
              <div className="district-summary-card__intro">
                <div className="district-summary-card__copy">
                  <h2>Current assessment</h2>
                  <p>{area.summary}</p>
                </div>
                <div className={`district-grade district-grade--${area.riskGrade}`}>
                  <span>Current risk grade</span>
                  <strong>{formatRiskTier(area.riskGrade)}</strong>
                  <small>Data as of {area.assessmentDate}</small>
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
                <span className="district-framing-note__eyebrow">What to keep in mind</span>
                <p>{area.framingNote}</p>
              </div>
              <p className="district-methodology-link">
                <a href="/risk-map/methodology">See how HIDD produces district ratings →</a>
              </p>
              {area.briefBody && area.briefBody.length > 0 ? (
                <div className="district-brief-body">
                  <PortableText
                    value={area.briefBody as Parameters<typeof PortableText>[0]["value"]}
                    components={portableTextComponents}
                  />
                </div>
              ) : null}
            </article>
          </Reveal>
        </div>
      </section>

      <section id="assessment-categories" className="section section--muted">
        <div className="shell shell--district">
          <Reveal>
            <SectionHeading
              eyebrow="Assessment categories"
              title="What HIDD assessed"
              description="Review the main title, planning, infrastructure, environmental, security, and market factors for this district."
            />
          </Reveal>
          <DistrictAssessmentGrid categories={area.assessmentCategories} />
        </div>
      </section>

      <CtaBand
        title={`Need deeper diligence on ${area.name}?`}
        description="Book HIDD Risk Intelligence for a more detailed review of the area and the risks relevant to your purchase."
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
