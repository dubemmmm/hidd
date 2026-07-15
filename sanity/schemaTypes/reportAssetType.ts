import { defineField, defineType } from "sanity";

export const reportAssetType = defineType({
  name: "reportAsset",
  title: "Report Download",
  description: "Controls downloadable reports, checklists, and gated resources.",
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
      name: "category",
      title: "Category",
      type: "string",
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
      title: "Gated",
      type: "boolean",
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
