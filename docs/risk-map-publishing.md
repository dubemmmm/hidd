# Risk Map Publishing Handover

The public risk map is now editable in Sanity through a dedicated `Risk Map District` document type.

## Where to publish

1. Open `/studio`.
2. In the left sidebar, select `Risk Map District`.
3. Create a new document for each neighbourhood.

## Fields to fill

- `Area Name`: The full neighbourhood name shown on the site.
- `Slug`: URL-safe version of the name. This powers `/risk-map/[slug]`.
- `Map Label`: Optional shorter label for the map polygon. Leave blank to reuse the area name.
- `Display Order`: Controls the order areas appear when the map data is listed.
- `Risk Level`: `Low risk`, `Mid risk`, or `High risk`.
- `Headline`: Short line shown at the top of the popup and district brief.
- `Summary`: Main overview paragraph used in the popup and district brief.
- `Framing Note`: Extra judgement/context shown on the district page.
- `District Brief Body`: Optional longer rich-text content shown on the district brief page below the framing note. Use this for expanded neighbourhood context, buyer guidance, lists, and quotes.
- `Assessment Date`: Date of the current review.
- `Analyst`: Usually `HIDD Advisory`.
- `Red Flag`: Short alert label such as `None`, `Coastal exposure`, or `Delivery & absorption risk`.
- `Polygon Coordinates`: The longitude/latitude points that draw the district polygon on the map.
- `Layer Scores`: Internal map-colouring values for flooding, title complexity, planning, infrastructure, security, environmental, and market liquidity.
- `Assessment Categories`: The structured sections shown in the popup and district brief.

## Assessment category format

Each category contains one or more indicators with:

- `Code`: Example `1.1`
- `Label`: Example `Title chain and documentation confidence`
- `Note`: The short explanatory text shown to users

These are intentionally compact. The site no longer exposes visible weights or raw scores to users.

## Current site behaviour

- The homepage map, `/risk-map`, and each district detail page read `Risk Map District` documents from Sanity.
- If `District Brief Body` is filled in, the district page renders that content. If it is empty, the page keeps the short launch placeholder note.
- If Sanity has no `Risk Map District` documents yet, the site falls back to the local launch seed data.
- Published changes should appear on the site within about 1 minute.
