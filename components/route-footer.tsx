"use client";

import { usePathname } from "next/navigation";

import { CompactSiteFooter, SiteFooter } from "@/components/site-footer";

const detailRoutes = ["/services/", "/insights/", "/case-studies/", "/risk-map/"];

export function RouteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/studio")) {
    return null;
  }

  if (detailRoutes.some((route) => pathname.startsWith(route))) {
    return <CompactSiteFooter />;
  }

  return <SiteFooter />;
}
