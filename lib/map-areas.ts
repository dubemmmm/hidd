import "server-only";

import groq from "groq";
import { cache } from "react";

import {
  mapAreas as localMapAreas
} from "@/lib/data/map-areas";
import { sanityClient, sanityEnvReady } from "@/lib/sanity";
import { sanityPreviewClient, sanityServerClient } from "@/lib/sanity.server";
import type { MapArea, RiskAssessmentCategory, RiskLayerKey, RiskTier } from "@/lib/types";

type RawSanityCoordinate = {
  lng?: number | null;
  lat?: number | null;
};

type RawSanityIndicator = {
  code?: string | null;
  label?: string | null;
  note?: string | null;
};

type RawSanityCategory = {
  _key?: string | null;
  title?: string | null;
  indicators?: RawSanityIndicator[] | null;
};

type RawSanityMapArea = {
  slug?: string | null;
  name?: string | null;
  label?: string | null;
  riskGrade?: RiskTier | null;
  headline?: string | null;
  summary?: string | null;
  framingNote?: string | null;
  briefBody?: unknown[] | null;
  assessmentDate?: string | null;
  analyst?: string | null;
  redFlag?: string | null;
  polygonCoordinates?: RawSanityCoordinate[] | null;
  layerScores?: Partial<Record<RiskLayerKey, number | null>> | null;
  assessmentCategories?: RawSanityCategory[] | null;
};

const mapAreaFields = groq`
  name,
  "slug": slug.current,
  "label": coalesce(label, name),
  riskGrade,
  headline,
  summary,
  framingNote,
  briefBody,
  assessmentDate,
  analyst,
  redFlag,
  polygonCoordinates[]{
    lng,
    lat
  },
  "layerScores": {
    "flooding": layerScores.flooding,
    "title-complexity": layerScores.titleComplexity,
    "planning-zoning": layerScores.planningZoning,
    "infrastructure": layerScores.infrastructure,
    "security": layerScores.security,
    "environmental": layerScores.environmental,
    "market-liquidity": layerScores.marketLiquidity
  },
  assessmentCategories[]{
    _key,
    title,
    indicators[]{
      code,
      label,
      note
    }
  }
`;

const allMapAreasQuery = groq`
  *[_type == "mapArea"] | order(displayOrder asc, name asc) {
    ${mapAreaFields}
  }
`;

function polygon(
  coordinates: Array<[number, number]>
): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[...coordinates, coordinates[0]]]
    }
  };
}

function formatAssessmentDate(value: string | null | undefined) {
  if (!value) return "Date pending";

  const parts = value.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts.map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  }

  return value;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategories(categories: RawSanityCategory[] | null | undefined): RiskAssessmentCategory[] {
  return (categories ?? [])
    .map((category, index) => {
      const title = category.title?.trim();
      if (!title) return null;

      const indicators = (category.indicators ?? [])
        .map((indicator) => {
          const code = indicator.code?.trim();
          const label = indicator.label?.trim();
          const note = indicator.note?.trim();

          if (!code || !label || !note) {
            return null;
          }

          return {
            code,
            label,
            note
          };
        })
        .filter((indicator): indicator is NonNullable<typeof indicator> => Boolean(indicator));

      if (indicators.length === 0) {
        return null;
      }

      return {
        key: category._key?.trim() || `${slugify(title) || "category"}-${index}`,
        title,
        indicators
      };
    })
    .filter((category): category is RiskAssessmentCategory => Boolean(category));
}

function normalizeLayerScores(
  layerScores: Partial<Record<RiskLayerKey, number | null>> | null | undefined
): Record<RiskLayerKey, number> {
  return {
    flooding: Number(layerScores?.flooding ?? 0),
    "title-complexity": Number(layerScores?.["title-complexity"] ?? 0),
    "planning-zoning": Number(layerScores?.["planning-zoning"] ?? 0),
    infrastructure: Number(layerScores?.infrastructure ?? 0),
    security: Number(layerScores?.security ?? 0),
    environmental: Number(layerScores?.environmental ?? 0),
    "market-liquidity": Number(layerScores?.["market-liquidity"] ?? 0)
  };
}

function normalizeCoordinates(
  coordinates: RawSanityCoordinate[] | null | undefined
): Array<[number, number]> {
  return (coordinates ?? [])
    .map((coordinate) => {
      if (
        typeof coordinate.lng !== "number" ||
        Number.isNaN(coordinate.lng) ||
        typeof coordinate.lat !== "number" ||
        Number.isNaN(coordinate.lat)
      ) {
        return null;
      }

      return [coordinate.lng, coordinate.lat] as [number, number];
    })
    .filter((coordinate): coordinate is [number, number] => Boolean(coordinate));
}

function normalizeMapArea(area: RawSanityMapArea): MapArea | null {
  const slug = area.slug?.trim();
  const name = area.name?.trim();
  const label = area.label?.trim() || name;
  const headline = area.headline?.trim();
  const summary = area.summary?.trim();
  const framingNote = area.framingNote?.trim();
  const analyst = area.analyst?.trim() || "HIDD Advisory";
  const redFlag = area.redFlag?.trim() || "None";
  const coordinates = normalizeCoordinates(area.polygonCoordinates);

  if (!slug || !name || !label || !headline || !summary || !framingNote || coordinates.length < 3) {
    return null;
  }

  return {
    slug,
    name,
    label,
    riskGrade: area.riskGrade ?? "low",
    geojsonFeature: polygon(coordinates),
    headline,
    summary,
    framingNote,
    briefBody: Array.isArray(area.briefBody) && area.briefBody.length > 0 ? area.briefBody : undefined,
    assessmentDate: formatAssessmentDate(area.assessmentDate),
    analyst,
    redFlag,
    layerScores: normalizeLayerScores(area.layerScores),
    assessmentCategories: normalizeCategories(area.assessmentCategories)
  };
}

async function getSanityMapAreas(preview = false): Promise<MapArea[]> {
  let areas: RawSanityMapArea[];

  if (preview) {
    areas = await sanityPreviewClient.fetch<RawSanityMapArea[]>(allMapAreasQuery, {}, {
      cache: "no-store"
    });

    return areas
      .map(normalizeMapArea)
      .filter((area): area is MapArea => Boolean(area));
  }

  try {
    areas = await sanityServerClient.fetch<RawSanityMapArea[]>(allMapAreasQuery);
  } catch {
    // Map districts are public content, so an anonymous CMS read remains valid
    // if a configured server token is temporarily unavailable or rotated.
    areas = await sanityClient.fetch<RawSanityMapArea[]>(allMapAreasQuery);
  }

  return areas
    .map(normalizeMapArea)
    .filter((area): area is MapArea => Boolean(area));
}

export const getMapAreas = cache(async (preview = false): Promise<MapArea[]> => {
  if (sanityEnvReady) {
    try {
      const areas = await getSanityMapAreas(preview);
      if (areas.length > 0) {
        return areas;
      }
    } catch {
      // Keep the map online until the CMS write/read credentials are corrected.
    }
  }

  return localMapAreas;
});

export const getMapArea = cache(async (slug: string, preview = false): Promise<MapArea | undefined> => {
  const areas = await getMapAreas(preview);
  return areas.find((area) => area.slug === slug);
});
