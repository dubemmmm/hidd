import { defineConfig } from "sanity";
import { defineLocations, presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "@/lib/sanity";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "HIDD Advisory Studio",
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset || "production",
  basePath: "/studio",
  plugins: [
    structureTool(),
    presentationTool({
      title: "Preview Area Compare",
      previewUrl: {
        initial: "/risk-map",
        previewMode: {
          enable: "/api/draft-mode/enable"
        }
      },
      resolve: {
        locations: {
          mapArea: defineLocations({
            select: {
              name: "name",
              slug: "slug.current"
            },
            resolve: (document) => ({
              locations: [
                {
                  title: `Area Compare${document?.name ? ` — ${document.name}` : ""}`,
                  href: "/risk-map"
                },
                ...(document?.slug
                  ? [
                      {
                        title: `${document.name || "District"} brief`,
                        href: `/risk-map/${document.slug}`
                      }
                    ]
                  : [])
              ]
            })
          })
        }
      }
    })
  ],
  schema: {
    types: schemaTypes
  },
  apiVersion: sanityApiVersion
});
