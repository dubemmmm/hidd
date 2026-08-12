import type { MetadataRoute } from "next";

import { getCaseStudies } from "@/lib/case-studies";
import { services } from "@/lib/data/services";
import { getAllInsights } from "@/lib/insights";
import { getMapAreas } from "@/lib/map-areas";
import { getReportAssets } from "@/lib/reports";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mapAreas = await getMapAreas();
  const posts = await getAllInsights();
  const caseStudies = await getCaseStudies();
  const reportAssets = await getReportAssets();
  const staticRoutes = [
    "",
    "/risk-map",
    "/services",
    "/services/comprehensive-report",
    "/case-studies",
    "/insights",
    "/faqs",
    "/contact",
    "/about",
    "/privacy-policy",
    "/terms"
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : route === "/services" || route === "/insights" ? 0.9 : 0.8
    })),
    ...services.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/insights/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...caseStudies.map((caseStudy) => ({
      url: `${siteConfig.url}/case-studies/${caseStudy.slug}`,
      lastModified: new Date(caseStudy.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...reportAssets.map((report) => ({
      url: `${siteConfig.url}/insights/resources/${report.slug}`,
      lastModified: new Date(report.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...mapAreas.map((area) => ({
      url: `${siteConfig.url}/risk-map/${area.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
