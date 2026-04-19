import type { MetadataRoute } from "next";

import { mapAreas } from "@/lib/data/map-areas";
import { services } from "@/lib/data/services";
import { getAllInsights } from "@/lib/insights";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllInsights();
  const staticRoutes = ["", "/risk-map", "/reports", "/services", "/insights", "/faqs", "/contact"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date()
    })),
    ...services.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified: new Date()
    })),
    ...posts.map((post) => ({
      url: `${siteConfig.url}/insights/${post.slug}`,
      lastModified: new Date(post.publishedAt)
    })),
    ...mapAreas.map((area) => ({
      url: `${siteConfig.url}/risk-map/${area.slug}`,
      lastModified: new Date()
    }))
  ];
}
