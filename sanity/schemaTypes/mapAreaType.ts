import { defineArrayMember, defineField, defineType } from "sanity";

export const mapAreaType = defineType({
  name: "mapArea",
  title: "Risk Map District",
  description: "Controls risk-map polygons, map popups, and district brief pages.",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Area Name",
      type: "string",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "label",
      title: "Map Label",
      type: "string",
      description: "Optional shorter label shown on the map. Leave blank to use the area name."
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0)
    }),
    defineField({
      name: "riskGrade",
      title: "Risk Level",
      type: "string",
      options: {
        list: [
          { title: "Low risk", value: "low" },
          { title: "Mid risk", value: "medium" },
          { title: "High risk", value: "high" }
        ]
      },
      initialValue: "low",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "framingNote",
      title: "Framing Note",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "briefBody",
      title: "District Brief Body",
      type: "array",
      description:
        "Optional longer content for the district brief page. Supports headings, paragraphs, lists, quotes, and links.",
      of: [
        defineArrayMember({
          type: "block"
        })
      ]
    }),
    defineField({
      name: "assessmentDate",
      title: "Assessment Date",
      type: "date",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "analyst",
      title: "Analyst",
      type: "string",
      initialValue: "HIDD Advisory",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "redFlag",
      title: "Red Flag",
      type: "string",
      initialValue: "None",
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "polygonCoordinates",
      title: "Polygon Coordinates",
      type: "array",
      description:
        "Enter the map polygon points in drawing order. Each point needs a longitude and latitude.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "lng",
              title: "Longitude",
              type: "number",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "lat",
              title: "Latitude",
              type: "number",
              validation: (rule) => rule.required()
            })
          ],
          preview: {
            select: {
              lng: "lng",
              lat: "lat"
            },
            prepare({ lng, lat }) {
              return {
                title: `${lng ?? "?"}, ${lat ?? "?"}`
              };
            }
          }
        })
      ],
      validation: (rule) => rule.required().min(3)
    }),
    defineField({
      name: "layerScores",
      title: "Layer Scores",
      type: "object",
      fields: [
        defineField({
          name: "flooding",
          title: "Flooding",
          type: "number",
          validation: (rule) => rule.required().min(0).max(100)
        }),
        defineField({
          name: "titleComplexity",
          title: "Title Complexity",
          type: "number",
          validation: (rule) => rule.required().min(0).max(100)
        }),
        defineField({
          name: "planningZoning",
          title: "Planning & Zoning",
          type: "number",
          validation: (rule) => rule.required().min(0).max(100)
        }),
        defineField({
          name: "infrastructure",
          title: "Infrastructure",
          type: "number",
          validation: (rule) => rule.required().min(0).max(100)
        }),
        defineField({
          name: "security",
          title: "Security",
          type: "number",
          validation: (rule) => rule.required().min(0).max(100)
        }),
        defineField({
          name: "environmental",
          title: "Environmental",
          type: "number",
          validation: (rule) => rule.required().min(0).max(100)
        }),
        defineField({
          name: "marketLiquidity",
          title: "Market Liquidity",
          type: "number",
          validation: (rule) => rule.required().min(0).max(100)
        })
      ],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: "assessmentCategories",
      title: "Assessment Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Category Title",
              type: "string",
              validation: (rule) => rule.required()
            }),
            defineField({
              name: "indicators",
              title: "Indicators",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "code",
                      title: "Code",
                      type: "string",
                      validation: (rule) => rule.required()
                    }),
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (rule) => rule.required()
                    }),
                    defineField({
                      name: "note",
                      title: "Note",
                      type: "text",
                      rows: 3,
                      validation: (rule) => rule.required()
                    })
                  ],
                  preview: {
                    select: {
                      title: "label",
                      subtitle: "code"
                    }
                  }
                })
              ],
              validation: (rule) => rule.required().min(1)
            })
          ],
          preview: {
            select: {
              title: "title"
            }
          }
        })
      ],
      validation: (rule) => rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "riskGrade"
    },
    prepare({ title, subtitle }) {
      const riskLabel =
        subtitle === "medium"
          ? "Mid risk"
          : subtitle === "high"
            ? "High risk"
            : "Low risk";

      return {
        title,
        subtitle: riskLabel
      };
    }
  }
});
