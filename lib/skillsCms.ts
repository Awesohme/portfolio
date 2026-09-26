/**
 * Downloadable skills for /skills.
 * Reads from Sanity (skill documents); falls back to the local code data
 * (lib/skills.ts) if the CMS is unreachable or empty, so the page never breaks.
 * A zip uploaded in Sanity overrides the one bundled in public/skills.
 */

import { skills as localSkills, ALL_SKILLS_SLUG, type Skill } from "@/lib/skills";
import { sanityFetch } from "@/lib/sanityFetch";

export type CmsSkill = Skill & { order: number; zipUrl: string };

/** The zip bundled with the site for a slug (also used for "download all"). */
export const bundledZip = (slug: string) => `/skills/${slug}.zip`;

export function localSkillsFallback(): CmsSkill[] {
  return localSkills.map((s, i) => ({ ...s, order: i + 1, zipUrl: bundledZip(s.slug) }));
}

type SanitySkill = {
  slug?: string;
  name?: string;
  order?: number;
  hidden?: boolean;
  line?: string;
  worksWith?: string;
  includes?: string[] | null;
  zipUrl?: string | null;
};

const SKILLS_QUERY = `*[_type == "skill"] | order(order asc){
  "slug": slug.current, name, order, hidden, line, worksWith, includes,
  "zipUrl": zip.asset->url
}`;

const str = (v: string | undefined | null, fb = "") => (typeof v === "string" && v.trim() ? v.trim() : fb);

export async function getSkills(): Promise<CmsSkill[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return localSkillsFallback();
  try {
    const rows = await sanityFetch<SanitySkill[]>(SKILLS_QUERY);
    if (!Array.isArray(rows) || rows.length === 0) return localSkillsFallback();
    const local = new Map(localSkills.map((s) => [s.slug, s]));
    return rows
      .filter((r) => !r.hidden && str(r.slug) && str(r.name))
      .map((r, i) => {
        const slug = str(r.slug);
        const fb = local.get(slug);
        return {
          slug,
          name: str(r.name),
          order: typeof r.order === "number" ? r.order : i + 1,
          line: str(r.line, fb?.line),
          worksWith: str(r.worksWith, fb?.worksWith),
          includes: Array.isArray(r.includes) && r.includes.length ? r.includes.filter(Boolean) : fb?.includes ?? [],
          // ?dl= makes Sanity send it as a download (the download attribute is ignored cross-origin)
          zipUrl: str(r.zipUrl) ? `${str(r.zipUrl)}?dl=${encodeURIComponent(`${slug}.zip`)}` : bundledZip(slug),
        };
      });
  } catch {
    return localSkillsFallback();
  }
}

/** Where a download should go: the skill's zip, or the bundled all-in-one zip. */
export async function skillZipUrl(slug: string): Promise<{ name: string; url: string } | null> {
  if (slug === ALL_SKILLS_SLUG) return { name: "All skills", url: bundledZip(ALL_SKILLS_SLUG) };
  const skill = (await getSkills()).find((s) => s.slug === slug);
  return skill ? { name: skill.name, url: skill.zipUrl } : null;
}
