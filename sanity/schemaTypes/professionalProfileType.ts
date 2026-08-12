import { defineArrayMember, defineField, defineType } from "sanity";

const verticals = [
  { title: "Home Inspection", value: "home-inspection" },
  { title: "Legal Due Diligence", value: "legal-due-diligence" },
  { title: "Risk Intelligence", value: "risk-intelligence" },
  { title: "Valuation", value: "valuation" }
];

export const professionalProfileType = defineType({
  name: "professionalProfile",
  title: "Lead Professional",
  type: "document",
  fields: [
    defineField({
      name: "published",
      title: "Approved for public website",
      type: "boolean",
      description: "Enable only after the identity, credentials, registration details, photo permission, and signatory role have been verified.",
      initialValue: false
    }),
    defineField({ name: "name", title: "Full Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "roleTitle", title: "Professional Title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "vertical",
      title: "Service Vertical",
      type: "string",
      options: { list: verticals, layout: "radio" },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "photo",
      title: "Professional Headshot",
      type: "image",
      options: { hotspot: true },
      description: "Use only with written permission from the professional.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "registrations",
      title: "Professional Registrations",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "body", title: "Professional Body", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "number", title: "Registration Number", type: "string", validation: (rule) => rule.required() })
          ],
          preview: { select: { title: "body", subtitle: "number" } }
        })
      ],
      validation: (rule) => rule.required().min(1)
    }),
    defineField({
      name: "yearsExperience",
      title: "Years of Experience",
      type: "number",
      validation: (rule) => rule.required().integer().min(1)
    }),
    defineField({
      name: "reportResponsibility",
      title: "Report Signatory Responsibility",
      type: "text",
      rows: 3,
      description: "State precisely which report or section this professional reviews and signs.",
      validation: (rule) => rule.required()
    }),
    defineField({ name: "bio", title: "Short Biography", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 10, validation: (rule) => rule.required().integer().min(0) })
  ],
  preview: {
    select: { title: "name", subtitle: "roleTitle", media: "photo", published: "published" },
    prepare({ title, subtitle, media, published }) {
      return { title, subtitle: `${published ? "Published" : "Not approved"} · ${subtitle ?? ""}`, media };
    }
  }
});
