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
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block"
        })
      ],
      validation: (rule) => rule.required()
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
