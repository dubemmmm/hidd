import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { siteConfig } from "@/lib/site";

type ContactPageProps = {
  searchParams?: Promise<{ service?: string; area?: string }> | { service?: string; area?: string };
};

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a HIDD Advisory enquiry for inspection, legal due diligence, risk intelligence, or valuation."
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});

  return (
    <>
      <section className="page-hero">
        <div className="shell shell--support">
          <Reveal>
            <div className="page-hero__content">
              <div className="section-heading__eyebrow">Contact / Enquiry</div>
              <h1>Describe the property. HIDD will take it from there.</h1>
              <p>
                The form is wired to a real server endpoint and structured so a final email provider
                can be attached without redesigning the page.
              </p>
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
                Buyers can submit the structured form, call directly, or move the conversation to
                WhatsApp for quicker clarification.
              </p>
              <div className="contact-details">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
                <a href={siteConfig.whatsappHref} target="_blank" rel="noreferrer">
                  WhatsApp direct
                </a>
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
