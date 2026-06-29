import { defineField, defineType } from "sanity";

/** A timeline / changelog entry on the About page (mirrors Strapi "experience"). */
export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "role", title: "Role", type: "string", validation: (r) => r.required() }),
    defineField({ name: "when", title: "When", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 4,
      description: "Markdown supported.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "role", subtitle: "when" },
  },
});
