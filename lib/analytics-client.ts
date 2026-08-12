"use client";

export type AnalyticsEventParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: "event" | "config", name: string, parameters?: AnalyticsEventParameters) => void;
  }
}

/**
 * Records anonymous interaction metadata only. Never pass names, email addresses,
 * phone numbers, messages, or other personal information to this function.
 */
export function trackEvent(name: string, parameters: AnalyticsEventParameters = {}) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", name, {
    page_path: `${window.location.pathname}${window.location.search}`,
    ...parameters
  });
}
