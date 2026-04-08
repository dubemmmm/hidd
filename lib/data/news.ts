import type { NewsItem } from "@/lib/types";

export const mockNewsItems: NewsItem[] = [
  {
    id: "businessday-lagos-pricing",
    headline: "Lagos prime neighbourhood pricing remains resilient as buyers focus on quality stock",
    source: "BusinessDay",
    publishedAt: "2026-03-19",
    url: "https://businessday.ng",
    category: "Market Analysis"
  },
  {
    id: "nairametrics-flooding",
    headline: "Developers face sharper buyer scrutiny over drainage, access roads, and flood resilience",
    source: "Nairametrics",
    publishedAt: "2026-03-17",
    url: "https://nairametrics.com",
    category: "Risk Signals"
  },
  {
    id: "estateintel-diaspora",
    headline: "Diaspora demand continues to influence premium Lagos residential enquiry patterns",
    source: "Estate Intel",
    publishedAt: "2026-03-15",
    url: "https://estateintel.com",
    category: "Diaspora"
  },
  {
    id: "reuters-construction",
    headline: "Infrastructure delivery and macro pressure reshape buyer decision timelines in Nigeria's cities",
    source: "Reuters",
    publishedAt: "2026-03-12",
    url: "https://www.reuters.com",
    category: "Macro"
  }
];
