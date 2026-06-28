/**
 * Musings data for /v2/musings.
 *
 * Reads from the hosted Sanity CMS (the "content kitchen"). If Sanity is
 * unreachable, we fall back to the hardcoded list below so the website NEVER
 * breaks just because the CMS is off.
 *
 * Sanity field names (musing document):
 *   title (string) · notes (text) · stage (enum) · order (number)
 *   color (optional enum: named theme colour) · colorHex (optional custom hex)
 */

import { sanityFetch } from "@/lib/sanityFetch";

export type Musing = {
  title: string;
  note: string;
  stage: string;
  /** resolved pill colour: explicit hex if any, else "" to let CSS use the stage default */
  hex: string;
  order: number;
  /** URL-friendly id derived from the title (for the dedicated post page) */
  slug: string;
  /** true when this musing is a real, readable post (stage === "published") */
  published: boolean;
  /** short trimmed preview of the note, for the list */
  preview: string;
};

/** make a URL-safe slug from a title: "On killing features" -> "on-killing-features" */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** first ~160 chars of the note, cut on a word boundary, with an ellipsis if trimmed */
function makePreview(note: string, max = 160): string {
  const clean = note.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}

// Named theme colours the editor can pick in Strapi's `color` dropdown.
// Kept here so the palette is theme-safe; the editor picks a NAME, we map to the hex.
const NAMED: Record<string, string> = {
  mint: "#cdeede",
  amber: "#fdeccd",
  grey: "#e6e2d8",
  sky: "#d4e8f5",
  violet: "#e4ddf5",
  rose: "#f5dde4",
};

// Fallback content — mirrors what was previously hardcoded in the page.
// Used only if Strapi can't be reached. (built via buildMusing below)
const FALLBACK_RAW = [
  { title: "On killing features", note: "Why saying no to twenty good ideas is the whole job, and how I decide which one survives.", stage: "drafting", order: 1 },
  { title: "Validate before you build", note: "The 48-hour WhatsApp-bot test, and why a prototype beats a PRD when the bet is uncertain.", stage: "outline", order: 2 },
  { title: "AI-native PM, in practice", note: "Shipping solo at team speed: the tools, the workflow, and where judgment still wins.", stage: "queued", order: 3 },
  { title: "Start from the problem", note: "Working backwards from the user's pain to a business, not the other way round.", stage: "queued", order: 4 },
];
const FALLBACK: Musing[] = FALLBACK_RAW.map((m) => ({
  title: m.title,
  note: m.note,
  stage: m.stage,
  hex: "",
  order: m.order,
  slug: slugify(m.title),
  published: m.stage === "published",
  preview: makePreview(m.note),
}));

type CmsMusing = {
  Title?: string;
  Notes?: string;
  stage?: string;
  order?: number;
  color?: string | null;
  colorHex?: string | null;
};

/** Decide the pill colour: custom hex wins, then named theme colour, then "" (CSS stage default). */
function resolveHex(m: CmsMusing): string {
  const custom = (m.colorHex || "").trim();
  if (custom) return custom.startsWith("#") ? custom : `#${custom}`;
  const named = (m.color || "").trim().toLowerCase();
  if (named && NAMED[named]) return NAMED[named];
  return "";
}

// Project Sanity's lowercase fields back to the Title/Notes shape the mapper expects.
const MUSINGS_QUERY = `*[_type == "musing"] | order(order asc){
  "Title": title, "Notes": notes, stage, order, color, colorHex
}`;

export async function getMusings(): Promise<Musing[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return FALLBACK;

  try {
    const rows = await sanityFetch<CmsMusing[]>(MUSINGS_QUERY);
    if (!Array.isArray(rows) || rows.length === 0) return FALLBACK;

    return rows.map((m, i) => {
      const title = (m.Title || "").trim();
      const note = (m.Notes || "").trim();
      const stage = (m.stage || "queued").trim();
      return {
        title,
        note,
        stage,
        hex: resolveHex(m),
        order: typeof m.order === "number" ? m.order : i + 1,
        slug: slugify(title),
        published: stage === "published",
        preview: makePreview(note),
      };
    });
  } catch {
    // Sanity unreachable / network error → safety net
    return FALLBACK;
  }
}

/** Fetch a single musing by its slug (for the dedicated post page). */
export async function getMusing(slug: string): Promise<Musing | null> {
  const all = await getMusings();
  return all.find((m) => m.slug === slug) ?? null;
}
