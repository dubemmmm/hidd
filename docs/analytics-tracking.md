# Website analytics

HIDD uses the existing Google Analytics 4 integration. Set `NEXT_PUBLIC_GA_ID` to the production
GA4 measurement ID in Vercel (for example, `G-XXXXXXXXXX`) and redeploy the website.

## Conversion events

| Event | When it is recorded | Parameters |
| --- | --- | --- |
| `enquiry_form_submit` | A contact enquiry is accepted by the server | `service`, `has_phone`, `has_message`, `page_path` |
| `asset_unlock` | A visitor successfully submits the access form for a live resource | `asset_slug`, `asset_category`, `page_path` |
| `asset_waitlist_signup` | A visitor successfully joins an upcoming-resource list | `asset_slug`, `asset_category`, `page_path` |
| `sample_report_download` | A sample or demonstration report download link is used | `asset_slug`, `asset_category`, `link_location`, `link_url`, `page_path` |
| `resource_download` | Another downloadable resource link is used | `asset_slug`, `asset_category`, `link_location`, `link_url`, `page_path` |
| `whatsapp_click` | The main WhatsApp contact link is used | `link_location`, `link_url`, `page_path` |
| `article_share_whatsapp` | An article is shared through WhatsApp | `link_location`, `link_url`, `page_path` |
| `sample_report_cta_click` | The homepage sample-report CTA is used | `asset_slug`, `link_location`, `link_url`, `page_path` |

No names, email addresses, phone numbers, enquiry messages, or other submitted personal information
are sent to analytics.

After deployment, open Google Analytics **Admin → Events** and mark the following as key events:

- `enquiry_form_submit`
- `asset_unlock`
- `sample_report_download`
- `whatsapp_click`

Use GA4 DebugView or Realtime to perform one controlled test of each event after the production
measurement ID has been configured.
