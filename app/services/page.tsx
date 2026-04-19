import Link from "next/link";
import type { Metadata } from "next";

import { AccreditationStrip } from "@/components/accreditation-strip";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { comprehensiveReport, services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore HIDD Advisory's four service verticals and the bundled comprehensive report for Lagos property buyers."
};

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="shell shell--service">
          <Reveal>
            <div className="page-hero__content page-hero__content--service-overview">
              <div className="section-heading__eyebrow">Services overview</div>
              <h1>One premium diligence stack for Lagos buyers.</h1>
              <p>
                Four focused advisory services designed to protect buyers before serious capital
                moves.
              </p>
              <div className="anchor-nav anchor-nav--marquee" aria-label="Service shortcuts">
                <div className="anchor-nav__track">
                  {services.map((service) => (
                    <a key={service.slug} href={`#${service.slug}`}>
                      {service.shortName}
                    </a>
                  ))}
                  {services.map((service) => (
                    <a key={`${service.slug}-duplicate`} href={`#${service.slug}`} tabIndex={-1} aria-hidden="true">
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
          <Reveal delay={0.04}>
            <AccreditationStrip compact />
          </Reveal>
          <Reveal>
            <div style={{ marginTop: "40px" }}>
              <SectionHeading
                eyebrow="Comparison view"
                title="Choose the right engagement for the deal in front of you"
                description="Scan the scope, fee, and best-fit engagement quickly."
              />
            </div>
          </Reveal>

          <div className="overview-grid overview-grid--service">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.06}>
                <article id={service.slug} className="overview-card">
                  <span className="overview-card__eyebrow">{service.eyebrow}</span>
                  <h2>{service.name}</h2>
                  <p>{service.summary}</p>
                  {service.proofNote ? <p className="overview-card__proof">{service.proofNote}</p> : null}
                  <div className="overview-card__facts">
                    <strong>{service.fee}</strong>
                    {service.turnaround ? <span>{service.turnaround}</span> : null}
                  </div>
                  <ul>
                    {service.included.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link href={`/contact?service=${service.slug}`} className="button button--primary">
                    Book This Service
                  </Link>
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
              <div>
                <div className="section-heading__eyebrow">Comprehensive Report</div>
                <h2>{comprehensiveReport.name}</h2>
                <p>{comprehensiveReport.summary}</p>
              </div>
              <div className="bundle-card__aside">
                <strong>{comprehensiveReport.fee}</strong>
                <span>Bundled premium diligence package</span>
              </div>
              <ul>
                {comprehensiveReport.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/contact?service=comprehensive-report" className="button button--primary">
                Book the Comprehensive Report
              </Link>
            </article>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Need help choosing the right service?"
        description="Describe the asset and timing, and HIDD will route you into the right engagement."
      />
    </>
  );
}
