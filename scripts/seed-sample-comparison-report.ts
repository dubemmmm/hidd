import { createClient } from "@sanity/client";
import { createReadStream, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, "..");

try {
  const raw = readFileSync(path.join(projectRoot, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
} catch {}

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("A Sanity write token is required in .env.local.");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09",
  token,
  useCdn: false,
  perspective: "raw"
});

const documentId = "reportAsset.sample-area-comparison-report";
const pdfPath = path.join(projectRoot, "output", "pdf", "sample-area-comparison-report.pdf");

type ExistingReport = { assetRef?: string } | null;

const existing = await client.fetch<ExistingReport>(
  `*[_id == $documentId][0]{"assetRef": assetFile.asset._ref}`,
  { documentId }
);

let assetRef = existing?.assetRef;

if (!assetRef) {
  const uploaded = await client.assets.upload("file", createReadStream(pdfPath), {
    filename: "sample-area-comparison-report.pdf",
    contentType: "application/pdf"
  });
  assetRef = uploaded._id;
}

const block = (key: string, text: string) => ({
  _key: key,
  _type: "block",
  style: "normal",
  markDefs: [],
  children: [{ _key: `${key}-span`, _type: "span", marks: [], text }]
});

await client.createOrReplace({
  _id: documentId,
  _type: "reportAsset",
  isDemo: true,
  title: "Sample Area Comparison Report",
  slug: { _type: "slug", current: "sample-area-comparison-report" },
  category: "Comparison Report",
  summary:
    "A demonstration resource showing how HIDD can present a side-by-side buyer review. All districts and findings in this sample are illustrative.",
  description: [
    block(
      "description-1",
      "This demonstration shows how a comparison report can separate the evidence reviewed, the professional interpretation, unresolved questions, and the final buyer recommendation."
    ),
    block(
      "description-2",
      "It does not assess a real property or district and must not be relied on for a purchase decision. A client report would use verified property, document, location, and market information."
    )
  ],
  keyContents: [
    "Executive comparison for the buyer's decision",
    "Side-by-side review of the selected locations or properties",
    "Outstanding questions and verification requirements",
    "Proceed, Proceed with Conditions, or Do Not Proceed verdict structure",
    "Method, professional authorship, and source disclosure"
  ],
  intendedAudience: ["Property buyers", "Diaspora buyers", "Buyer advisers"],
  coverageAreas: ["Illustrative District A", "Illustrative District B"],
  relatedService: "risk-intelligence",
  authorName: "[Verified professional name]",
  authorCredentials: ["[Relevant professional qualification]", "[Registration details]"],
  contributors: [
    {
      _key: "sample-reviewer",
      _type: "object",
      name: "[Verified contributor name]",
      role: "Professional reviewer",
      credentials: ["[Relevant professional credential]"]
    }
  ],
  edition: "Demonstration Edition",
  version: "1.0",
  pageCount: 4,
  fileFormat: "PDF",
  publishedAt: "2026-08-11T12:00:00.000Z",
  status: "live",
  gated: false,
  featured: false,
  assetFile: {
    _type: "file",
    asset: { _type: "reference", _ref: assetRef }
  },
  sources: [
    {
      _key: "planning-permit",
      _type: "object",
      title: "About Planning Permit",
      publisher: "Lagos State Physical Planning Permit Authority",
      url: "https://www.epp.lagosstate.gov.ng/Home/AboutPlanningPermit",
      accessedAt: "2026-08-11"
    },
    {
      _key: "resilience-strategy",
      _type: "object",
      title: "Lagos Resilience Strategy",
      publisher: "Lagos State Government",
      url: "https://lasbca.lagosstate.gov.ng/wp-content/uploads/2021/05/Lagos_Resilience_Strategy.pdf",
      accessedAt: "2026-08-11"
    }
  ]
});

const verification = await client.fetch<{ _id: string; slug: string; assetUrl?: string } | null>(
  `*[_type == "reportAsset" && slug.current == "sample-area-comparison-report"][0]{_id, "slug": slug.current, "assetUrl": assetFile.asset->url}`
);

if (!verification?.assetUrl) {
  throw new Error("The sample record or its uploaded PDF could not be verified after publication.");
}

const publicClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09",
  useCdn: false,
  perspective: "published"
});
const publicVerification = await publicClient.fetch<{ _id: string } | null>(
  `*[_type == "reportAsset" && slug.current == "sample-area-comparison-report"][0]{_id}`
);
if (!publicVerification) {
  throw new Error("The sample record exists but is not readable through the website's public Sanity client.");
}

console.log("Published Sanity demonstration resource: Sample Area Comparison Report");
console.log("Website route: /insights/resources/sample-area-comparison-report");
