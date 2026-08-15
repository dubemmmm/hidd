import { defineField, defineType } from "sanity";

export const narrationType = defineType({
  name: "narration",
  title: "Generated Narration",
  type: "object",
  fields: [
    defineField({
      name: "audio",
      title: "Saved Audio",
      type: "file",
      options: { accept: "audio/wav,audio/mpeg,audio/mp4,audio/aac,audio/ogg" },
      readOnly: true
    }),
    defineField({
      name: "durationSeconds",
      title: "Duration in Seconds",
      type: "number",
      readOnly: true
    }),
    defineField({
      name: "voice",
      title: "Generated Voice",
      type: "string",
      readOnly: true
    }),
    defineField({
      name: "model",
      title: "Generation Model",
      type: "string",
      readOnly: true
    }),
    defineField({
      name: "generatedAt",
      title: "Generated At",
      type: "datetime",
      readOnly: true
    }),
    defineField({
      name: "sourceHash",
      title: "Content Version",
      type: "string",
      description: "Used to detect when the written content has changed after narration was generated.",
      readOnly: true
    }),
    defineField({
      name: "aiGenerated",
      title: "AI-generated Audio",
      type: "boolean",
      readOnly: true
    })
  ],
  preview: {
    select: {
      generatedAt: "generatedAt",
      durationSeconds: "durationSeconds",
      voice: "voice"
    },
    prepare({ generatedAt, durationSeconds, voice }) {
      const duration = Number.isFinite(durationSeconds)
        ? `${Math.max(1, Math.round(durationSeconds / 60))} min`
        : "duration pending";
      return {
        title: "Saved audio narration",
        subtitle: generatedAt
          ? `${voice || "Voice"} · ${duration} · ${new Date(generatedAt).toLocaleDateString()}`
          : "Audio has not been generated yet"
      };
    }
  }
});
