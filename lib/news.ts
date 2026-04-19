import { homepageSignals } from "@/lib/data/news";
import type { NewsItem } from "@/lib/types";

export async function getHomepageNews(): Promise<NewsItem[]> {
  return homepageSignals;
}
