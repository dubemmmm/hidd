import { defineField, defineType } from "sanity";

export const authorityMetricType = defineType({
  name: "authorityMetric",
  title: "Authority Metric",
  description: "Verified engagement and outcome figures used in the homepage Decision Room.",
  type: "document",
  groups: [
    { name: "figure", title: "Figure", default: true },
    { name: "evidence", title: "Evidence and verification" },
    { name: "publishing", title: "Publishing" }
  ],
  fields: [
    defineField({
      name: "metricName",
      title: "Metric Name",
      type: "string",
      group: "figure",
      description: "Customer-facing label, for example: Transaction value reviewed.",
      validation: (rule) => rule.required().max(72)
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "figure",
      description: "Short context label, for example: Engagement scale or Buyer outcomes.",
      validation: (rule) => rule.required().max(40)
    }),
    defineField({
      name: "value",
      title: "Numeric Value",
      type: "number",
      group: "figure",
      description: "Enter the number only. Use Prefix and Suffix for currency and units.",
      validation: (rule) => rule.required().min(0)
    }),
    defineField({
      name: "prefix",
      title: "Prefix",
      type: "string",
      group: "figure",
      description: "Optional. Example: ₦, $, £, or €.",
      validation: (rule) => rule.max(8)
    }),
    defineField({
      name: "suffix",
      title: "Suffix",
      type: "string",
      group: "figure",
      description: "Optional. Example: m, bn, or +.",
      validation: (rule) => rule.max(8)
    }),
    defineField({
      name: "decimalPlaces",
      title: "Decimal Places",
      type: "number",
      group: "figure",
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0).max(2)
    }),
    defineField({
      name: "shortDescription",
      title: "What This Figure Means",
      type: "text",
      rows: 3,
      group: "evidence",
      description: "Plain-language explanation shown when a visitor selects the metric.",
      validation: (rule) => rule.required().max(280)
    }),
    defineField({
      name: "calculationMethodology",
      title: "Calculation Methodology",
      type: "text",
      rows: 4,
      group: "evidence",
      description: "Define what is included, excluded, and how the total was calculated.",
      validation: (rule) => rule.required().max(600)
    }),
    defineField({
      name: "verifiedThrough",
      title: "Verified Through",
      type: "date",
      group: "evidence",
      description: "Latest date included in the calculation. Required before the metric can be published."
    }),
    defineField({
      name: "verificationStatus",
      title: "Verification Status",
      type: "string",
      group: "publishing",
      initialValue: "illustrative",
      options: {
        list: [
          { title: "Illustrative — not for the public website", value: "illustrative" },
          { title: "Verified against internal records", value: "verified" }
        ],
        layout: "radio"
      },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "publishOnHomepage",
      title: "Publish on Homepage",
      type: "boolean",
      group: "publishing",
      initialValue: false,
      description: "Enable only after the figure, methodology, and verification date have been checked.",
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!value) return true;
          const document = context.document;
          if (document?.verificationStatus !== "verified") {
            return "Mark this metric as verified before enabling it on the homepage.";
          }
          if (!document?.verifiedThrough) {
            return "Add a Verified Through date before enabling this metric on the homepage.";
          }
          return true;
        })
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      group: "publishing",
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0)
    })
  ],
  orderings: [
    {
      title: "Homepage order",
      name: "homepageOrder",
      by: [{ field: "displayOrder", direction: "asc" }]
    }
  ],
  preview: {
    select: {
      title: "metricName",
      value: "value",
      prefix: "prefix",
      suffix: "suffix",
      status: "verificationStatus",
      published: "publishOnHomepage"
    },
    prepare({ title, value, prefix, suffix, status, published }) {
      const figure = `${prefix || ""}${value ?? "—"}${suffix || ""}`;
      const state = status === "verified" ? (published ? "Verified · Homepage" : "Verified · Hidden") : "Illustrative draft";
      return { title, subtitle: `${figure} · ${state}` };
    }
  }
});
