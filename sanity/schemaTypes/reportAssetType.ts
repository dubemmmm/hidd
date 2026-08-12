import { defineArrayMember, defineField, defineType } from "sanity";

export const reportAssetType = defineType({
  name: "reportAsset",
  title: "Report Download",
  description: "Controls downloadable reports, checklists, and gated resources.",
  type: "document",
  fields: [
    defineField({
      name: "isDemo",
      title: "Demonstration Resource",
      type: "boolean",
      description: "Shows a visible demonstration notice so sample content cannot be mistaken for professional advice.",
      initialValue: false
    }),
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
      name: "category",
      title: "Resource Type",
      type: "string",
      options: {
        list: [
          { title: "Flagship Report", value: "Flagship Report" },
          { title: "Report", value: "Report" },
          { title: "Checklist", value: "Checklist" },
          { title: "Guide / PDF", value: "Guide" },
          { title: "Neighbourhood Brief", value: "Neighbourhood Brief" },
          { title: "Comparison Report", value: "Comparison Report" },
          { title: "Explainer", value: "Explainer" },
          { title: "Sample Report", value: "Sample Report" }
        ]
      },
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
      name: "description",
      title: "Detailed Description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Optional long-form description for future resource-detail layouts."
    }),
    defineField({
      name: "keyContents",
      title: "What This Resource Contains",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "intendedAudience",
      title: "Intended Audience",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "coverageAreas",
      title: "Locations / Subjects Covered",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "relatedService",
      title: "Related HIDD Service",
      type: "string",
      options: {
        list: [
          { title: "Home Inspection", value: "home-inspection" },
          { title: "Legal Due Diligence", value: "legal-due-diligence" },
          { title: "Risk Intelligence", value: "risk-intelligence" },
          { title: "Valuation", value: "valuation" },
          { title: "Comprehensive Report", value: "comprehensive-report" }
        ]
      }
    }),
    defineField({
      name: "authorName",
      title: "Author / Lead Professional",
      type: "string"
    }),
    defineField({
      name: "authorCredentials",
      title: "Author Credentials",
      type: "array",
      of: [defineArrayMember({ type: "string" })]
    }),
    defineField({
      name: "contributors",
      title: "Contributors and Reviewers",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Full Name", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "role", title: "Role", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "credentials", title: "Credentials", type: "array", of: [defineArrayMember({ type: "string" })] })
          ],
          preview: { select: { title: "name", subtitle: "role" } }
        })
      ]
    }),
    defineField({ name: "edition", title: "Edition", type: "string", description: "Example: 2026 Lagos Edition" }),
    defineField({ name: "version", title: "Version", type: "string", description: "Example: 1.0 or Revised August 2026" }),
    defineField({ name: "pageCount", title: "Page Count", type: "number", validation: (rule) => rule.integer().min(1) }),
    defineField({
      name: "fileFormat",
      title: "File Format",
      type: "string",
      options: { list: ["PDF", "DOCX", "XLSX", "ZIP", "Web resource"] }
    }),
    defineField({
      name: "coverImage",
      title: "Resource Cover / Preview Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative Text", type: "string", validation: (rule) => rule.required() })
      ]
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Coming soon", value: "coming-soon" }
        ]
      },
      initialValue: "coming-soon",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "gated",
      title: "Require Name and Email",
      type: "boolean",
      description: "PDFs and checklists always require name and email. Enable this for any other resource format that should also collect access details. Normal articles are never gated.",
      initialValue: true
    }),
    defineField({
      name: "featured",
      title: "Feature on homepage",
      type: "boolean",
      initialValue: false
    }),
    defineField({
      name: "assetFile",
      title: "Download File",
      type: "file",
      options: {
        storeOriginalFilename: true
      }
    }),
    defineField({
      name: "assetUrl",
      title: "External Download URL",
      type: "url",
      description: "Use this if the file is hosted outside Sanity."
    }),
    defineField({
      name: "sources",
      title: "Sources and References",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Source Title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "publisher", title: "Publisher / Institution", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "url", title: "Source URL", type: "url", validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }) }),
            defineField({ name: "accessedAt", title: "Date Accessed", type: "date" })
          ],
          preview: { select: { title: "title", subtitle: "publisher" } }
        })
      ]
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      status: "status"
    },
    prepare({ title, subtitle, status }) {
      return {
        title,
        subtitle: [subtitle, status === "live" ? "Live" : "Coming soon"]
          .filter(Boolean)
          .join(" · ")
      };
    }
  }
});
