export type ProofMetric = {
  key: string;
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  note: string;
  category: "Scale" | "Evidence" | "Authority" | "Coverage" | "Decision";
  verification: "placeholder" | "site-verified";
};

export const proofMetrics: ProofMetric[] = [
  {
    key: "properties",
    value: 128,
    prefix: "",
    suffix: "",
    label: "Properties reviewed",
    note: "Replace with HIDD's verified count of completed property engagements.",
    category: "Scale",
    verification: "placeholder"
  },
  {
    key: "transaction-value",
    value: 42,
    prefix: "₦",
    suffix: "bn",
    label: "Transaction value reviewed",
    note: "Replace with the verified aggregate value covered by completed engagements.",
    category: "Scale",
    verification: "placeholder"
  },
  {
    key: "risks",
    value: 317,
    prefix: "",
    suffix: "",
    label: "Material risks identified",
    note: "Replace with the audited total of material findings recorded in HIDD reports.",
    category: "Evidence",
    verification: "placeholder"
  },
  {
    key: "disciplines",
    value: 4,
    prefix: "",
    suffix: "",
    label: "Specialist disciplines",
    note: "Inspection, legal due diligence, risk intelligence and valuation.",
    category: "Authority",
    verification: "site-verified"
  },
  {
    key: "districts",
    value: 6,
    prefix: "",
    suffix: "",
    label: "Prime Lagos districts assessed",
    note: "The current Area Compare coverage published by HIDD.",
    category: "Coverage",
    verification: "site-verified"
  },
  {
    key: "dimensions",
    value: 7,
    prefix: "",
    suffix: "",
    label: "District-risk dimensions",
    note: "The fixed dimensions used in each published district resilience profile.",
    category: "Evidence",
    verification: "site-verified"
  },
  {
    key: "verdicts",
    value: 3,
    prefix: "",
    suffix: "",
    label: "Clear verdict positions",
    note: "Proceed, Proceed with Conditions, or Do Not Proceed.",
    category: "Decision",
    verification: "site-verified"
  }
];

export const proofVariants = [
  {
    slug: "decision-room",
    name: "The Decision Room",
    summary: "A cinematic assessment table where evidence moves into position around the final decision."
  }
] as const;

export type ProofVariant = (typeof proofVariants)[number]["slug"];

export function isProofVariant(value: string): value is ProofVariant {
  return proofVariants.some((variant) => variant.slug === value);
}
