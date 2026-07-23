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

const CARTO_LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export default function RiskMapCanvas({
  areas,
  tierBySlug,
  activeSlug,
  onSelect
}: RiskMapCanvasProps) {
  const mapRef = useRef<MapRef | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const hoveredSlugRef = useRef<string | null>(null);

  const resizeMap = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;
    map.resize();
    map.fitBounds(LAGOS_BOUNDS, {
      padding: 40,
      duration: 0
    });
  }, []);

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
        dragRotate={false}
        touchPitch={false}
        interactiveLayerIds={["district-fill"]}
        onLoad={resizeMap}
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
