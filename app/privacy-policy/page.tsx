import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How HIDD Advisory collects, uses, protects, and manages personal information.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <section className="section legal-page">
      <div className="shell shell--support">
        <Reveal>
          <header className="legal-page__intro">
            <div className="section-heading__eyebrow">Legal</div>
            <h1>Privacy Policy</h1>
            <p>
              This policy explains how HIDD Advisory collects and uses personal information when
              you visit our website, request a service, or access our articles and resources.
            </p>
            <p className="legal-page__updated">Last updated: August 10, 2026</p>
          </header>

          <div className="legal-page__layout">
            <aside className="legal-page__toc" aria-label="Privacy policy sections">
              <span>On this page</span>
              <nav>
                <a href="#information-we-collect">Information we collect</a>
                <a href="#how-we-use-information">How we use it</a>
                <a href="#sharing-and-storage">Sharing and storage</a>
                <a href="#your-rights">Your rights</a>
                <a href="#privacy-contact">Contact</a>
              </nav>
            </aside>

            <div className="legal-page__content">
            <section>
              <h2>Who is responsible for your information</h2>
              <p>
                HIDD Advisory, a Chateau &amp; Capital company, is responsible for the personal
                information described in this policy. Questions or privacy requests may be sent to{" "}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            </section>

            <section id="information-we-collect">
              <h2>Information we collect</h2>
              <p>Depending on how you use the website, we may collect:</p>
              <ul>
                <li>Your name, email address, telephone number, and enquiry details.</li>
                <li>Property, location, service, timing, and transaction information you provide.</li>
                <li>Your interest in an article, report, checklist, or upcoming resource.</li>
                <li>Basic technical and usage information, including pages visited and device data.</li>
                <li>Correspondence and records connected with an enquiry or client engagement.</li>
              </ul>
              <p>Please do not submit information that is unnecessary for your request.</p>
            </section>

            <section id="how-we-use-information">
              <h2>How we use personal information</h2>
              <p>We use personal information to:</p>
              <ul>
                <li>Review and respond to enquiries, normally within one working day.</li>
                <li>Recommend, scope, administer, and deliver HIDD services.</li>
                <li>Provide requested articles, reports, checklists, and resource notifications.</li>
                <li>Maintain records, protect the website, prevent spam, and resolve problems.</li>
                <li>Understand website performance and improve our services and content.</li>
                <li>Meet applicable professional, contractual, accounting, and legal obligations.</li>
              </ul>
              <p>
                We process information where it is necessary to respond to your request, take steps
                toward or perform an engagement, meet a legal obligation, pursue a legitimate
                business interest that does not override your rights, or where you have consented.
              </p>
            </section>

            <section>
              <h2>Marketing</h2>
              <p>
                Submitting an enquiry or unlocking an article does not automatically subscribe you
                to marketing messages. Where consent is required, we will ask separately. You may
                opt out of marketing communications at any time.
              </p>
            </section>

            <section id="sharing-and-storage">
              <h2>Who may receive your information</h2>
              <p>
                Access is limited to HIDD personnel and service providers who need the information
                for an authorised purpose. This may include website hosting, email delivery,
                analytics, content management, and professional advisers. We may also disclose
                information where required by law or necessary to establish or defend legal rights.
                We do not sell personal information.
              </p>
            </section>

            <section>
              <h2>Storage, retention, and security</h2>
              <p>
                We apply reasonable technical and organisational safeguards appropriate to the
                information and the risks involved. We retain personal information only for as long
                as it is needed for the purpose collected, an active or anticipated engagement,
                record-keeping, dispute resolution, or applicable legal requirements. Service
                providers may process information outside Nigeria subject to appropriate safeguards.
              </p>
            </section>

            <section id="your-rights">
              <h2>Your rights</h2>
              <p>
                Subject to applicable law, you may ask to be informed about processing, access or
                correct your personal information, object to or restrict certain processing, request
                deletion or portability, withdraw consent, or complain to the Nigeria Data Protection
                Commission. Some rights may be limited where we must retain information by law or
                for legitimate legal purposes.
              </p>
            </section>

            <section>
              <h2>Nigeria Data Protection Act 2023</h2>
              <p>
                We process personal information in accordance with the Nigeria Data Protection Act
                2023 (NDPA 2023) and other applicable privacy and data-protection requirements.
              </p>
            </section>

            <section>
              <h2>Cookies and analytics</h2>
              <p>
                The website may use essential technologies needed to operate and limited analytics
                to understand website use. Browser controls can be used to restrict cookies, though
                some website functions may be affected.
              </p>
            </section>

            <section id="privacy-contact">
              <h2>Updates and contact</h2>
              <p>
                We may update this policy to reflect changes in our services, technology, or legal
                obligations. The current version will appear on this page. For privacy questions or
                requests, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or use
                the details on our <Link href="/contact">Contact page</Link>.
              </p>
            </section>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
