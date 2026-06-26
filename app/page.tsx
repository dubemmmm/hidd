import Link from "next/link";

import { CtaBand } from "@/components/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";
import { Reveal } from "@/components/reveal";
import RiskMap from "@/components/risk-map";
import { SectionHeading } from "@/components/section-heading";
import { ServiceMarquee } from "@/components/service-marquee";
import { TestimonialMarquee } from "@/components/testimonial-marquee";
import { services } from "@/lib/data/services";
import { getFaqs } from "@/lib/faqs";
import { getMapAreas } from "@/lib/map-areas";
import { getFeaturedReportAssets } from "@/lib/reports";
import { getSocialProofItems } from "@/lib/social-proof";

export const revalidate = 60;

const differentiators = [
  {
    title: "Independent by design",
    copy: "HIDD is positioned around buyer protection, not inventory sales or seller-side incentives."
  },
  {
    title: "Lagos-native judgement",
    copy: "The work is tuned to Lagos title complexity, infrastructure realities, and neighbourhood-level risk."
  },
  {
    title: "Flat-fee clarity",
    copy: "Each service is priced at ₦1,000,000, with no pricing theatre and no 'starting from' ambiguity."
  },
  {
    title: "Decision-pack reporting",
    copy: "The output is built to help buyers proceed, renegotiate, or pause with conviction."
  }
];

export default async function HomePage() {
  const [mapAreas, featuredReportAssets, socialProofItems, faqs] = await Promise.all([
    getMapAreas(),
    getFeaturedReportAssets(),
    getSocialProofItems(),
    getFaqs()
  ]);

  return (
    <>
      <section className="hero hero--map-first">
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
              title="Four verticals for serious property decisions."
              description="Inspection, legal diligence, neighbourhood risk intelligence, and valuation discipline arranged as a clear buyer-side advisory stack."
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
              title="Built for Lagos. Structured for trust."
              description="The commercial layer is disciplined because serious buyers need evidence, not noise."
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

      <section className="section section--muted">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Social proof"
              title="Decision-makers use HIDD when the downside matters."
              description="A combined proof layer of CMS-managed client signals and seeded recent activity that keeps the surface fresh without waiting on a full testimonial rollout."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <TestimonialMarquee items={socialProofItems} />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell section-split">
          <Reveal>
            <SectionHeading
              eyebrow="Common questions"
              title="Friction removed before the first enquiry"
              description="The public FAQ now stays aligned with the current HIDD offer, current map behavior, and current service model."
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

      <CtaBand
        title="Ready to protect your investment?"
        description="Start with the right HIDD engagement, or move directly into the combined insights and library page if you need an intelligence asset first."
      />
    </>
  );
}
