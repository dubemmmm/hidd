import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Insight Article",
  description: "Controls articles shown on /insights and /insights/[slug].",
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "HIDD Advisory",
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
      description: "Explicit read time label shown on the Insights index and article page.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block"
        }),
        defineArrayMember({
          name: "articleImage",
          title: "Article Image",
          type: "image",
          options: {
            hotspot: true
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative Text",
              type: "string",
              description:
                "Briefly describe what the image shows for readers using screen readers.",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "text",
              rows: 2,
              description: "Optional context displayed directly below the image."
            }),
            defineField({
              name: "credit",
              title: "Image Credit",
              type: "string",
              description: "Optional photographer, organisation, or source credit."
            })
          ]
        }),
        defineArrayMember({
          name: "articleTable",
          title: "Article Table",
          type: "object",
          fields: [
            defineField({
              name: "caption",
              title: "Table Caption",
              type: "string",
              description: "Optional short title displayed above the table."
            }),
            defineField({
              name: "headers",
              title: "Column Headings",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) =>
                rule.required().min(2).error("Add at least two column headings.")
            }),
            defineField({
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                defineArrayMember({
                  name: "tableRow",
                  title: "Row",
                  type: "object",
                  fields: [
                    defineField({
                      name: "cells",
                      title: "Cells",
                      type: "array",
                      of: [defineArrayMember({ type: "string" })],
                      validation: (rule) => rule.required().min(1)
                    })
                  ],
                  preview: {
                    select: { cells: "cells" },
                    prepare({ cells }: { cells?: string[] }) {
                      return {
                        title: cells?.filter(Boolean).join(" | ") || "Empty row"
                      };
                    }
                  }
                })
              ],
              validation: (rule) => rule.required().min(1).error("Add at least one row.")
            })
          ],
          preview: {
            select: { caption: "caption", headers: "headers" },
            prepare({ caption, headers }: { caption?: string; headers?: string[] }) {
              return {
                title: caption || "Article table",
                subtitle: headers?.join(" | ")
              };
            }
          }
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image URL",
      type: "url"
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
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image URL",
      type: "url"
    }),
    defineField({
      name: "relatedService",
      title: "Related Service CTA",
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
    })
  ]
});
