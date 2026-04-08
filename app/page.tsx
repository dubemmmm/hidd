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
import { services } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import { getHomepageNews } from "@/lib/news";
import { siteConfig } from "@/lib/site";

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
    copy: "Each service is priced at ₦1,000,000, with no 'starting from' ambiguity anywhere on the site."
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
      <section className="hero">
        <div className="shell hero__grid hero__grid--single">
          <Reveal className="hero__content hero__content--landing">
            <div className="section-heading__eyebrow">Lagos property risk intelligence</div>
            <h1 className="hero__title">
              Do not buy into Lagos <em>blind</em>.
            </h1>
            <p className="hero__description">
              HIDD Advisory gives diaspora investors, high-net-worth buyers, and institutional
              teams the inspection, legal clarity, neighbourhood risk insight, and valuation
              discipline required before serious capital moves.
            </p>
            <div className="hero__actions">
              <Link href="/contact" className="button button--primary">
                Get a Report
              </Link>
              <Link href="/#risk-map" className="button button--ghost">
                Explore the Risk Map
              </Link>
            </div>
            <div className="hero__ticker" aria-label="HIDD positioning highlights">
              <span>Diaspora buyer ready</span>
              <span>Independent diligence</span>
              <span>Ikoyi, VI, Lekki, Ikeja</span>
              <span>Flat-fee clarity</span>
            </div>
            <div className="hero__metrics">
              <div>
                <strong>4</strong>
                <span>core service verticals</span>
              </div>
              <div>
                <strong>₦1M</strong>
                <span>flat fee per service</span>
              </div>
              <div>
                <strong>Ikoyi</strong>
                <span>base of operations in Lagos</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="risk-map" className="section section--flush-top">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Flagship homepage tool"
              title="Interactive Lagos risk map"
              description="A premium custom map experience that previews how HIDD reads neighbourhood-level exposure before a buyer ever enquires."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <RiskMap />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="What HIDD does"
              title="Four verticals. One disciplined pricing model."
            />
          </Reveal>
          <Reveal delay={0.04}>
            <div className="copy-marquee copy-marquee--reverse" aria-label="Services pricing statement">
              <div className="copy-marquee__track">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span key={index}>
                    Four advisory verticals. One flat ₦1,000,000 fee. Clear scope, disciplined
                    pricing, and no transaction theatre.
                  </span>
                ))}
              </div>
            </div>
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
              description="The brand system is premium because the underlying service needs to feel credible to people making consequential property decisions."
            />
          </Reveal>
          <div className="why-grid">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <article className="why-card">
                  <span>{item.title}</span>
                  <p>{item.copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow="Live news layer"
              title="Signals shaping the Lagos property conversation"
              description="The carousel is adapter-driven so mock content can be replaced with real RSS feeds later without changing the homepage component contract."
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
              description="This proof layer now moves like the live news section and carries richer placeholder testimony so the page feels credible before final client quotes arrive."
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
              description="The public FAQ is structured to support conversion while reducing repetitive sales clarification."
            />
          </Reveal>
          <Reveal delay={0.06}>
            <FaqAccordion items={faqs.slice(0, 4)} />
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Ready to protect your investment?"
        description={`Get a professional property review before you commit. Or reach HIDD directly on WhatsApp at ${siteConfig.phoneDisplay}.`}
      />
    </>
  );
}
