import { defineField, defineType } from "sanity";

/**
 * A downloadable AI coding skill on /skills.
 * The zip is optional: when empty, the site serves the zip bundled with it
 * (public/skills/<slug>.zip, built by scripts/build-skill-zips.mjs).
 */
export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
      description: "Also the download file name, e.g. context-saver.zip.",
    }),
    defineField({ name: "order", title: "Order", type: "number" }),
    defineField({ name: "hidden", title: "Hide from site", type: "boolean", initialValue: false }),
    defineField({ name: "line", title: "What it does (one line)", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "worksWith", title: "Works with", type: "string", description: "e.g. Any AI agent, or Claude Code" }),
    defineField({ name: "includes", title: "What's inside", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({
      name: "zip",
      title: "Download file (.zip)",
      type: "file",
      options: { accept: ".zip" },
      description: "Optional. Leave empty to keep the zip built into the site.",
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "name", subtitle: "line", hidden: "hidden" },
    prepare: ({ title, subtitle, hidden }) => ({ title: hidden ? `${title} (hidden)` : title, subtitle }),
  },
});
