import Link from "next/link";

import { AccreditationStrip } from "@/components/accreditation-strip";
import { siteConfig } from "@/lib/site";

function FooterSocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`footer-socials ${compact ? "footer-socials--compact" : ""}`} aria-label="HIDD social media">
      <a
        href={siteConfig.socialLinks.linkedin}
        className="social-icon"
        aria-label="HIDD Advisory on LinkedIn"
        title="LinkedIn"
        target="_blank"
        rel="noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452H16.9v-5.57c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.667H9.35V9h3.406v1.561h.05c.474-.9 1.634-1.85 3.366-1.85 3.6 0 4.275 2.37 4.275 5.456zM5.337 7.433A2.063 2.063 0 1 1 5.34 3.31a2.063 2.063 0 0 1-.003 4.124M7.119 20.452H3.555V9H7.12z" />
        </svg>
      </a>
      <a
        href={siteConfig.socialLinks.instagram}
        className="social-icon"
        aria-label="HIDD Advisory on Instagram"
        title="Instagram"
        target="_blank"
        rel="noreferrer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2m0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25zm8.875 1.625a1.125 1.125 0 1 1-1.125 1.125 1.126 1.126 0 0 1 1.125-1.125M12 6.5A5.5 5.5 0 1 1 6.5 12 5.506 5.506 0 0 1 12 6.5m0 1.5A4 4 0 1 0 16 12a4.004 4.004 0 0 0-4-4" />
        </svg>
      </a>
    </div>
  );
}

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

          <div className="footer-col footer-col--contact">
            <h3>Contact</h3>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
            <span className="footer-contact-text">{siteConfig.address}</span>
          </div>

          <div className="footer-col footer-col--connect">
            <h3>Connect</h3>
            <FooterSocialLinks />
          </div>
        </div>

        <div className="footer-accreditation">
          <AccreditationStrip compact />
        </div>

        <div className="footer-bottom">
          <p>© 2026 HIDD Advisory. All rights reserved. A Chateau &amp; Capital company.</p>
          <nav className="footer-bottom__links" aria-label="Secondary">
            <Link href="/faqs">FAQs</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function CompactSiteFooter() {
  return (
    <footer className="footer footer--compact">
      <div className="shell footer-compact">
        <div className="footer-compact__contact">
          <Link href="/" className="footer-compact__brand">
            HIDD Advisory
          </Link>
          <span aria-hidden="true">·</span>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          <span aria-hidden="true">·</span>
          <a href={siteConfig.phoneHref}>{siteConfig.phoneDisplay}</a>
        </div>
        <div className="footer-compact__legal">
          <FooterSocialLinks compact />
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <p>© 2026 HIDD Advisory · A Chateau &amp; Capital company</p>
        </div>
      </div>
    </footer>
  );
}
