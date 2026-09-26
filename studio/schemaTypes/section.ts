import { defineField, defineType } from "sanity";

/** A narrative section of a case study (Problem, Approach, Outcome...). */
export const section = defineType({
  name: "section",
  title: "Section",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Body", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({ name: "linkLabel", title: "Link text (optional)", type: "string", description: "Shown as a link under this section, e.g. Download my skills." }),
    defineField({
      name: "linkHref",
      title: "Link address (optional)",
      type: "url",
      description: "A full web address, or a page on this site such as /skills.",
      validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "body" },
  },
});
