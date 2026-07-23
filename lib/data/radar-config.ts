import type { RiskLayerKey } from "@/lib/types";

export const radarConfig = {
  gamma: 3,
  minScore: 0,
  maxScore: 100
} as const;

export const radarAxisLabels: Record<RiskLayerKey, string> = {
  flooding: "Flood resilience",
  "title-complexity": "Title security",
  "planning-zoning": "Planning certainty",
  infrastructure: "Infrastructure quality",
  security: "Safety",
  environmental: "Environment",
  "market-liquidity": "Liquidity"
};
