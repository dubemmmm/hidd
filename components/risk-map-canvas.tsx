"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Map, {
  Layer,
  Source,
  type MapLayerMouseEvent,
  type MapRef
} from "react-map-gl/maplibre";

import type { MapArea, RiskTier } from "@/lib/types";

import "maplibre-gl/dist/maplibre-gl.css";

type RiskMapCanvasProps = {
  areas: MapArea[];
  tierBySlug: Record<string, RiskTier>;
  activeSlug: string;
  onSelect: (slug: string) => void;
};

// Tight bbox around the five launch districts (VI, Ikoyi, Banana Island, Lekki Phase 1, Eko Atlantic)
// [[west, south], [east, north]]
const LAGOS_BOUNDS: [[number, number], [number, number]] = [
  [3.28, 6.34],
  [3.58, 6.52]
];

const CARTO_DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export default function RiskMapCanvas({
  areas,
  tierBySlug,
  activeSlug,
  onSelect
}: RiskMapCanvasProps) {
  const mapRef = useRef<MapRef | null>(null);
  const hoveredSlugRef = useRef<string | null>(null);

  const featureCollection = useMemo<GeoJSON.FeatureCollection<GeoJSON.Polygon>>(
    () => ({
      type: "FeatureCollection",
      features: areas.map((area) => ({
        ...area.geojsonFeature,
        id: area.slug,
        properties: {
          slug: area.slug,
          name: area.label,
          tier: tierBySlug[area.slug] ?? area.riskGrade
        }
      }))
    }),
    [areas, tierBySlug]
  );

  // Keep MapLibre feature-state in sync with the active selection so paint
  // expressions can highlight the chosen polygon without a re-render.
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const syncFeatureState = () => {
      for (const area of areas) {
        map.setFeatureState(
          { source: "districts", id: area.slug },
          { active: area.slug === activeSlug }
        );
      }
    };

    if (map.isStyleLoaded()) {
      syncFeatureState();
    } else {
      map.once("load", syncFeatureState);
    }
  }, [activeSlug, areas]);

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0];
      const slug = feature?.properties?.slug;
      if (typeof slug === "string") {
        onSelect(slug);
      }
    },
    [onSelect]
  );

  const handleMouseMove = useCallback((event: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const canvas = map.getCanvas();
    if (canvas) canvas.style.cursor = "pointer";

    const feature = event.features?.[0];
    const nextSlug =
      typeof feature?.properties?.slug === "string" ? feature.properties.slug : null;

    if (nextSlug === hoveredSlugRef.current) return;

    if (hoveredSlugRef.current) {
      map.setFeatureState(
        { source: "districts", id: hoveredSlugRef.current },
        { hover: false }
      );
    }

    hoveredSlugRef.current = nextSlug;

    if (nextSlug) {
      map.setFeatureState({ source: "districts", id: nextSlug }, { hover: true });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const canvas = map.getCanvas();
    if (canvas) canvas.style.cursor = "";

    if (hoveredSlugRef.current) {
      map.setFeatureState(
        { source: "districts", id: hoveredSlugRef.current },
        { hover: false }
      );
      hoveredSlugRef.current = null;
    }
  }, []);

  return (
    <Map
      ref={mapRef}
      mapStyle={CARTO_DARK_STYLE}
      initialViewState={{
        bounds: LAGOS_BOUNDS,
        fitBoundsOptions: { padding: 32 }
      }}
      maxBounds={LAGOS_BOUNDS}
      minZoom={10}
      maxZoom={15}
      interactiveLayerIds={["district-fill"]}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      attributionControl={true}
      style={{ width: "100%", height: "100%" }}
    >
      <Source
        id="districts"
        type="geojson"
        data={featureCollection}
        promoteId="slug"
      >
        <Layer
          id="district-fill"
          type="fill"
          paint={{
            "fill-color": [
              "match",
              ["get", "tier"],
              "low",
              "#1f6a48",
              "medium",
              "#a8772b",
              "high",
              "#8f1f28",
              "#555"
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "active"], false],
              0.75,
              ["boolean", ["feature-state", "hover"], false],
              0.6,
              0.42
            ]
          }}
        />
        <Layer
          id="district-outline"
          type="line"
          paint={{
            "line-color": [
              "match",
              ["get", "tier"],
              "low",
              "#8bd8b2",
              "medium",
              "#f0c171",
              "high",
              "#f1a2aa",
              "#aaa"
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "active"], false],
              2.6,
              ["boolean", ["feature-state", "hover"], false],
              2,
              1.2
            ]
          }}
        />
        <Layer
          id="district-label"
          type="symbol"
          layout={{
            "text-field": ["get", "name"],
            "text-size": 12,
            "text-font": ["Open Sans Semibold"],
            "text-transform": "uppercase",
            "text-letter-spacing": 0.1,
            "text-allow-overlap": false,
            "symbol-placement": "point"
          }}
          paint={{
            "text-color": "#f4f1ea",
            "text-halo-color": "rgba(0,0,0,0.6)",
            "text-halo-width": 1.4
          }}
        />
      </Source>
    </Map>
  );
}
