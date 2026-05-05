import { defineField, defineType } from "sanity";

export const socialProofType = defineType({
  name: "socialProof",
  title: "Social Proof",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "Example: Buyer, Investor, Diaspora Buyer, or Family Office Representative.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Example: Lekki Phase 1, Lagos or London, United Kingdom.",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "initials",
      title: "Initials",
      type: "string",
      description: "Optional. Leave blank to let the site generate initials from the name."
    }),
    defineField({
      name: "activityVerb",
      title: "Activity Label",
      type: "string",
      description: "Short phrase shown before the relative time, for example: Commented or Shared feedback.",
      initialValue: "Commented",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "activityAt",
      title: "Activity Date",
      type: "datetime",
      description: "Used to generate labels such as 'Commented 2 days ago'. Leave recent dates here."
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0)
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      location: "location",
      activityVerb: "activityVerb"
    },
    prepare({ title, subtitle, location, activityVerb }) {
      return {
        title,
        subtitle: [subtitle, location, activityVerb].filter(Boolean).join(" · ")
      };
    }
  }
});
