import { defineField, defineType } from "sanity";

export const resourceAccessType = defineType({
  name: "resourceAccess",
  title: "Resource Download Lead",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "email", title: "Email", type: "string", validation: (rule) => rule.required().email() }),
    defineField({ name: "assetSlug", title: "Resource Slug", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "assetTitle", title: "Resource", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "requestType",
      title: "Request Type",
      type: "string",
      options: {
        list: [
          { title: "Download", value: "download" },
          { title: "Release waitlist", value: "waitlist" }
        ]
      },
      validation: (rule) => rule.required()
    }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime", validation: (rule) => rule.required() }),
    defineField({
      name: "privacyNoticeVersion",
      title: "Privacy Notice Version",
      type: "string",
      description: "Records the privacy wording shown when the visitor submitted the form."
    })
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }]
    }
  ],
  preview: {
    select: { title: "email", name: "name", resource: "assetTitle", submittedAt: "submittedAt" },
    prepare({ title, name, resource, submittedAt }) {
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString("en-GB") : "";
      return { title: `${name || "Resource lead"} · ${title || ""}`, subtitle: [resource, date].filter(Boolean).join(" · ") };
    }
  }
});
