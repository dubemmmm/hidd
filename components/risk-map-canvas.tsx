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
  onReady?: () => void;
  interactionMode?: "preview" | "interactive";
};

// Contextual bbox around the six displayed districts. It is intentionally a
// little tighter than the wider Lagos overview so the assessment zones remain
// easy to select without losing their coastal context.
// [[west, south], [east, north]]
const LAGOS_BOUNDS: [[number, number], [number, number]] = [
  [3.34, 6.36],
  [3.55, 6.5]
];

// Portrait screens need a tighter longitude span; otherwise fitBounds leaves
// the selectable districts looking disproportionately small.
const MOBILE_LAGOS_BOUNDS: [[number, number], [number, number]] = [
  [3.395, 6.395],
  [3.49, 6.475]
];

const CARTO_LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

type DisplayZone = {
  center: [number, number];
  radiusLng: number;
  radiusLat: number;
};

// Deliberately compact map-selection zones centered on verified Lagos locations.
// They are not presented as cadastral or administrative boundaries. Keeping the
// zones inset is important because Banana Island sits within greater Ikoyi and
// Oniru adjoins Victoria Island; literal neighbourhood extents would overlap.
const DISTRICT_DISPLAY_ZONES: Record<string, DisplayZone> = {
  "victoria-island": {
    center: [3.4259904, 6.4300279],
    radiusLng: 0.0105,
    radiusLat: 0.008
  },
  ikoyi: {
    center: [3.4280523, 6.4523431],
    radiusLng: 0.013,
    radiusLat: 0.008
  },
  "banana-island": {
    center: [3.4593152, 6.4600581],
    radiusLng: 0.012,
    radiusLat: 0.009
  },
  oniru: {
    center: [3.4421978, 6.4305],
    radiusLng: 0.005,
    radiusLat: 0.004
  },
  "lekki-phase-1": {
    center: [3.4704698, 6.4413987],
    radiusLng: 0.007,
    radiusLat: 0.0045
  },
  "eko-atlantic": {
    center: [3.4182044, 6.4096024],
    radiusLng: 0.013,
    radiusLat: 0.008
  }
};

function displayZonePolygon(zone: DisplayZone): GeoJSON.Feature<GeoJSON.Polygon> {
  const [lng, lat] = zone.center;
  const x = zone.radiusLng;
  const y = zone.radiusLat;
  const coordinates: Array<[number, number]> = [
    [lng - x, lat],
    [lng - x / 2, lat + y],
    [lng + x / 2, lat + y],
    [lng + x, lat],
    [lng + x / 2, lat - y],
    [lng - x / 2, lat - y]
  ];

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [[...coordinates, coordinates[0]]]
    }
  };
}

export default function RiskMapCanvas({
  areas,
  tierBySlug,
  activeSlug,
  onSelect,
  onReady,
  interactionMode = "interactive"
}: RiskMapCanvasProps) {
  const mapRef = useRef<MapRef | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const hoveredSlugRef = useRef<string | null>(null);

  const resizeMap = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const isMobile = (frameRef.current?.clientWidth ?? window.innerWidth) <= 640;

    map.resize();
    map.fitBounds(isMobile ? MOBILE_LAGOS_BOUNDS : LAGOS_BOUNDS, {
      padding: isMobile ? 20 : 40,
      duration: 0
    });
  }, []);

  const featureCollection = useMemo<GeoJSON.FeatureCollection<GeoJSON.Polygon>>(
    () => ({
      type: "FeatureCollection",
      features: areas.map((area) => ({
        ...(DISTRICT_DISPLAY_ZONES[area.slug]
          ? displayZonePolygon(DISTRICT_DISPLAY_ZONES[area.slug])
          : area.geojsonFeature),
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

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(resizeMap);
    });

    resizeObserver.observe(frame);
    window.addEventListener("resize", resizeMap);

    const resizeFrame = window.requestAnimationFrame(resizeMap);
    const resizeTimeout = window.setTimeout(resizeMap, 250);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resizeMap);
      window.cancelAnimationFrame(resizeFrame);
      window.clearTimeout(resizeTimeout);
    };
  }, [resizeMap]);

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
    <div ref={frameRef} className="risk-map-canvas__frame">
      <Map
        ref={mapRef}
        mapStyle={CARTO_LIGHT_STYLE}
        initialViewState={{
          bounds: LAGOS_BOUNDS,
          fitBoundsOptions: { padding: 40 }
        }}
        minZoom={10}
        maxZoom={15}
        renderWorldCopies={false}
        scrollZoom={interactionMode === "interactive"}
        dragPan={interactionMode === "interactive"}
        touchZoomRotate={interactionMode === "interactive"}
        doubleClickZoom={interactionMode === "interactive"}
        keyboard={interactionMode === "interactive"}
        boxZoom={interactionMode === "interactive"}
        dragRotate={false}
        touchPitch={false}
        interactiveLayerIds={["district-fill"]}
        onLoad={() => {
          resizeMap();
          onReady?.();
        }}
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
              "#2c5f97",
              "medium",
              "#bc9136",
              "high",
              "#8f3a30",
              "#6d7d91"
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "active"], false],
              0.84,
              ["boolean", ["feature-state", "hover"], false],
              0.72,
              0.56
            ]
          }}
        />
        <Layer
          id="district-outline"
          type="line"
          layout={{
            "line-join": "round",
            "line-cap": "round"
          }}
          paint={{
            "line-color": [
              "match",
              ["get", "tier"],
              "low",
              "#173a63",
              "medium",
              "#7f5b14",
              "high",
              "#5f211a",
              "#49586d"
            ],
            "line-width": [
              "case",
              ["boolean", ["feature-state", "active"], false],
              3.2,
              ["boolean", ["feature-state", "hover"], false],
              2.6,
              1.7
            ],
            "line-opacity": 0.95
          }}
        />
        <Layer
          id="district-label"
          type="symbol"
          layout={{
            "text-field": ["get", "name"],
            "text-size": 9,
            "text-font": ["Open Sans Semibold"],
            "text-transform": "uppercase",
            "text-letter-spacing": 0.06,
            "text-variable-anchor": [
              "center",
              "top",
              "bottom",
              "left",
              "right",
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right"
            ],
            "text-radial-offset": 0.75,
            "text-justify": "auto",
            "text-padding": 1,
            "text-allow-overlap": false,
            "symbol-placement": "point"
          }}
          paint={{
            "text-color": "#0f2340",
            "text-halo-color": "rgba(250, 248, 243, 0.9)",
            "text-halo-width": 1.4
          }}
        />
      </Source>

    </Map>
    </div>
  );
}
