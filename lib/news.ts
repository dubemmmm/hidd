import { getAllInsights } from "@/lib/insights";
import { getFeaturedReportAssets } from "@/lib/reports";
import type { NewsItem } from "@/lib/types";

export async function getHomepageNews(): Promise<NewsItem[]> {
  const [featuredReports, insights] = await Promise.all([
    getFeaturedReportAssets(),
    getAllInsights()
  ]);

  const reportSignals: NewsItem[] = featuredReports.map((asset) => ({
    id: `report-${asset.slug}`,
    headline: asset.title,
    source: "HIDD Library",
    publishedAt: asset.publishedAt,
    href: `/insights?asset=${asset.slug}`,
    category: asset.category,
    description: asset.summary
  }));

  const insightSignals: NewsItem[] = insights.map((post) => ({
    id: `insight-${post.slug}`,
    headline: post.title,
    source: "HIDD Insights",
    publishedAt: post.publishedAt,
    href: `/insights/${post.slug}`,
    category: post.category,
    description: post.excerpt
  }));

  return [...reportSignals, ...insightSignals]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 4);
}
