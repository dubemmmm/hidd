"use client";

import { useEffect, useRef } from "react";

import { mapAreas } from "@/lib/data/map-areas";
import type { MapAreaRisk } from "@/lib/types";

const riskTierLabel: Record<MapAreaRisk["tier"], string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk"
};

function popupMarkup(area: MapAreaRisk) {
  const ctaHref = `/contact?service=risk-intelligence&area=${encodeURIComponent(area.name)}`;

  return `
    <div class="risk-popup">
      <div class="risk-popup__badge risk-popup__badge--${area.tier}">
        ${riskTierLabel[area.tier]}
      </div>
      <h3>${area.name}</h3>
      <div class="risk-popup__rows">
        <div class="risk-popup__row"><span>Flood risk</span><strong>${area.floodRisk}%</strong></div>
        <div class="risk-popup__row"><span>Infrastructure</span><strong>${area.infrastructure}%</strong></div>
        <div class="risk-popup__row"><span>Title complexity</span><strong>${area.titleComplexity}%</strong></div>
      </div>
      <a class="risk-popup__cta" href="${ctaHref}">Get full report</a>
    </div>
  `;
}

export default function RiskMap() {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    let map: import("leaflet").Map | null = null;

    async function setupMap() {
      if (!mapNodeRef.current) return;

      const L = await import("leaflet");
      if (!isMounted || !mapNodeRef.current) return;

      map = L.map(mapNodeRef.current, {
        center: [6.5244, 3.4219],
        zoom: 11,
        minZoom: 10,
        maxZoom: 14,
        scrollWheelZoom: false,
        attributionControl: true,
        zoomControl: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapAreas.forEach((area) => {
        const marker = L.marker([area.lat, area.lng], {
          icon: L.divIcon({
            className: "osm-marker",
            html: `
              <span class="osm-risk-marker osm-risk-marker--${area.tier}">
                <span class="osm-risk-marker__pulse"></span>
                <span class="osm-risk-marker__dot"></span>
                <span class="osm-risk-marker__label">${area.label}</span>
              </span>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        });

        marker.bindPopup(popupMarkup(area), {
          className: "leaflet-risk-popup",
          maxWidth: 280,
          autoPan: true,
          closeButton: true
        });
        marker.addTo(map as import("leaflet").Map);
      });

      setTimeout(() => {
        map?.invalidateSize();
      }, 120);
    }

    void setupMap();

    return () => {
      isMounted = false;
      map?.remove();
    };
  }, []);

  return (
    <>
      <div className="map-shell">
        <div className="map-shell__stage">
          <div className="map-shell__overlay">
            <span>OpenStreetMap basemap</span>
            <strong>12 Lagos zones</strong>
            <p>Approximate area centroids for v1. Click any marker for a quick HIDD risk snapshot.</p>
          </div>
          <div ref={mapNodeRef} className="map-shell__map" aria-label="Interactive Lagos risk map" />
        </div>

        <div className="map-shell__legend">
          <span className="legend-pill legend-pill--low">Low risk</span>
          <span className="legend-pill legend-pill--medium">Medium risk</span>
          <span className="legend-pill legend-pill--high">High risk</span>
        </div>
      </div>
    </>
  );
}
