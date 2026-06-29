import { defineField, defineType } from "sanity";

/** A feature or outcome row in the case-study table. */
export const feature = defineType({
  name: "feature",
  title: "Feature",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "blurb", title: "Blurb", type: "string" }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 3 }),
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: { list: ["feature", "outcome"], layout: "radio" },
      initialValue: "feature",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "kind" },
  },
});
