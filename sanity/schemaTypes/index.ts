import { type SchemaTypeDefinition } from "sanity";

import { caseStudyType } from "./caseStudyType";
import { faqType } from "./faqType";
import { mapAreaType } from "./mapAreaType";
import { postType } from "./postType";
import { professionalProfileType } from "./professionalProfileType";
import { reportAssetType } from "./reportAssetType";
import { resourceAccessType } from "./resourceAccessType";
import { socialProofType } from "./socialProofType";

export const schemaTypes: SchemaTypeDefinition[] = [
  postType,
  professionalProfileType,
  caseStudyType,
  reportAssetType,
  resourceAccessType,
  mapAreaType,
  socialProofType,
  faqType
];
