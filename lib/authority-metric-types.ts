export type AuthorityMetric = {
  id: string;
  metricName: string;
  category: string;
  value: number;
  prefix: string;
  suffix: string;
  decimalPlaces: number;
  shortDescription: string;
  calculationMethodology: string;
  evidenceSource: string;
  verifiedThrough?: string;
};
