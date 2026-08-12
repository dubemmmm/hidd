import { defineArrayMember, defineField, defineType } from "sanity";

export const caseStudyType = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "clientProfile",
      title: "Client Profile",
      type: "string",
      description: "Example: Diaspora buyer, private land investor, owner-occupier.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "service",
      title: "Related Service",
      type: "string",
      options: {
        list: [
          { title: "Home Inspection", value: "home-inspection" },
          { title: "Legal Due Diligence", value: "legal-due-diligence" },
          { title: "Risk Intelligence", value: "risk-intelligence" },
          { title: "Valuation", value: "valuation" },
          { title: "Comprehensive Report", value: "comprehensive-report" }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "preventedRisk",
      title: "What HIDD Prevented",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      initialValue: "4 min read",
      description: 'Use the format “6 min read”.',
      validation: (rule) =>
        rule.required().regex(/^\d+ min read$/, {
          name: "read time",
          invert: false
        })
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraph", value: "normal" },
            { title: "Section Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" }
          ]
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publicationPermissionConfirmed",
      title: "Client permission confirmed",
      type: "boolean",
      description:
        "Internal only. Confirm that the client has given written permission to publish the anonymised facts in this case study. The public confidentiality notice is shown only after this is enabled.",
      initialValue: false
    }),
    defineField({
      name: "permissionRecord",
      title: "Permission record / internal reference",
      type: "text",
      rows: 2,
      description:
        "Internal only. Record where the written permission is stored, who approved it, and the approval date. Do not enter customer-facing copy here.",
      hidden: ({ parent }) => !parent?.publicationPermissionConfirmed
    }),
    defineField({
      name: "evidenceItems",
      title: "Redacted supporting evidence",
      type: "array",
      description:
        "Optional public evidence supporting this case study. Upload only genuine, appropriately redacted material that HIDD has permission to publish.",
      of: [
        defineArrayMember({
          name: "caseStudyEvidence",
          title: "Evidence item",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Evidence title",
              type: "string",
              description: "Example: Redacted registry extract or Dampness observed beside wet area.",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "evidenceType",
              title: "Evidence type",
              type: "string",
              options: {
                list: [
                  { title: "Registry extract", value: "registry-extract" },
                  { title: "Defect photograph", value: "defect-photo" },
                  { title: "Title document", value: "title-document" },
                  { title: "Survey or planning document", value: "survey-planning-document" },
                  { title: "Valuation or comparable evidence", value: "valuation-evidence" },
                  { title: "Other supporting evidence", value: "other" }
                ]
              },
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "attachmentType",
              title: "Attachment format",
              type: "string",
              options: {
                layout: "radio",
                list: [
                  { title: "Image", value: "image" },
                  { title: "PDF / document", value: "file" }
                ]
              },
              initialValue: "image",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "image",
              title: "Redacted evidence image",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.attachmentType === "file",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { attachmentType?: string } | undefined;
                  return parent?.attachmentType === "file" || value
                    ? true
                    : "Upload an evidence image.";
                })
            }),
            defineField({
              name: "file",
              title: "Redacted evidence document",
              type: "file",
              options: { accept: "application/pdf", storeOriginalFilename: true },
              hidden: ({ parent }) => parent?.attachmentType !== "file",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { attachmentType?: string } | undefined;
                  return parent?.attachmentType !== "file" || value
                    ? true
                    : "Upload a redacted PDF document.";
                })
            }),
            defineField({
              name: "caption",
              title: "Public caption",
              type: "text",
              rows: 2,
              description:
                "Explain what the evidence shows without identifying the client, owner, or exact asset.",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "altText",
              title: "Alternative text",
              type: "string",
              description: "Required for images so the evidence is accessible.",
              hidden: ({ parent }) => parent?.attachmentType === "file",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { attachmentType?: string } | undefined;
                  return parent?.attachmentType === "file" || value?.trim()
                    ? true
                    : "Add alternative text for this image.";
                })
            }),
            defineField({
              name: "redactionNote",
              title: "Redaction note",
              type: "string",
              description:
                "Public note explaining what was removed, for example: Names, plot number and registration details redacted.",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "approvedForPublication",
              title: "Approved for public display",
              type: "boolean",
              description:
                "Internal safeguard. The website will not display this item until its redaction and publication permission have been checked.",
              initialValue: false
            })
          ],
          preview: {
            select: {
              title: "title",
              evidenceType: "evidenceType",
              approved: "approvedForPublication",
              media: "image"
            },
            prepare({ title, evidenceType, approved, media }) {
              return {
                title,
                subtitle: `${evidenceType ?? "Evidence"} · ${approved ? "Approved" : "Not approved"}`,
                media
              };
            }
          }
        })
      ]
    }),
    defineField({
      name: "featured",
      title: "Feature this case study",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "metaTitle",
      title: "SEO Title",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "metaDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location"
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle
      };
    }
  }
});
