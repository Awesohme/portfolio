import { defineField, defineType } from "sanity";

/**
 * A brand identity case study (/brands and /brands/<slug>).
 * Pictures are optional uploads: when empty, the site keeps using the original
 * picture bundled with the site (public/brands/<slug>/<key>.webp).
 */
const hex = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "string",
    group: "look",
    validation: (r) => r.regex(/^#[0-9A-Fa-f]{6}$/, { name: "hex colour" }).error("Use a hex colour like #3257D6"),
  });

const picture = (name: string, title: string, group: string) =>
  defineField({
    name,
    title,
    type: "image",
    group,
    options: { hotspot: true },
    description: "Optional. Leave empty to keep the original picture.",
  });

export const brand = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "story", title: "Story" },
    { name: "look", title: "Colours & type" },
    { name: "gallery", title: "Pictures" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "basics", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "basics",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Order", type: "number", group: "basics" }),
    defineField({ name: "sector", title: "Sector", type: "string", group: "basics" }),
    defineField({ name: "year", title: "Year", type: "string", group: "basics" }),
    defineField({ name: "line", title: "One-line summary", type: "string", group: "basics" }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "text",
      rows: 2,
      group: "basics",
      description: "Use a new line for the second line (shown in italics).",
    }),
    picture("heroImage", "Cover picture", "basics"),
    defineField({ name: "heroAlt", title: "Cover picture description (gallery)", type: "string", group: "basics" }),

    defineField({ name: "intro", title: "Context", type: "text", rows: 4, group: "story" }),
    defineField({ name: "factDesign", title: "Design credit", type: "string", group: "story" }),
    defineField({ name: "factCredit", title: "Studio credit", type: "string", group: "story" }),
    defineField({ name: "factDiscipline", title: "Discipline", type: "string", group: "story" }),
    defineField({ name: "idea", title: "Central idea heading", type: "string", group: "story" }),
    defineField({ name: "ideaBody", title: "Central idea text", type: "text", rows: 4, group: "story" }),
    picture("markImage", "Brand mark picture", "story"),
    defineField({
      name: "scope",
      title: "What was delivered",
      type: "array",
      of: [{ type: "string" }],
      group: "story",
    }),

    hex("accent", "Accent colour"),
    hex("paper", "Background colour"),
    hex("ink", "Text colour"),
    defineField({ name: "type", title: "Visual language heading", type: "string", group: "look" }),
    defineField({ name: "typeBody", title: "Visual language text", type: "text", rows: 4, group: "look" }),
    picture("typeImage", "Typography picture", "look"),
    defineField({
      name: "colours",
      title: "Palette",
      type: "array",
      group: "look",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "hex", title: "Colour (hex)", type: "string", validation: (r) => r.required() }),
            defineField({ name: "ink", title: "Text colour on it (hex)", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "hex" } },
        },
      ],
    }),

    defineField({
      name: "images",
      title: "In the world (application pictures)",
      type: "array",
      group: "gallery",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({ name: "alt", title: "Picture description", type: "string" }),
            defineField({
              name: "image",
              title: "Picture",
              type: "image",
              options: { hotspot: true },
              description: "Optional for existing entries. Leave empty to keep the original picture.",
            }),
            defineField({
              name: "key",
              title: "Original picture id",
              type: "string",
              readOnly: true,
              hidden: ({ value }) => !value,
            }),
          ],
          preview: { select: { title: "caption", subtitle: "key", media: "image" } },
        },
      ],
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "sector", media: "heroImage" } },
});
