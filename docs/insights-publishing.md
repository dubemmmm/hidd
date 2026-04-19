# Insights Publishing Handover

This document is for the HIDD team member responsible for publishing Insights articles (one per week, per brief §7). It assumes no prior Sanity experience.

---

## What system you're using

The site's Insights articles are stored in **Sanity CMS**. Sanity provides a web-based editor called **Sanity Studio** that HIDD uses to write, edit, and publish posts. No code changes or developer involvement are needed once Sanity is configured.

Articles you publish in Sanity appear on the live site automatically, usually within 1–2 minutes.

There is a **fallback**: if Sanity is ever unreachable, the site will continue to serve any articles that have been bundled into the codebase as `.mdx` files under `content/insights/`. This is only a safety net — day-to-day publishing should happen in Sanity.

---

## One-time setup (already done by the developer)

These should already be configured before handover. Confirm with the developer if unsure:

- Sanity project created under HIDD's Sanity organisation.
- The following environment variables set on the production host (Vercel / wherever the site is deployed):
  - `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
  - `NEXT_PUBLIC_SANITY_API_VERSION`
  - `SANITY_API_READ_TOKEN` (only if the dataset is private)
- Your HIDD team members have been invited to the Sanity project as Editors (`manage.sanity.io` → Project → Members → Invite).

---

## Accessing Sanity Studio

Sanity Studio is hosted at `/studio` on the HIDD website. For example:

- **Production:** `https://hiddadvisory.com/studio`
- **Local dev (developer only):** `http://localhost:3000/studio`

Log in with the email address HIDD invited to the project. Google or GitHub sign-in both work.

---

## Publishing a new article — weekly workflow

### Step 1. Open Studio and create a post

1. Go to `https://hiddadvisory.com/studio`.
2. From the left sidebar, click **Post**.
3. Click the **+** (new document) button at the top.

### Step 2. Fill every required field

Every field below is **required**. The post cannot be published until all are filled.

| Field | What to put | Example |
|---|---|---|
| **Title** | The article headline as readers will see it. | *Governor's Consent Explained* |
| **Slug** | URL-safe version of the title. Click "Generate" to auto-fill from the title. Only change if the generated version is long or ugly. | `governors-consent-explained` |
| **Category** | One short label used for filtering on the Insights page. Be consistent with categories already in use. | *Legal Process* · *Market Analysis* · *Neighbourhood Brief* · *Buyer Discipline* |
| **Excerpt** | 2–3 sentence summary shown on the Insights index card. No markdown, no line breaks. | *Governor's consent is one of the most misunderstood elements of a Lagos property transaction…* |
| **Author** | Defaults to "HIDD Advisory". Override with an individual name only if the article is bylined. | *HIDD Advisory* |
| **Published Date** | Date + time the article should be considered live. Set to now for immediate publishing, or a future time to schedule. | *2026-04-20 09:00* |
| **Read Time** | Explicit, manually entered. **Do not guess** — count roughly 200 words per minute. | *3 min read* · *5 min read* |
| **Body** | The article content itself. See the *Writing the body* section below. | — |
| **Cover Image URL** *(optional)* | Full URL to a hosted image. Leave blank to use the default. See *Images* below. | `https://cdn.hiddadvisory.com/covers/governors-consent.jpg` |
| **SEO Title** | Title for search engines. Can be the same as the article title or a search-optimised variant. Keep under 60 characters. | *Governor's Consent in Lagos — HIDD Advisory* |
| **SEO Description** | 1–2 sentence description for search results. Keep under 160 characters. | *A plain-language explainer on what Governor's Consent means for Lagos property buyers.* |
| **Open Graph Image URL** *(optional)* | Full URL to a 1200×630 image shown when the article is shared on WhatsApp / LinkedIn / X. Leave blank to use the default. | `https://cdn.hiddadvisory.com/og/governors-consent.jpg` |
| **Related Service CTA** | Which HIDD service should be promoted at the bottom of the article. Pick from the dropdown. | *Legal Due Diligence* |

### Step 3. Writing the body

The body uses Sanity's block editor (similar to Google Docs). Each paragraph is its own block.

Supported formatting:
- **Bold**, *italic*, ~~strikethrough~~.
- Headings (H2, H3).
- Bulleted and numbered lists.
- Block quotes.
- Internal and external links (select text → link icon → paste URL).

**Do not** use H1 — the article title is already rendered as H1 by the page template. Start section headings at H2.

