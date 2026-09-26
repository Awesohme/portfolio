/**
 * Brand identity case studies for /brands.
 * Reads from Sanity (brand documents); falls back to the local code data
 * (lib/brands.ts) if the CMS is unreachable, so the site never breaks.
 * Pictures uploaded in Sanity override the originals in public/brands.
 */

import { brands as localBrands, BRAND_DEFAULT_FACTS as DEFAULT_FACTS, brandHeroAlt, type Brand } from "@/lib/brands";
import { sanityFetch } from "@/lib/sanityFetch";

/** An uploaded Sanity picture, resolved to a URL + intrinsic size. */
export type BrandPic = { src: string; width: number; height: number } | null;

export type CmsBrand = Omit<Brand, "images"> & {
  order: number;
  heroAlt: string;
  facts: { design: string; credit: string; discipline: string };
  pics: { hero: BrandPic; mark: BrandPic; type: BrandPic };
  images: { key: string; caption: string; alt: string; pic: BrandPic }[];
};

/** Build the brand list from local code (the fallback / source of truth). */
export function localBrandsFallback(): CmsBrand[] {
  return localBrands.map((b, i) => ({
    ...b,
    order: i + 1,
    heroAlt: brandHeroAlt(b),
    facts: DEFAULT_FACTS,
    pics: { hero: null, mark: null, type: null },
    images: b.images.map((img) => ({ ...img, pic: null })),
  }));
}

type SanityPic = { url?: string; width?: number; height?: number } | null;
type SanityBrand = {
  slug?: string;
  name?: string;
  order?: number;
  sector?: string;
  year?: string;
  line?: string;
  headline?: string;
  heroAlt?: string;
  intro?: string;
  factDesign?: string;
  factCredit?: string;
  factDiscipline?: string;
  idea?: string;
  ideaBody?: string;
  accent?: string;
  paper?: string;
  ink?: string;
  type?: string;
  typeBody?: string;
  scope?: string[] | null;
  colours?: { name?: string; hex?: string; ink?: string }[] | null;
  images?: { key?: string; caption?: string; alt?: string; pic?: SanityPic }[] | null;
  hero?: SanityPic;
  mark?: SanityPic;
  typePic?: SanityPic;
};

const PIC = `{ "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

const BRANDS_QUERY = `*[_type == "brand"] | order(order asc){
  "slug": slug.current,
  name, order, sector, year, line, headline, heroAlt, intro,
  factDesign, factCredit, factDiscipline, idea, ideaBody,
  accent, paper, ink, type, typeBody, scope,
  colours[]{ name, hex, ink },
  images[]{ key, caption, alt, "pic": image${PIC} },
  "hero": heroImage${PIC},
  "mark": markImage${PIC},
  "typePic": typeImage${PIC}
}`;

function toPic(p: SanityPic | undefined): BrandPic {
  return p?.url && p.width && p.height ? { src: p.url, width: p.width, height: p.height } : null;
}

const str = (v: string | undefined, fb = "") => (typeof v === "string" && v.trim() ? v.trim() : fb);

export async function getBrands(): Promise<CmsBrand[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return localBrandsFallback();
  try {
    const rows = await sanityFetch<SanityBrand[]>(BRANDS_QUERY);
    if (!Array.isArray(rows) || rows.length === 0) return localBrandsFallback();
    return rows
      .filter((r) => str(r.slug) && str(r.name))
      .map((r, i) => ({
        slug: str(r.slug),
        name: str(r.name),
        order: typeof r.order === "number" ? r.order : i + 1,
        sector: str(r.sector),
        year: str(r.year) || undefined,
        line: str(r.line),
        headline: str(r.headline, str(r.name)),
        heroAlt: str(r.heroAlt, `${str(r.name)} brand identity mockup`),
        intro: str(r.intro),
        facts: {
          design: str(r.factDesign, DEFAULT_FACTS.design),
          credit: str(r.factCredit, DEFAULT_FACTS.credit),
          discipline: str(r.factDiscipline, DEFAULT_FACTS.discipline),
        },
        idea: str(r.idea),
        ideaBody: str(r.ideaBody),
        accent: str(r.accent, "#1f1d1a"),
        paper: str(r.paper, "#f3efe6"),
        ink: str(r.ink, "#1f1d1a"),
        type: str(r.type),
        typeBody: str(r.typeBody),
        scope: Array.isArray(r.scope) ? r.scope.filter(Boolean) : [],
        colours: (r.colours || [])
          .filter((c) => c?.name && c?.hex)
          .map((c) => ({ name: str(c.name), hex: str(c.hex), ink: str(c.ink, "#FFFFFF") })),
        images: (r.images || []).map((img) => ({
          key: str(img.key),
          caption: str(img.caption),
          alt: str(img.alt),
          pic: toPic(img.pic),
        })),
        pics: { hero: toPic(r.hero), mark: toPic(r.mark), type: toPic(r.typePic) },
      }));
  } catch {
    return localBrandsFallback();
  }
}

/** slugs for generateStaticParams — uses local list so build never depends on CMS */
export function allBrandSlugs(): string[] {
  return localBrands.map((b) => b.slug);
}
