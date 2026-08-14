import Link from "next/link";
import type { Metadata } from "next";

import { CurrencyPrice, CurrencySelector } from "@/components/currency";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { comprehensiveReport, services } from "@/lib/data/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Property Advisory Services",
  description:
    "Compare HIDD home inspection, legal due diligence, risk intelligence, valuation, and comprehensive property review services.",
  path: "/services"
});

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell shell--service">
          <Reveal>
            <div className="page-hero__content page-hero__content--service-overview">
              <div className="section-heading__eyebrow">Services overview</div>
              <h1>Four services to help you buy with confidence.</h1>
              <p>
                Choose the checks you need before you pay, sign, or complete a property purchase.
              </p>
              <div className="anchor-nav" aria-label="Service shortcuts">
                <div className="anchor-nav__track">
                  {services.map((service) => (
                    <a key={service.slug} href={`#${service.slug}`}>
                      {service.shortName}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell shell--service">
          <Reveal>
            <div>
              <SectionHeading
                eyebrow="Compare services"
                title="Choose the right engagement for the deal in front of you"
                description="Compare what each service covers, the fee, and who it is designed for."
              />
              <CurrencySelector />
            </div>
          </Reveal>

          <div
            className="overview-grid overview-grid--service"
            role="region"
            aria-label="Swipe to compare HIDD services"
          >
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.06}>
                <article id={service.slug} className="overview-card">
                  <span className="overview-card__eyebrow">{service.eyebrow}</span>
                  <h2>{service.name}</h2>
                  <p>{service.summary}</p>
                  {service.proofNote ? <p className="overview-card__proof">{service.proofNote}</p> : null}
                  <div className="overview-card__facts">
                    <CurrencyPrice amountNgn={service.feeAmount} />
                    {service.turnaround ? <span>{service.turnaround}</span> : null}
                  </div>
                  <ul>
                    {service.included.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="overview-card__actions">
                    <Link href={`/services/${service.slug}`} className="button button--ghost">
                      Read More
                    </Link>
                    <Link href={`/contact?service=${service.slug}`} className="button button--primary">
                      Book This Service
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="shell shell--service">
          <Reveal>
            <article className="bundle-card bundle-card--service">
              <div className="bundle-card__header">
                <div className="section-heading__eyebrow">Comprehensive Report</div>
                <h2>{comprehensiveReport.name}</h2>
                <p>{comprehensiveReport.summary}</p>
              </div>
              <div className="bundle-card__aside">
                <strong>{comprehensiveReport.fee}</strong>
                <span>All four services in one coordinated review</span>
              </div>
              <ul>
                {comprehensiveReport.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="bundle-card__actions">
                <Link href="/services/comprehensive-report" className="button button--ghost">
                  Explore the Full Report
                </Link>
                <Link href="/contact?service=comprehensive-report" className="button button--primary">
                  Book the Comprehensive Report
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
