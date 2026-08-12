"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackEvent } from "@/lib/analytics-client";

export function AnalyticsEvents({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    window.gtag?.("config", gaId, {
      page_path: `${pathname}${window.location.search}`
    });
  }, [gaId, pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;

      const eventName = link.dataset.analyticsEvent;
      if (eventName) {
        trackEvent(eventName, {
          asset_slug: link.dataset.analyticsAssetSlug,
          asset_category: link.dataset.analyticsAssetCategory,
          link_location: link.dataset.analyticsLocation,
          link_url: link.href
        });
      }

      if (link.hostname === "wa.me" || link.hostname === "api.whatsapp.com") {
        trackEvent("whatsapp_click", {
          link_location: link.dataset.analyticsLocation || "site",
          link_url: link.href
        });
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
