import Link from "next/link";

import { CtaBand } from "@/components/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";
import { NewsMarquee } from "@/components/news-marquee";
import { Reveal } from "@/components/reveal";
import RiskMap from "@/components/risk-map";
import { SectionHeading } from "@/components/section-heading";
import { ServiceMarquee } from "@/components/service-marquee";
import { TestimonialMarquee } from "@/components/testimonial-marquee";
import { faqs } from "@/lib/data/faqs";
import { featuredReportAssets } from "@/lib/data/reports";
import { services } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import { getHomepageNews } from "@/lib/news";

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
  const newsItems = await getHomepageNews();

  return (
    <>
      <section className="hero hero--map-first">
        <div className="shell shell--hero">
          <Reveal>
            <div className="hero-map-intro">
              <div className="section-heading__eyebrow">Lagos property risk intelligence</div>
              <h1 className="hero-map-intro__title">Do not buy into Lagos blind.</h1>
              <p className="hero-map-intro__copy">
                HIDD combines inspection, legal diligence, neighbourhood risk intelligence, and
                valuation discipline for buyers making serious property decisions.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <RiskMap variant="hero" />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="hero-map-actions">
              <div className="hero-map-actions__buttons">
                <Link href="/contact" className="button button--primary">
                  Get a Report
                </Link>
                <Link href="/risk-map" className="button button--ghost">
                  Explore Risk Map
                </Link>
              </div>

              <div className="hero-downloads" aria-label="Featured downloadable assets">
                {featuredReportAssets.map((asset) => (
                  <Link key={asset.slug} href={`/reports?asset=${asset.slug}`} className="hero-download-card">
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
              title="Four verticals. One disciplined pricing model."
              description="Four advisory verticals. One flat ₦1,000,000 fee. Clear scope, disciplined pricing, and no transaction theatre."
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
                {[...differentiators, ...differentiators].map((item, index) => {
                  const isDuplicate = index >= differentiators.length;

                  return (
                    <article
                      key={`${item.title}-${index}`}
                      className="why-card"
                      aria-hidden={isDuplicate ? "true" : undefined}
                    >
                      <span>{item.title}</span>
                      <p>{item.copy}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Signals from HIDD"
              title="Internal intelligence, assets, and editorial routed within the site"
              description="The homepage signal layer now routes only to HIDD pages, reports, and articles."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <NewsMarquee items={newsItems} />
          </Reveal>
        </div>
      </section>

      <section className="section section--muted">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Social proof"
              title="Decision-makers use HIDD when the downside matters."
              description="This layer remains a placeholder until final quotes arrive, but the proof surface is positioned where a premium advisory brand expects it."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <TestimonialMarquee items={testimonials} />
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
        description="Start with the right HIDD engagement, or move directly into the reports library if you need an intelligence asset first."
      />
    </>
  );
}
