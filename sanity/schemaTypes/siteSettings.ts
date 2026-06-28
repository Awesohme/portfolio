import { defineField, defineType } from "sanity";

/**
 * Site-wide settings (mirrors the Strapi "site-setting" single type).
 * Enforced as a singleton: one document with a fixed _id of "siteSettings".
 * richtext fields (aboutOrigin, aboutOperatingInstinct) are kept as plain
 * markdown text so the app's react-markdown rendering keeps working.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "copy", title: "Copy", default: true },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact & socials" },
    { name: "media", title: "Media" },
    { name: "toggles", title: "Section toggles" },
  ],
  fields: [
    // Home copy
    defineField({ name: "heroThesis", title: "Hero thesis", type: "text", rows: 4, group: "copy" }),
    defineField({ name: "problemLead", title: "Problem lead", type: "string", group: "copy" }),
    defineField({ name: "problemBody", title: "Problem body", type: "text", rows: 3, group: "copy" }),
    defineField({ name: "betLead", title: "Bet lead", type: "string", group: "copy" }),
    defineField({ name: "betBody", title: "Bet body", type: "text", rows: 4, group: "copy" }),
    defineField({ name: "outcomeLead", title: "Outcome lead", type: "string", group: "copy" }),
    defineField({ name: "signoffText", title: "Signoff text", type: "text", rows: 3, group: "copy" }),

    // About copy
    defineField({ name: "aboutHero", title: "About hero", type: "string", group: "about" }),
    defineField({ name: "aboutOrigin", title: "About origin", type: "text", rows: 5, group: "about" }),
    defineField({
      name: "aboutOperatingInstinct",
      title: "About operating instinct",
      type: "text",
      rows: 8,
      group: "about",
    }),

    // Contact & socials
    defineField({ name: "fullName", title: "Full name", type: "string", group: "contact" }),
    defineField({ name: "jobTitle", title: "Job title", type: "string", group: "contact" }),
    defineField({ name: "email", title: "Email", type: "string", group: "contact" }),
    defineField({ name: "whatsapp", title: "WhatsApp", type: "string", group: "contact" }),
    defineField({ name: "githubUrl", title: "GitHub URL", type: "url", group: "contact" }),
    defineField({ name: "linkedinUrl", title: "LinkedIn URL", type: "url", group: "contact" }),
    defineField({ name: "contactMessage", title: "Contact message", type: "text", rows: 3, group: "contact" }),

    // Media
    defineField({
      name: "resume",
      title: "Resume (PDF)",
      type: "file",
      options: { accept: ".pdf" },
      group: "media",
    }),
    defineField({
      name: "profileImage",
      title: "Profile image",
      type: "image",
      options: { hotspot: true },
      group: "media",
    }),

    // Section toggles
    defineField({ name: "showProfileImage", title: "Show profile image", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showResume", title: "Show resume", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showProblem", title: "Show problem", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showBet", title: "Show bet", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showOutcome", title: "Show outcome", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showShipped", title: "Show shipped", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showAlsoBuilt", title: "Show also built", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showTimeline", title: "Show timeline", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showMusingsNav", title: "Show musings nav", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showSocials", title: "Show socials", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showContact", title: "Show contact", type: "boolean", initialValue: true, group: "toggles" }),
    defineField({ name: "showSignoff", title: "Show signoff", type: "boolean", initialValue: true, group: "toggles" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
