import { defineField, defineType } from "sanity";

/** A narrative section of a case study (Problem, Approach, Outcome...). */
export const section = defineType({
  name: "section",
  title: "Section",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "label", subtitle: "body" },
  },
});
