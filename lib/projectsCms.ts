import resumeUpdate from "@/content/resume-update.json";
/**
 * Case-study / project data for /v2.
 * Reads from Sanity (project documents with inline sections/features); falls back
 * to the local code data (lib/projects.ts + lib/specCases.ts) if the CMS is
 * unreachable, so the site never breaks.
 */

import { projects as localProjects } from "@/lib/projects";
import { specCases } from "@/lib/specCases";
import { cleanDashes } from "@/lib/specText";
import { sanityFetch } from "@/lib/sanityFetch";

export const WORK_GROUPS = ["qshop", "yoke", "orpheez", "freelance", "community", "side"] as const;
export type WorkGroup = (typeof WORK_GROUPS)[number];
export type ProjectPic = { src: string; width: number; height: number } | null;

export type CmsSection = { label: string; body: string };
export type CmsFeature = { name: string; blurb: string; detail: string; kind: "feature" | "outcome" };
export type CmsProject = {
  summary?: string;
  status?: string;
  group: WorkGroup;
  hidden: boolean;
  cover: ProjectPic;
  coverAlt: string;
  slug: string;
  name: string;
  tag: string;
  roleLabel: string;
  period: string;
  tagline: string;
  category: "product" | "tool";
  stack: string[];
  link: string | null;
  order: number;
  sections: CmsSection[];
  features: CmsFeature[];
};

const FALLBACK_LABELS = ["Context", "Approach", "So what"];

type LocalUpdate = Partial<Omit<CmsProject, "group">> & { group?: string };
const updates = resumeUpdate.projects as Record<string, LocalUpdate>;

const toGroup = (v: unknown): WorkGroup | null => (WORK_GROUPS as readonly string[]).includes(v as string) ? (v as WorkGroup) : null;
/** Group from the CMS, else from content/resume-update.json, so the homepage stays grouped before the CMS is updated. */
const groupFor = (slug: string, v?: unknown): WorkGroup => toGroup(v) ?? toGroup(updates[slug]?.group) ?? "community";
const hiddenFor = (slug: string, v?: unknown): boolean => (typeof v === "boolean" ? v : updates[slug]?.hidden === true);

/** Build the unified project list from local code (the fallback / source of truth). */
function localFallback(): CmsProject[] {
  const base: CmsProject[] = localProjects.map((p, i) => {
    const sc = specCases[p.slug];
    const sections: CmsSection[] =
      sc?.sections ??
      p.crawl.map((c, j) => ({ label: FALLBACK_LABELS[j] ?? "Note", body: cleanDashes(c) }));
    return {
      group: groupFor(p.slug),
      hidden: hiddenFor(p.slug),
      cover: null,
      coverAlt: "",
      slug: p.slug,
      name: p.name,
      tag: p.tag,
      roleLabel: sc?.roleLabel ?? p.role,
      period: sc?.period ?? cleanDashes(p.period),
      tagline: sc?.tagline ?? cleanDashes(p.tagline),
      category: (sc?.category ?? "product") as "product" | "tool",
      stack: p.stack,
      link: p.link ?? null,
      order: i + 1,
      sections,
      features: p.continents.map((c) => ({
        name: c.name,
        blurb: cleanDashes(c.blurb),
        detail: cleanDashes(c.detail),
        kind: c.kind,
      })),
    };
  });
  const merged = base.map(p => ({ ...p, ...updates[p.slug], group: groupFor(p.slug) }));
  for (const [slug, update] of Object.entries(updates)) {
    if (!merged.some(p => p.slug === slug)) {
      merged.push({ slug, name: slug, tag: "", roleLabel: "", period: "", tagline: "", category: "product", stack: [], link: null, order: 99, sections: [], features: [], hidden: false, cover: null, coverAlt: "", ...update, group: groupFor(slug) });
    }
  }
  return merged.sort((a, b) => a.order - b.order);
}

type SanityPic = { url?: string; width?: number; height?: number } | null;

type SanityProject = {
  summary?: string;
  status?: string;
  group?: string;
  hidden?: boolean;
  cover?: SanityPic;
  coverAlt?: string;
  slug?: string;
  name?: string;
  tag?: string;
  roleLabel?: string;
  period?: string;
  tagline?: string;
  category?: string;
  stack?: string[] | null;
  link?: string | null;
  order?: number;
  sections?: { label?: string; body?: string }[];
  features?: { name?: string; blurb?: string; detail?: string; kind?: string }[];
};

const PROJECTS_QUERY = `*[_type == "project"] | order(order asc){
  "slug": slug.current,
  summary, status, group, hidden, coverAlt, name, tag, roleLabel, period, tagline, category, stack, link, order,
  "cover": cover{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height },
  sections[]{ label, body },
  features[]{ name, blurb, detail, kind }
}`;

/** Every project, hidden ones included (the CMS keeps them so they can be switched back on). */
async function getAllProjects(): Promise<CmsProject[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return localFallback();
  try {
    const rows = await sanityFetch<SanityProject[]>(PROJECTS_QUERY);
    if (!Array.isArray(rows) || rows.length === 0) return localFallback();
    return rows.map((r, i) => ({
      summary: r.summary,
      status: r.status,
      group: groupFor((r.slug || "").trim(), r.group),
      hidden: hiddenFor((r.slug || "").trim(), r.hidden),
      cover: r.cover?.url && r.cover.width && r.cover.height ? { src: r.cover.url, width: r.cover.width, height: r.cover.height } : null,
      coverAlt: (r.coverAlt || "").trim(),
      slug: (r.slug || "").trim(),
      name: (r.name || "").trim(),
      tag: (r.tag || "").trim(),
      roleLabel: (r.roleLabel || "").trim(),
      period: (r.period || "").trim(),
      tagline: (r.tagline || "").trim(),
      category: (r.category === "tool" ? "tool" : "product") as "product" | "tool",
      stack: Array.isArray(r.stack) ? r.stack : [],
      link: r.link || null,
      order: typeof r.order === "number" ? r.order : i + 1,
      sections: (r.sections || []).map((s) => ({ label: (s.label || "").trim(), body: (s.body || "").trim() })),
      features: (r.features || []).map((f) => ({
        name: (f.name || "").trim(),
        blurb: (f.blurb || "").trim(),
        detail: (f.detail || "").trim(),
        kind: f.kind === "outcome" ? "outcome" : "feature",
      })),
    }));
  } catch {
    return localFallback();
  }
}

/** Projects shown on the site: anything switched to "Hide from site" is left out. */
export async function getProjects(): Promise<CmsProject[]> {
  return (await getAllProjects()).filter((p) => !p.hidden);
}

export async function getProjectBySlug(slug: string): Promise<CmsProject | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

/** slugs for generateStaticParams — uses local list so build never depends on CMS */
export function allProjectSlugs(): string[] {
  return localFallback().filter((p) => !p.hidden).map((p) => p.slug);
}
