import type { StructureResolver } from "sanity/structure";

/**
 * Studio desk structure: pin Site Settings as a single editable document,
 * and list the three collection types normally.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("musing").title("Musings"),
      S.documentTypeListItem("experience").title("Experiences"),
    ]);
