import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Analytics } from "@/components/analytics";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  openGraph: {
    title: "HIDD Advisory",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: ["/og-default.svg"],
    locale: "en_NG",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "HIDD Advisory",
    description: siteConfig.description,
    images: ["/og-default.svg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="page-backdrop" />
        <div className="page-grid" />
        <SiteHeader />
        <main className="page-main">{children}</main>
        <SiteFooter />
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
