import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { sanityApiVersion, sanityDataset, sanityProjectId } from "@/lib/sanity";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "HIDD Advisory Studio",
  projectId: sanityProjectId || "placeholder",
  dataset: sanityDataset || "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes
  },
  apiVersion: sanityApiVersion
});
