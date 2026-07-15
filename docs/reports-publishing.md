# Reports / Library Publishing Handover

The `Reports / Library` area is now intended to be managed in Sanity through a dedicated
`Report Download` document type.

## Where to publish

1. Open `/studio`.
2. In the left sidebar, select `Report Download`.
3. Create a new document.

## Fields to fill

- `Title`: The user-facing report or asset name.
- `Slug`: URL-safe identifier. This is used to preselect the asset on `/reports`.
- `Category`: Examples: `Flagship Report`, `Checklist`, `Neighbourhood Brief`.
- `Summary`: Short card copy shown on the library page and homepage surfaces.
- `Published Date`: Used for ordering and homepage signal recency.
- `Status`: `Live` or `Coming soon`.
- `Gated`: Leave enabled unless HIDD wants the asset ungated.
- `Feature on homepage`: Turn on for assets that should appear in the homepage download layer.
- `Download File`: Upload the file directly to Sanity when the asset is live.
- `External Download URL`: Use this only if the file lives outside Sanity.

## Recommended publishing rules

- `Live` assets should have either `Download File` or `External Download URL` filled.
- `Coming soon` assets should usually leave both download fields empty.
- Homepage hero downloads use featured assets first. If nothing is featured, the site falls back to the two newest live assets.

## Current site behavior

- `/reports` reads Sanity `Report Download` documents.
- The homepage featured download cards read the same Sanity source.
- The homepage `Signals from HIDD` layer can now surface report assets alongside insight articles.
