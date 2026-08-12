import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { getProfessionalProfiles, type ProfessionalVertical } from "@/lib/professionals";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About HIDD Advisory",
  description:
    "Meet the professionals responsible for HIDD property inspections, legal due diligence, risk intelligence, and valuation work.",
  path: "/about"
});

export const revalidate = 60;

const verticalLabels: Record<ProfessionalVertical, string> = {
  "home-inspection": "Home Inspection",
  "legal-due-diligence": "Legal Due Diligence",
  "risk-intelligence": "Risk Intelligence",
  valuation: "Valuation"
};

const principles = [
  {
    number: "01",
    title: "Buyer-side independence",
    copy: "Our role is to examine the property and transaction for the buyer, independently of the seller, agent, or developer."
  },
  {
    number: "02",
    title: "Named accountability",
    copy: "Professional profiles identify the experience, registrations, and report responsibilities behind each area of advice."
  },
  {
    number: "03",
    title: "Evidence before opinion",
    copy: "Inspection findings, document review, location evidence, and market analysis are recorded before recommendations are made."
  }
];

export default async function AboutPage() {
  const professionals = await getProfessionalProfiles();

  return (
    <>
      <section className="page-hero page-hero--about">
        <div className="shell shell--support">
          <Reveal>
            <div className="about-hero">
              <div className="section-heading__eyebrow">About HIDD</div>
              <h1>Independent judgement, with clear professional accountability.</h1>
              <p>
                HIDD Advisory helps Lagos property buyers understand the condition, documentation,
                value, and location risks behind a purchase before capital moves.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top about-story">
        <div className="shell shell--support about-story__grid">
          <Reveal>
            <div className="about-story__heading">
              <div className="section-heading__eyebrow">The HIDD story</div>
              <h2>Built around the decision a buyer actually has to make.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="about-story__copy">
              <p>
                Property buyers are often asked to commit money while important questions remain
                divided between agents, lawyers, inspectors, valuers, and informal local advice.
                HIDD was created to bring those questions into one coordinated buyer-side review.
              </p>
              <p>
                Our work covers four connected areas: physical condition, legal due diligence,
                neighbourhood risk, and market value. Each discipline remains professionally
                accountable, while the buyer receives findings that can be considered together.
              </p>
              <p>
                The objective is practical: help a buyer decide whether to proceed, renegotiate,
                investigate further, or pause before signing or paying.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-principles">
        <div className="shell shell--support">
          <Reveal>
            <div className="about-section-heading">
              <div className="section-heading__eyebrow">How we work</div>
              <h2>The standard behind each engagement</h2>
            </div>
          </Reveal>
          <div className="about-principles__grid">
            {principles.map((principle, index) => (
              <Reveal key={principle.number} delay={index * 0.06}>
                <article className="about-principle">
                  <span>{principle.number}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {professionals.length > 0 ? (
        <section className="section about-professionals">
          <div className="shell shell--support">
            <Reveal>
              <div className="about-section-heading">
                <div className="section-heading__eyebrow">Lead professionals</div>
                <h2>The people responsible for HIDD&apos;s professional conclusions</h2>
                <p>
                  Each profile states the professional&apos;s verified credentials and the reports or
                  sections for which they are responsible.
                </p>
              </div>
            </Reveal>

            <div className="professional-grid">
              {professionals.map((professional, index) => (
                <Reveal key={professional.id} delay={(index % 4) * 0.05}>
                  <article className="professional-card">
                    <div className="professional-card__photo">
                      <img src={professional.photoUrl} alt={`Portrait of ${professional.name}`} />
                      <span>{verticalLabels[professional.vertical]}</span>
                    </div>
                    <div className="professional-card__body">
                      <div>
                        <h3>{professional.name}</h3>
                        <p className="professional-card__role">{professional.roleTitle}</p>
                      </div>
                      <p className="professional-card__bio">{professional.bio}</p>
                      <dl className="professional-card__facts">
                        <div>
                          <dt>Experience</dt>
                          <dd>{professional.yearsExperience}+ years</dd>
                        </div>
                        <div>
                          <dt>Qualifications</dt>
                          <dd>{professional.qualifications.join(" · ")}</dd>
                        </div>
                        <div>
                          <dt>Registration</dt>
                          <dd>
                            {professional.registrations
                              .map((item) => `${item.body} · ${item.number}`)
                              .join(" | ")}
                          </dd>
                        </div>
                        <div>
                          <dt>Report responsibility</dt>
                          <dd>{professional.reportResponsibility}</dd>
                        </div>
                      </dl>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Need independent review before you commit?"
        description="Tell HIDD about the property, documents, location, and decision timeline."
        primaryHref="/contact"
        primaryLabel="Request an Assessment"
      />
    </>
  );
}