### Step 4. Preview before publishing

1. Click the three-dot menu next to **Publish** at the bottom of the editor.
2. Select **Review changes**.
3. This shows you exactly what's about to go live.

There is no rich front-end preview built into this site yet. If you need to see the article rendered on the live site, you can:
- Publish it with an **unlisted** approach: set the Published Date to a future time, publish the draft so it's saved, then edit/republish after review.
- Or ask a developer to add a proper preview URL — this is a useful phase-two add.

### Step 5. Publish

1. Click **Publish** (green button, bottom of the editor).
2. Wait 1–2 minutes.
3. Visit `https://hiddadvisory.com/insights` and confirm the new article appears at the top of the grid.
4. Click through and confirm the article page looks correct.

### Step 6. Social share check

If you added a custom Open Graph image, paste the article URL into the LinkedIn Post Inspector (`https://www.linkedin.com/post-inspector`) to confirm the image and SEO title render correctly. WhatsApp uses the same OG image.

---

## Editing an existing article

1. In Studio, click **Post** in the sidebar.
2. Click the article in the list.
3. Make changes.
4. Click **Publish** again. The live site updates within 1–2 minutes.

Sanity keeps a version history. If you need to revert, open the article, click the clock icon (top right), and restore a prior version.

---

## Unpublishing an article

1. Open the article in Studio.
2. Three-dot menu → **Unpublish**.

This removes it from the live site but keeps the draft in Sanity. To permanently delete, use **Delete** from the same menu — but prefer unpublishing unless the article was a mistake.

---

## Images

The cover image and OG image fields are **URL fields**, not uploaders. You have two options:

**Option A — Host on Sanity's built-in asset CDN** *(recommended for weekly publishing)*
A developer can extend the schema to use Sanity's native image upload in phase two. Until then, use Option B.

**Option B — Host images externally**
Upload your image to any hosted service (Google Drive with public share, Cloudinary, Imgix, or your own S3 bucket), copy the public URL, and paste it into the field.

**Image specs:**
- Cover image: 1600×900 (16:9), under 400KB, JPEG.
- OG image: 1200×630, under 400KB, JPEG.

If you leave either blank, the site falls back to `/og-default.svg`, which is a HIDD-branded placeholder.

---

## Categories already in use

As of launch, the following categories exist on published articles. Please re-use these rather than inventing new ones unless you have a clear editorial reason:

- *Buyer Discipline*
- *Legal Process*
- *Neighbourhood Brief*
- *Market Analysis*

If you add a new category, it appears automatically in the Insights filter dropdown — no developer work needed.

---

## What to check before hitting Publish — checklist

- [ ] Title is sharp and under ~70 characters.
- [ ] Slug is lowercase, hyphenated, and readable.
- [ ] Excerpt reads well out of context and is under 300 characters.
- [ ] Read time is entered as a real minute count (not "1 min read" unless it genuinely is).
- [ ] Published date is correct.
- [ ] SEO title is under 60 characters.
- [ ] SEO description is under 160 characters.
- [ ] Related Service CTA matches the article topic.
- [ ] Body uses H2 for sections, not H1.
- [ ] Body has been proofread. Sanity doesn't save autosaved drafts forever — close the tab and your unpublished edits can be lost.
- [ ] Preview via *Review changes* before publishing.

---

## Troubleshooting

**"The article isn't showing on the live site after 5 minutes."**
- Confirm you clicked **Publish**, not just saved the draft.
- Check that the Published Date is not in the future.
- Hard-refresh the live Insights page (`Ctrl+Shift+R` / `Cmd+Shift+R`).
- If still missing, contact the developer — there may be an environment variable or cache issue.

**"I published, but the SEO title and description are wrong on a share preview."**
- LinkedIn and WhatsApp cache OG data aggressively. Use LinkedIn Post Inspector to force a refresh.

**"I can't log into Studio."**
- Confirm you were invited via `manage.sanity.io`.
- Check you're using the exact email address the invite went to.
- Clear cookies for the Studio domain if login loops.

**"I need to add a new field to all articles."**
- This requires a developer change to `sanity/schemaTypes/postType.ts`. Not something HIDD editors can do themselves.

---

## Contact

- Studio URL: `https://hiddadvisory.com/studio`
- Sanity project dashboard: `https://www.sanity.io/manage`
- Developer contact: (to be filled in at handover)
