"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navItems, siteConfig } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className={`site-header ${isScrolled ? "site-header--scrolled" : ""}`}>
      <div className="shell site-header__inner">
        <Link href="/" className="brand" aria-label="HIDD Advisory home">
          <span className="brand__mark">H</span>
          <span className="brand__text">HIDD Advisory</span>
        </Link>

        <nav className={`site-nav ${isOpen ? "site-nav--open" : ""}`} aria-label="Primary">
          <div className="site-nav__panel">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav__link ${isActive(pathname, item.href) ? "is-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}

            <div className="site-nav__mobile-actions">
              <Link href="/contact" className="button button--primary button--block">
                Get a Report
              </Link>
              <a
                href={siteConfig.whatsappHref}
                className="button button--ghost button--block"
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </nav>

        <div className="site-header__actions">
          <a
            href={siteConfig.whatsappHref}
            className="button button--ghost button--header"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <Link href="/contact" className="button button--primary button--header">
            Get a Report
          </Link>
          <button
            type="button"
            className={`menu-toggle ${isOpen ? "is-open" : ""}`}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
