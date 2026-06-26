/**
 * Musings data for /v2/musings.
 *
 * Reads from the local Strapi CMS (the "content kitchen") at NEXT_PUBLIC_STRAPI_URL.
 * If Strapi is unreachable (e.g. not running), we fall back to the hardcoded list
 * below so the website NEVER breaks just because the CMS is off.
 *
 * Strapi field names (confirmed from the live /api/musings response):
 *   Title (string) · Notes (string) · stage (enum) · order (number)
 *   color (optional enum: named theme colour) · colorHex (optional custom hex)
 */

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

type StrapiMusing = {
  Title?: string;
  Notes?: string;
  stage?: string;
  order?: number;
  color?: string | null;
  colorHex?: string | null;
};

/** Decide the pill colour: custom hex wins, then named theme colour, then "" (CSS stage default). */
function resolveHex(m: StrapiMusing): string {
  const custom = (m.colorHex || "").trim();
  if (custom) return custom.startsWith("#") ? custom : `#${custom}`;
  const named = (m.color || "").trim().toLowerCase();
  if (named && NAMED[named]) return NAMED[named];
  return "";
}

export async function getMusings(): Promise<Musing[]> {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) return FALLBACK;

  try {
    const res = await fetch(`${base}/api/musings?sort=order&pagination[pageSize]=100`, {
      // always fetch fresh so edits in Strapi appear on refresh
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK;
    const json = await res.json();
    const rows: StrapiMusing[] = Array.isArray(json?.data) ? json.data : [];
    if (rows.length === 0) return FALLBACK;

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
    // Strapi not running / network error → safety net
    return FALLBACK;
  }
}

/** Fetch a single musing by its slug (for the dedicated post page). */
export async function getMusing(slug: string): Promise<Musing | null> {
  const all = await getMusings();
  return all.find((m) => m.slug === slug) ?? null;
}
