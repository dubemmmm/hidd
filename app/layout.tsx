import type { Metadata } from "next";
import type { ReactNode } from "react";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { Analytics } from "@/components/analytics";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { JsonLd } from "@/components/json-ld";
import { RouteFooter } from "@/components/route-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, defaultOgImage } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "HIDD Advisory | Property Risk Intelligence for Lagos",
    template: "%s | HIDD Advisory"
  },
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.url
  },
  openGraph: {
    title: "HIDD Advisory",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
    locale: "en_NG",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "HIDD Advisory",
    description: siteConfig.description,
    images: [defaultOgImage]
  }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { isEnabled: isPreview } = await draftMode();

  return (
    <html lang="en">
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${siteConfig.url}/#organization`,
            name: siteConfig.name,
            url: siteConfig.url,
            logo: absoluteUrl("/icon.svg"),
            email: siteConfig.email,
            telephone: siteConfig.phoneDisplay,
            address: {
              "@type": "PostalAddress",
              streetAddress: siteConfig.address,
              addressLocality: "Lagos",
              addressRegion: "Lagos State",
              addressCountry: "NG"
            },
            sameAs: Object.values(siteConfig.socialLinks)
          }}
        />
        <div className="page-backdrop" />
        <div className="page-grid" />
        <SiteHeader />
        <main className="page-main">{children}</main>
        <RouteFooter />
        <FloatingWhatsApp />
        <Analytics />
        {isPreview ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
