import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Website Terms",
  description: "Terms governing access to and use of the HIDD Advisory website and resources.",
  path: "/terms"
});

export default function TermsPage() {
  return (
    <section className="section legal-page">
      <div className="shell shell--support">
        <Reveal>
          <header className="legal-page__intro">
            <div className="section-heading__eyebrow">Legal</div>
            <h1>Website Terms</h1>
            <p>
              These terms govern access to and use of the HIDD Advisory website, articles, area
              information, reports, checklists, and other website resources.
            </p>
            <p className="legal-page__updated">Last updated: August 10, 2026</p>
          </header>

          <div className="legal-page__layout">
            <aside className="legal-page__toc" aria-label="Website terms sections">
              <span>On this page</span>
              <nav>
                <a href="#website-use">Using this website</a>
                <a href="#professional-information">Professional information</a>
                <a href="#engagements">Professional engagements</a>
                <a href="#intellectual-property">Intellectual property</a>
                <a href="#terms-contact">Law and contact</a>
              </nav>
            </aside>

            <div className="legal-page__content">
            <section id="website-use">
              <h2>About this website</h2>
              <p>
                This website is operated by HIDD Advisory, a Chateau &amp; Capital company. By using
                it, you agree to these terms. If you do not agree, please do not use the website.
              </p>
            </section>

            <section id="professional-information">
              <h2>General information, not a professional opinion</h2>
              <p>
                Public website content is provided for general information. It is not a property
                inspection, valuation, legal opinion, title confirmation, investment recommendation,
                or substitute for advice based on a specific property and transaction. Risk grades,
                district comparisons, articles, and sample materials should not be treated as a
                guarantee of condition, ownership, value, safety, suitability, or future performance.
              </p>
            </section>

            <section id="engagements">
              <h2>Professional engagements</h2>
              <p>
                Sending an enquiry does not create a client relationship. A professional engagement
                begins only when HIDD confirms the scope and terms in writing and the agreed
                professional fee has been received. The engagement letter or service agreement will
                govern the commissioned work and will take priority if it conflicts with these
                website terms.
              </p>
            </section>

            <section>
              <h2>Your responsibilities</h2>
              <p>
                You agree to provide accurate information, use the website lawfully, and avoid
                interfering with its operation or attempting unauthorised access. You are responsible
                for obtaining independent advice and making your own transaction decisions.
              </p>
            </section>

            <section id="intellectual-property">
              <h2>Intellectual property</h2>
              <p>
                Unless stated otherwise, the website design, branding, text, graphics, reports, and
                other materials belong to HIDD Advisory or its licensors. You may view or download
                resources for your personal, non-commercial use. You may not reproduce, sell,
                republish, or commercially exploit them without prior written permission.
              </p>
            </section>

            <section>
              <h2>Availability and third-party services</h2>
              <p>
                We may change, suspend, or withdraw website content and cannot promise uninterrupted
                or error-free availability. Links and integrations operated by third parties are
                provided for convenience; their own terms and privacy practices apply.
              </p>
            </section>

            <section>
              <h2>Liability</h2>
              <p>
                To the extent permitted by applicable law, HIDD is not responsible for loss arising
                solely from reliance on general website content or from website unavailability. Nothing
                in these terms excludes liability that cannot lawfully be excluded. Liability relating
                to commissioned professional services is governed by the applicable engagement terms.
              </p>
            </section>

            <section>
              <h2>Privacy</h2>
              <p>
                Our <Link href="/privacy-policy">Privacy Policy</Link> explains how we handle personal
                information submitted through this website.
              </p>
            </section>

            <section id="terms-contact">
              <h2>Changes, law, and contact</h2>
              <p>
                We may update these terms and will show the current version on this page. These terms
                are governed by the laws of the Federal Republic of Nigeria. Questions may be sent to{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or through our{" "}
                <Link href="/contact">Contact page</Link>.
              </p>
            </section>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
