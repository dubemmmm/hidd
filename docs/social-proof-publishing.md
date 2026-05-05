# Social Proof Publishing Handover

The homepage `Social proof` section now mixes:

- `Social Proof` documents published in Sanity
- seeded HIDD proof items that stay recent-looking automatically

That means the section still works even before the CMS is fully populated, but HIDD can
now add or update real client proof directly in Studio.

## Where to publish

1. Open `/studio`.
2. In the left sidebar, select `Social Proof`.
3. Create a new document.

## Fields to fill

- `Name`: Client or representative name.
- `Role`: Short context line, for example `Buyer` or `Diaspora Buyer`.
- `Location`: Place label shown on the card, for example `Lekki Phase 1, Lagos` or `London, United Kingdom`.
- `Quote`: The main proof text shown on the homepage card.
- `Initials`: Optional. Leave blank if you want the site to generate initials from the name.
- `Activity Label`: Short phrase used before the relative time, for example `Commented` or `Shared feedback`.
- `Activity Date`: The date/time used to create labels such as `Commented 2 days ago`.
- `Display Order`: Lower numbers are prioritised before higher numbers.

## Current site behavior

- The homepage social proof section now reads Sanity `Social Proof` documents.
- Seeded proof items are merged in automatically so the section never feels empty.
- Items are sorted by recent activity time, then shown in the homepage social proof track.
- If you want something to look recent, use a recent `Activity Date`.
