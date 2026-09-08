import resumeUpdate from "@/content/resume-update.json";
/**
 * About-page timeline/changelog.
 * Reads from Sanity (experience documents); falls back to the hardcoded list if
 * the CMS is unreachable, so the site never breaks.
 */

import { sanityFetch } from "@/lib/sanityFetch";

export type Experience = { role: string; when: string; note: string };

const FALLBACK: Experience[] = resumeUpdate.experience;

type SanityExp = { role?: string; when?: string; note?: string };

const EXPERIENCE_QUERY = `*[_type == "experience"] | order(order asc){ role, when, note }`;

export async function getExperience(): Promise<Experience[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return FALLBACK;
  try {
    const rows = await sanityFetch<SanityExp[]>(EXPERIENCE_QUERY);
    if (!Array.isArray(rows) || rows.length === 0) return FALLBACK;
    return rows.map((r) => ({
      role: (r.role || "").trim(),
      when: (r.when || "").trim(),
      note: (r.note || "").trim(),
    }));
  } catch {
    return FALLBACK;
  }
}
