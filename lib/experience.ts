/**
 * About-page timeline/changelog.
 * Reads from Strapi (api/experiences); falls back to the hardcoded list if the
 * CMS is unreachable, so the site never breaks.
 */

export type Experience = { role: string; when: string; note: string };

const FALLBACK: Experience[] = [
  {
    role: "Product Lead · QShop Tech",
    when: "2022 to Present",
    note: "Owned product end-to-end. Cut onboarding drop-off 70% to 45%; grew a multi-product portfolio to 59,700+ businesses, $5.2M GMV, 18,000+ monthly orders. Built a milestone-based autonomy framework that lifted team velocity 30%.",
  },
  {
    role: "Lead Project Manager · Yoke Solutions",
    when: "2022 to Present",
    note: "Led a 5-person team overhauling a government agency portal (+50% UX metrics in 7 months). Directed ~$50k+/yr of B2B enterprise delivery. Learned B2B product the hard way: the people paying aren't always the people using.",
  },
  {
    role: "Design Manager · Orpheez",
    when: "2020 to Present",
    note: "6+ years across Orpheez, from design intern to Design Manager. Led design teams to channel creativity and clear impediments from their process, and as a freelance Visual Designer helped local and international clients hit their goals through research, strategy, and design thinking, across logos, websites, and brand systems.",
  },
  {
    role: "Chief Operating Officer · MyFarmbase Africa",
    when: "2019 to 2021",
    note: "Zero-to-one in a market with no playbook: scaled an EdTech platform to 9,000+ users across West Africa and launched 200+ profitable agribusinesses. Retention up 25% through engagement design.",
  },
];

type StrapiExp = { role?: string; when?: string; note?: string };

export async function getExperience(): Promise<Experience[]> {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!base) return FALLBACK;
  try {
    const res = await fetch(`${base}/api/experiences?sort=order&pagination[pageSize]=100`, {
      cache: "no-store",
    });
    if (!res.ok) return FALLBACK;
    const json = await res.json();
    const rows: StrapiExp[] = Array.isArray(json?.data) ? json.data : [];
    if (rows.length === 0) return FALLBACK;
    return rows.map((r) => ({
      role: (r.role || "").trim(),
      when: (r.when || "").trim(),
      note: (r.note || "").trim(),
    }));
  } catch {
    return FALLBACK;
  }
}
