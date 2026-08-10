import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { siteConfig } from "@/lib/site";
import { createPageMetadata } from "@/lib/seo";

type ContactPageProps = {
  searchParams?: Promise<{ service?: string; area?: string }> | { service?: string; area?: string };
};

export const metadata: Metadata = createPageMetadata({
  title: "Contact HIDD Advisory",
  description:
    "Request a HIDD property assessment, inspection, legal due diligence review, valuation, or neighbourhood risk report.",
  path: "/contact"
});

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});

  return (
    <>
      <section className="page-hero">
        <div className="shell shell--support">
          <Reveal>
            <div className="page-hero__content page-hero__content--contact">
              <div className="section-heading__eyebrow">Contact / Enquiry</div>
              <h1>Describe the property. HIDD will take it from there.</h1>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="shell shell--support contact-layout">
          <Reveal>
            <div className="contact-panel">
              <div className="section-heading__eyebrow">Direct contact</div>
              <h2>Reach HIDD on the channel that suits the deal.</h2>
              <p>
                Buyers can submit the structured form, call directly, or use the floating WhatsApp
                widget for quicker clarification.
              </p>
              <div className="contact-details">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
                <span>{siteConfig.address}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ContactForm
              initialService={resolvedSearchParams.service ?? ""}
              initialArea={resolvedSearchParams.area ?? ""}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
