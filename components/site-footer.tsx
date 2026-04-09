import Link from "next/link";

import { AccreditationStrip } from "@/components/accreditation-strip";
import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="nav-logo">
              <span className="logo-mark">H</span>
              <span className="logo-text">
                HIDD<span className="logo-dim">Advisory</span>
              </span>
            </Link>
            <p className="footer-desc">
              Protecting Lagos property buyers with data, expertise, and transparency. A Chateau
              &amp; Capital company.
            </p>
          </div>

          <div className="footer-col">
            <h3>Services</h3>
            {services.map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.name}
              </Link>
            ))}
          </div>

          <div className="footer-col">
            <h3>Company</h3>
            <Link href="/services">All Services</Link>
            <Link href="/insights">Insights</Link>
            <Link href="/faqs">FAQs</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h3>Connect</h3>
            <div className="footer-socials">
              <a
                href={siteConfig.socialLinks.x}
                className="social-icon"
                aria-label="X"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={siteConfig.socialLinks.linkedin}
                className="social-icon"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452H16.9v-5.57c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.667H9.35V9h3.406v1.561h.05c.474-.9 1.634-1.85 3.366-1.85 3.6 0 4.275 2.37 4.275 5.456zM5.337 7.433A2.063 2.063 0 1 1 5.34 3.31a2.063 2.063 0 0 1-.003 4.124M7.119 20.452H3.555V9H7.12z" />
                </svg>
              </a>
              <a
                href={siteConfig.socialLinks.instagram}
                className="social-icon"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25zm8.875 1.625a1.125 1.125 0 1 1-1.125 1.125 1.126 1.126 0 0 1 1.125-1.125M12 6.5A5.5 5.5 0 1 1 6.5 12 5.506 5.506 0 0 1 12 6.5m0 1.5A4 4 0 1 0 16 12a4.004 4.004 0 0 0-4-4" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-accreditation">
          <AccreditationStrip compact />
        </div>

        <div className="footer-bottom">
          <p>© 2026 HIDD Advisory. All rights reserved. A Chateau &amp; Capital company.</p>
        </div>
      </div>
    </footer>
  );
}
