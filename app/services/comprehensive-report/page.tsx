import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/reveal";
import { comprehensiveReport, services } from "@/lib/data/services";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Comprehensive Property Report",
  description:
    "One coordinated HIDD review combining home inspection, legal due diligence, neighbourhood risk intelligence, and property valuation.",
  path: "/services/comprehensive-report"
});

const questions = [
  {
    question: "Is the building sound?",
    answer: "Inspection",
    service: services[0]
  },
  {
    question: "Is the ownership real?",
    answer: "Legal Due Diligence",
    service: services[1]
  },
  {
    question: "Is the location safe and suitable?",
    answer: "Risk Intelligence",
    service: services[2]
  },
  {
    question: "Is the price right?",
    answer: "Valuation",
    service: services[3]
  }
];

const buyerReceives = [
  "One coordinated executive report bringing all four assessments together",
  "Four clearly separated professional component reviews",
  "Photo, document, neighbourhood, and comparable evidence where applicable",
  "A prioritised register of material risks and unresolved questions",
  "Conditions and recommended actions to complete before payment or signing",
  "A final HIDD verdict and a review call to explain the findings"
];

const verdicts = [
  {
    label: "Proceed",
    tone: "proceed",
    copy: "No material issue identified within the scope prevents the buyer from moving forward. Any remaining items are recorded for normal completion."
  },
  {
    label: "Proceed with Conditions",
    tone: "conditions",
    copy: "The purchase should move forward only after the report’s stated legal, technical, pricing, or transaction conditions have been satisfied."
  },
  {
    label: "Do Not Proceed",
    tone: "stop",
    copy: "The review identifies a material risk that cannot presently be resolved, verified, or justified within an acceptable buyer position."
  }
];

export default function ComprehensiveReportPage() {
  const canonicalUrl = absoluteUrl("/services/comprehensive-report");

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          "@id": `${canonicalUrl}#service`,
          name: "HIDD Comprehensive Property Report",
          description: comprehensiveReport.summary,
          url: canonicalUrl,
          areaServed: { "@type": "AdministrativeArea", name: "Lagos, Nigeria" },
          provider: { "@id": `${siteConfig.url}/#organization` },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Comprehensive Report Components",
            itemListElement: questions.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item.answer }
            }))
          }
        }}
      />

      <section className="page-hero page-hero--comprehensive">
        <div className="shell shell--service">
          <Reveal>
            <div className="comprehensive-hero">
              <div className="section-heading__eyebrow">Flagship service</div>
              <h1>Four critical answers. One property decision.</h1>
              <p>
                The HIDD Comprehensive Report combines inspection, legal due diligence, location-risk
                intelligence, and valuation so the buyer can assess the property as one decision—not
                four disconnected opinions.
              </p>
              <div className="comprehensive-hero__actions">
                <Link href="/contact?service=comprehensive-report" className="button button--primary">
                  Request the Comprehensive Report
                </Link>
                <a href="#four-questions" className="button button--ghost">
                  See What Is Included
                </a>
              </div>
              <div className="comprehensive-hero__meta">
                <span>Professional fee</span>
                <strong>{comprehensiveReport.fee}</strong>
                <span>Timing confirmed after the property and document briefing</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="four-questions" className="section comprehensive-questions">
        <div className="shell shell--service">
          <Reveal>
            <div className="comprehensive-section-heading">
              <div className="section-heading__eyebrow">The four buyer questions</div>
              <h2>Each part resolves a different reason a property purchase can fail.</h2>
            </div>
          </Reveal>

          <div className="comprehensive-question-grid">
            {questions.map((item, index) => (
              <Reveal key={item.service.slug} delay={index * 0.05}>
                <article className="comprehensive-question-card">
                  <div className="comprehensive-question-card__topline">
                    <span>No. 0{index + 1}</span>
                    <strong>{item.answer}</strong>
                  </div>
                  <h3>{item.question}</h3>
                  <p>{item.service.longDescription}</p>
                  <div className="comprehensive-question-card__included">
                    <span>Included in this component</span>
                    <ul>
                      {item.service.included.map((included) => (
                        <li key={included}>{included}</li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/services/${item.service.slug}`}>View standalone service →</Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted comprehensive-deliverables">
        <div className="shell shell--service comprehensive-deliverables__layout">
          <Reveal>
            <div className="comprehensive-deliverables__heading">
              <div className="section-heading__eyebrow">What the buyer receives</div>
              <h2>Evidence organised around the final decision.</h2>
              <p>
                The four workstreams are delivered as one coordinated decision document, with the
                most important findings brought forward for action.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <ol className="comprehensive-deliverables__list">
              {buyerReceives.map((item, index) => (
                <li key={item}>
                  <span>0{index + 1}</span>
                  <p>{item}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section comprehensive-verdicts">
        <div className="shell shell--service">
          <Reveal>
            <div className="comprehensive-section-heading">
              <div className="section-heading__eyebrow">Final verdict</div>
              <h2>The report ends with a clear buyer position.</h2>
              <p>
                The verdict reflects the evidence available within the agreed scope and records any
                conditions or unresolved matters that still require action.
              </p>
            </div>
          </Reveal>
          <div className="comprehensive-verdict-grid">
            {verdicts.map((verdict, index) => (
              <Reveal key={verdict.label} delay={index * 0.06}>
                <article className={`comprehensive-verdict comprehensive-verdict--${verdict.tone}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{verdict.label}</h3>
                  <p>{verdict.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section comprehensive-standalone">
        <div className="shell shell--service comprehensive-standalone__inner">
          <div>
            <div className="section-heading__eyebrow">Need only one component?</div>
            <h2>Each service remains available separately.</h2>
            <p>Choose the individual review that matches the risk already in front of you.</p>
          </div>
          <div className="comprehensive-standalone__links">
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.name} <span>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section comprehensive-closing">
        <div className="shell shell--service comprehensive-closing__inner">
          <div>
            <div className="section-heading__eyebrow">Before capital moves</div>
            <h2>Put the whole property decision under review.</h2>
            <p>Share the property, available documents, and your decision timeline with HIDD.</p>
          </div>
          <Link href="/contact?service=comprehensive-report" className="button button--primary">
            Request the Comprehensive Report
          </Link>
        </div>
      </section>
    </>
  );
}
