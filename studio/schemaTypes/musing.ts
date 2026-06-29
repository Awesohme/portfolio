import { defineField, defineType } from "sanity";

/**
 * A "musing" — short note / essay (mirrors the Strapi "musing" collection type).
 * `notes` is kept as plain markdown text (not Portable Text) so the existing
 * react-markdown rendering in the app keeps working unchanged.
 */
export const musing = defineType({
  name: "musing",
  title: "Musing",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 12,
      description: "Markdown supported.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "stage",
      title: "Stage",
      type: "string",
      options: { list: ["drafting", "outline", "queued", "published"], layout: "radio" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "color",
      title: "Pill colour",
      type: "string",
      options: { list: ["mint", "amber", "grey", "sky", "violet", "rose"] },
    }),
    defineField({ name: "colorHex", title: "Custom hex", type: "string" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "stage" },
  },
});
