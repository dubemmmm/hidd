import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  turbopack: {
    root: path.resolve(__dirname)
  },
  async redirects() {
    return [
      { source: "/blog/:path*", destination: "/insights", statusCode: 301 },
      { source: "/about/:path*", destination: "/", statusCode: 301 },
      {
        source: "/services/property-due-diligence",
        destination: "/services/legal-due-diligence",
        statusCode: 301
      },
      {
        source: "/services/due-diligence",
        destination: "/services/legal-due-diligence",
        statusCode: 301
      },
      {
        source: "/services/property-valuation",
        destination: "/services/valuation",
        statusCode: 301
      },
      {
        source: "/services/property-risk-advisory",
        destination: "/services/risk-intelligence",
        statusCode: 301
      },
      {
        source: "/services/risk-advisory",
        destination: "/services/risk-intelligence",
        statusCode: 301
      },
      {
        source: "/services/property-inspection",
        destination: "/services/home-inspection",
        statusCode: 301
      },
      {
        source: "/home-inspection",
        destination: "/services/home-inspection",
        statusCode: 301
      },
      {
        source: "/what-a-home-inspection-reveals-that-sellers-do-not-disclose",
        destination: "/services/home-inspection",
        statusCode: 301
      },
      {
        source: "/is-the-property-worth-the-price-how-valuation-can-save-you-millions",
        destination: "/insights",
        statusCode: 301
      },
      {
        source: "/why-diaspora-nigerians-are-most-at-risk-when-buying-property-back-home",
        destination: "/insights",
        statusCode: 301
      },
      {
        source: "/buying-property-in-nigeria-7-costly-mistakes-due-diligence-can-help-you-avoid",
        destination: "/insights/lagos-buyers-checklist",
        statusCode: 301
      }
    ];
  }
};

export default nextConfig;
