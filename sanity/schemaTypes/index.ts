import { type SchemaTypeDefinition } from "sanity";

import { caseStudyType } from "./caseStudyType";
import { faqType } from "./faqType";
import { mapAreaType } from "./mapAreaType";
import { postType } from "./postType";
import { reportAssetType } from "./reportAssetType";
import { socialProofType } from "./socialProofType";

export const schemaTypes: SchemaTypeDefinition[] = [
  postType,
  caseStudyType,
  reportAssetType,
  mapAreaType,
  socialProofType,
  faqType
];
