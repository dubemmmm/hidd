import { type SchemaTypeDefinition } from "sanity";

import { postType } from "./postType";
import { reportAssetType } from "./reportAssetType";

export const schemaTypes: SchemaTypeDefinition[] = [postType, reportAssetType];
