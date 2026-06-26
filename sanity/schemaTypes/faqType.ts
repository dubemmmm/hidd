import { defineField, defineType } from "sanity";

const faqCategories = [
  "About HIDD",
  "Our Services",
  "Process",
  "Pricing & Payment",
  "Technical Questions",
  "Legal & Liability",
  "Contact & Booking"
];

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug / ID",
      type: "slug",
      description:
        "Stable identifier used to link services to this FAQ. Leave the seeded value unchanged.",
      options: { source: "question", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: faqCategories.map((value) => ({ title: value, value }))
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "answer",
      title: "Answer (public)",
      type: "text",
      rows: 4,
      description: "Public-facing answer. This is the only answer text shown to visitors.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "internalNote",
      title: "Internal note (private)",
      type: "text",
      rows: 3,
      description:
        "Internal-only service notes (status, operational caveats, team reminders). NEVER shown on the public site — for the HIDD team only."
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first within the FAQ list."
    })
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrderAsc",
      by: [{ field: "displayOrder", direction: "asc" }]
    }
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "category",
      internalNote: "internalNote"
    },
    prepare({ title, subtitle, internalNote }) {
      return {
        title,
        subtitle: [subtitle, internalNote ? "• has internal note" : null]
          .filter(Boolean)
          .join(" ")
      };
    }
  }
});
