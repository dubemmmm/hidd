import Link from "next/link";
import type { Metadata } from "next";

import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import RiskMap from "@/components/risk-map";
import { SectionHeading } from "@/components/section-heading";
import { ServiceMarquee } from "@/components/service-marquee";
import { comprehensiveReport, services } from "@/lib/data/services";
import { getFaqs } from "@/lib/faqs";
import { getMapAreas } from "@/lib/map-areas";
import { getFeaturedReportAssets } from "@/lib/reports";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Independent Property Intelligence for Lagos Buyers",
  description:
    "Independent home inspection, legal due diligence, valuation, and location-risk guidance before you commit to a Lagos property.",
  path: "/"
});

export const revalidate = 60;

const differentiators = [
  {
    title: "Independent by design",
    copy: "HIDD works for the buyer, with no ties to the seller, agent, or developer involved in the property."
  },
  {
    title: "Lagos property expertise",
    copy: "Our advice reflects Lagos title issues, infrastructure conditions, and neighbourhood risks."
  },
  {
    title: "Flat-fee clarity",
    copy:
      "Each standalone service costs ₦1,000,000. Comprehensive Report package pricing is confirmed after scope review and before engagement."
  },
  {
    title: "Clear recommendations",
    copy: "Each report explains what we found and whether you should proceed, renegotiate, investigate further, or pause."
  }
];

// Proposed homepage hero copy. Keep this together so it can be revised quickly
// after the owner completes the final wording review.
const homepageHeroCopy = {
  eyebrow: "Independent Property Intelligence",
  title: "Independent property intelligence before capital moves.",
  description:
    "HIDD helps property buyers make informed decisions through independent home inspections, legal due diligence, property valuation, and location-risk analysis."
};

export default async function HomePage() {
  const [mapAreas, featuredReportAssets, faqs] = await Promise.all([
    getMapAreas(),
    getFeaturedReportAssets(),
    getFaqs()
  ]);

  return (
    <>
      <section className="hero hero--homepage-intro">
        <div className="shell shell--hero">
          <div className="homepage-hero">
            <div className="section-heading__eyebrow homepage-hero__eyebrow">
              {homepageHeroCopy.eyebrow}
            </div>
            <h1>{homepageHeroCopy.title}</h1>
            <p>{homepageHeroCopy.description}</p>
            <div className="homepage-hero__actions">
              <Link href="/contact" className="button button--primary">
                Request an Assessment
              </Link>
              <Link
                href="/insights?asset=lagos-neighbourhood-risk-index"
                className="button button--ghost"
              >
                View a Sample Report
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-comprehensive">
        <div className="shell shell--hero">
          <Reveal>
            <article className="home-comprehensive__feature">
              <div className="home-comprehensive__copy">
                <div className="section-heading__eyebrow">Flagship Comprehensive Report</div>
                <h2>One report for the four questions that decide the purchase.</h2>
                <p>{comprehensiveReport.summary}</p>
                <div className="home-comprehensive__actions">
                  <Link href="/services/comprehensive-report" className="button button--primary">
                    Explore the Comprehensive Report
                  </Link>
                  <Link href="/contact?service=comprehensive-report" className="button button--ghost">
                    Request an Assessment
                  </Link>
                </div>
              </div>
              <ol className="home-comprehensive__questions">
                <li><span>01</span><strong>Is the building sound?</strong><small>Inspection</small></li>
                <li><span>02</span><strong>Is the ownership real?</strong><small>Legal Due Diligence</small></li>
                <li><span>03</span><strong>Is the location suitable?</strong><small>Risk Intelligence</small></li>
                <li><span>04</span><strong>Is the price right?</strong><small>Valuation</small></li>
              </ol>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="section section--home-map">
        <div className="shell shell--hero">
          <Reveal delay={0.06}>
            <RiskMap areas={mapAreas} variant="hero" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="hero-map-actions">
              <div className="hero-map-actions__buttons">
                <Link href="/contact" className="button button--primary">
                  Get a Report
                </Link>
                <Link href="/risk-map" className="button button--ghost">
                  Explore Area Compare
                </Link>
              </div>

              <div className="hero-downloads" aria-label="Featured downloadable assets">
                {featuredReportAssets.map((asset) => (
                  <Link key={asset.slug} href={`/insights?asset=${asset.slug}`} className="hero-download-card">
                    <span>{asset.category}</span>
                    <strong>{asset.title}</strong>
                    <p>{asset.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="What HIDD does"
              title="Four services to protect your property purchase."
              description="Choose home inspection, legal due diligence, neighbourhood risk intelligence, valuation, or combine them for a more complete review."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <ServiceMarquee items={services} />
          </Reveal>
        </div>
      </section>

      <section className="section section--muted">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Why HIDD"
              title="Independent advice for Lagos property buyers."
              description="We give you clear findings and practical recommendations before you pay, sign, or commit."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="why-grid" aria-label="Why HIDD">
              <div className="why-grid__track">
                {differentiators.map((item) => (
                  <article key={item.title} className="why-card">
                    <span>{item.title}</span>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell section-split">
          <Reveal>
            <SectionHeading
              eyebrow="Common questions"
              title="Answers before you engage HIDD"
              description="Find clear information about our services, fees, timelines, reports, and how to get started."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="faq-teaser">
              <FaqAccordion items={faqs.slice(0, 4)} />
              <Link href="/faqs" className="faq-teaser__link">
                View all {faqs.length} FAQs →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
