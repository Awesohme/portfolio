import { defineField, defineType } from "sanity";

/** A case-study / project (mirrors the Strapi "project" collection type). */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "tag", title: "Tag", type: "string" }),
    defineField({ name: "roleLabel", title: "Role label", type: "string" }),
    defineField({ name: "period", title: "Period", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "text", rows: 2 }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: ["product", "tool"], layout: "radio" },
      initialValue: "product",
    }),
    defineField({
      name: "stack",
      title: "Stack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "link", title: "Link", type: "url" }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "section" }],
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "feature" }],
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "tag" },
  },
});
