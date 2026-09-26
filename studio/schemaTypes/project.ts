import { defineField, defineType } from "sanity";

/** A case-study / project (mirrors the Strapi "project" collection type). */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "hidden",
      title: "Hide from site",
      type: "boolean",
      initialValue: false,
      description: "Turn on to take this project off the site without deleting it.",
    }),
    defineField({
      name: "group",
      title: "Homepage group",
      type: "string",
      options: {
        list: [
          { title: "QShop · Product", value: "qshop" },
          { title: "Yoke Solutions · Government & business", value: "yoke" },
          { title: "Orpheez · Studio", value: "orpheez" },
          { title: "Freelance", value: "freelance" },
          { title: "Community", value: "community" },
          { title: "Side projects", value: "side" },
        ],
      },
    }),
    defineField({ name: "summary", title: "Homepage outcome summary", type: "string" }),
    defineField({ name: "status", title: "Project status", type: "string", options: { list: [{ title: "In discovery", value: "discovery" }, { title: "Active", value: "active" }, { title: "Discontinued", value: "discontinued" }] } }),
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required(), description: "Wrap words in [square brackets] to show them in grey." }),
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
    defineField({
      name: "cover",
      title: "Cover picture",
      type: "image",
      options: { hotspot: true },
      description: "Optional. Leave empty to keep the picture bundled with the site (public/work/<slug>.webp).",
    }),
    defineField({ name: "coverAlt", title: "Cover picture description", type: "string" }),
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
