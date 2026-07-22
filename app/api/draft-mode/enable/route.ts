import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { sanityPreviewClient } from "@/lib/sanity.server";

export const { GET } = defineEnableDraftMode({
  client: sanityPreviewClient
});
