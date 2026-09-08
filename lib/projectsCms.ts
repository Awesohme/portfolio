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

export type CmsSection = { label: string; body: string };
export type CmsFeature = { name: string; blurb: string; detail: string; kind: "feature" | "outcome" };
export type CmsProject = {
  summary?: string;
  status?: string;
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

/** Build the unified project list from local code (the fallback / source of truth). */
function localFallback(): CmsProject[] {
  const base: CmsProject[] = localProjects.map((p, i) => {
    const sc = specCases[p.slug];
    const sections: CmsSection[] =
      sc?.sections ??
      p.crawl.map((c, j) => ({ label: FALLBACK_LABELS[j] ?? "Note", body: cleanDashes(c) }));
    return {
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
  const updates = resumeUpdate.projects as Record<string, Partial<CmsProject>>;
  const merged = base.map(p => ({ ...p, ...updates[p.slug] }));
  for (const [slug, update] of Object.entries(updates)) {
    if (!merged.some(p => p.slug === slug)) {
      merged.push({ slug, name: slug, tag: "", roleLabel: "", period: "", tagline: "", category: "product", stack: [], link: null, order: 99, sections: [], features: [], ...update });
    }
  }
  return merged.sort((a, b) => a.order - b.order);
}

type SanityProject = {
  summary?: string;
  status?: string;
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
  summary, status, name, tag, roleLabel, period, tagline, category, stack, link, order,
  sections[]{ label, body },
  features[]{ name, blurb, detail, kind }
}`;

export async function getProjects(): Promise<CmsProject[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return localFallback();
  try {
    const rows = await sanityFetch<SanityProject[]>(PROJECTS_QUERY);
    if (!Array.isArray(rows) || rows.length === 0) return localFallback();
    return rows.map((r, i) => ({
      summary: r.summary,
      status: r.status,
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

export async function getProjectBySlug(slug: string): Promise<CmsProject | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

/** slugs for generateStaticParams — uses local list so build never depends on CMS */
export function allProjectSlugs(): string[] {
  return localFallback().map((p) => p.slug);
}
