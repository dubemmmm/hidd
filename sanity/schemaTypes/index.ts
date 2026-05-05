import { type SchemaTypeDefinition } from "sanity";

import { mapAreaType } from "./mapAreaType";
import { postType } from "./postType";
import { reportAssetType } from "./reportAssetType";
import { socialProofType } from "./socialProofType";

export const schemaTypes: SchemaTypeDefinition[] = [
  postType,
  reportAssetType,
  mapAreaType,
  socialProofType
];
