/**
 * Seed the local risk-map districts into Sanity.
 *
 * Dry run:
 *   npm run seed:map-areas
 *
 * Write and verify:
 *   npm run seed:map-areas -- --commit
 *
 * Existing published documents are matched by slug and patched in place, so
 * CMS-only fields such as a longer briefBody are preserved. Missing districts
 * use deterministic IDs (`mapArea.<slug>`) so subsequent runs stay idempotent.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { mapAreas } from "../lib/data/map-areas.ts";

const here = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  try {
    const raw = readFileSync(path.join(here, "..", ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // No .env.local — rely on process environment.
  }
}

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-04-09";
const token = process.env.SANITY_API_WRITE_TOKEN ?? "";
const commit = process.argv.includes("--commit");

function toSanityDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid assessment date: ${value}`);
  }
  return parsed.toISOString().slice(0, 10);
}

function openPolygonCoordinates(area: (typeof mapAreas)[number]) {
  const coordinates = area.geojsonFeature.geometry.coordinates[0];
  const lastIndex = coordinates.length - 1;
  const isClosed =
    coordinates.length > 1 &&
    coordinates[0][0] === coordinates[lastIndex][0] &&
    coordinates[0][1] === coordinates[lastIndex][1];

  return (isClosed ? coordinates.slice(0, -1) : coordinates).map(([lng, lat], index) => ({
    _key: `point-${String(index + 1).padStart(2, "0")}`,
    lng,
    lat
  }));
}

const documents = mapAreas.map((area, index) => ({
  _type: "mapArea" as const,
  name: area.name,
  slug: { _type: "slug" as const, current: area.slug },
  label: area.label,
  displayOrder: index + 1,
  riskGrade: area.riskGrade,
  headline: area.headline,
  summary: area.summary,
  framingNote: area.framingNote,
  assessmentDate: toSanityDate(area.assessmentDate),
  analyst: area.analyst,
  redFlag: area.redFlag,
  polygonCoordinates: openPolygonCoordinates(area),
  layerScores: {
    flooding: area.layerScores.flooding,
    titleComplexity: area.layerScores["title-complexity"],
    planningZoning: area.layerScores["planning-zoning"],
    infrastructure: area.layerScores.infrastructure,
    security: area.layerScores.security,
    environmental: area.layerScores.environmental,
    marketLiquidity: area.layerScores["market-liquidity"]
  },
  assessmentCategories: area.assessmentCategories.map((category) => ({
    _key: category.key,
    title: category.title,
    indicators: category.indicators.map((indicator, indicatorIndex) => ({
      _key: `${category.key}-${String(indicatorIndex + 1).padStart(2, "0")}`,
      code: indicator.code,
      label: indicator.label,
      note: indicator.note
    }))
  }))
}));

console.log(`Prepared ${documents.length} Risk Map District documents.`);
console.log("Districts:", documents.map((document) => document.slug.current).join(", "));

if (!commit) {
  console.log("DRY RUN — nothing was written. Re-run with --commit to push to Sanity.");
  process.exit(0);
}

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
  process.exit(1);
}

if (!token || token.includes("REPLACE_ME") || token === "your_write_token") {
  console.error("Missing a real SANITY_API_WRITE_TOKEN with write access.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
try {
  const existing = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "mapArea" && !(_id in path("drafts.**"))]{_id, "slug": slug.current}`
  );
  const existingIdBySlug = new Map(existing.map((document) => [document.slug, document._id]));

  let transaction = client.transaction();
  for (const document of documents) {
    const existingId = existingIdBySlug.get(document.slug.current);
    if (existingId) {
      transaction = transaction.patch(existingId, (patch) => patch.set(document));
    } else {
      transaction = transaction.createOrReplace({
        _id: `mapArea.${document.slug.current}`,
        ...document
      });
    }
  }

  await transaction.commit();

  const verified = await client.fetch<Array<{ name: string; slug: string; coordinateCount: number }>>(
    `*[_type == "mapArea" && !(_id in path("drafts.**"))] | order(displayOrder asc) {
      name,
      "slug": slug.current,
      "coordinateCount": count(polygonCoordinates)
    }`
  );

  console.log(`Done. Sanity returned ${verified.length} published Risk Map District documents.`);
  for (const district of verified) {
    console.log(`- ${district.name} (${district.slug}): ${district.coordinateCount} polygon points`);
  }
} catch (error) {
  const statusCode =
    typeof error === "object" && error && "statusCode" in error ? String(error.statusCode) : "unknown";
  const message = error instanceof Error ? error.message : "Unknown Sanity error";
  console.error(`Sanity seed failed (${statusCode}): ${message}`);
  process.exit(1);
}
