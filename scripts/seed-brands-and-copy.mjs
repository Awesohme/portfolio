/**
 * Seed Sanity with the content that used to live only in code:
 *   - one "brand" document per brand in lib/brands.ts (created only if missing)
 *   - the page wording in content/site-copy.json on the siteSettings singleton
 *     (setIfMissing, so anything already edited in Studio is left alone)
 *
 * Safe to re-run. Backs up the current docs to the OS temp dir first.
 * Run:  node scripts/seed-brands-and-copy.mjs   (Node 23.6+, reads .env.local)
 */
import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { brands, brandHeroAlt, BRAND_DEFAULT_FACTS } from "../lib/brands.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const copy = JSON.parse(readFileSync(join(root, "content/site-copy.json"), "utf8"));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const existing = await client.fetch('*[_type in ["brand", "siteSettings"]]', {}, { perspective: "raw" });
const backupDir = join(tmpdir(), "portfolio-content-backups");
mkdirSync(backupDir, { recursive: true });
const backup = join(backupDir, `seed-brands-${Date.now()}.json`);
writeFileSync(backup, JSON.stringify(existing, null, 2));
console.log("backup:", backup);

const key = (s, i) => `${s.replace(/[^a-z0-9]/gi, "").slice(0, 12)}${i}`;
const tx = client.transaction();

brands.forEach((b, i) => {
  tx.createIfNotExists({
    _id: `brand-${b.slug}`,
    _type: "brand",
    name: b.name,
    slug: { _type: "slug", current: b.slug },
    order: i + 1,
    sector: b.sector,
    ...(b.year ? { year: b.year } : {}),
    line: b.line,
    headline: b.headline,
    heroAlt: brandHeroAlt(b),
    intro: b.intro,
    factDesign: BRAND_DEFAULT_FACTS.design,
    factCredit: BRAND_DEFAULT_FACTS.credit,
    factDiscipline: BRAND_DEFAULT_FACTS.discipline,
    idea: b.idea,
    ideaBody: b.ideaBody,
    accent: b.accent,
    paper: b.paper,
    ink: b.ink,
    type: b.type,
    typeBody: b.typeBody,
    scope: b.scope,
    colours: b.colours.map((c, j) => ({ _key: key(c.name, j), ...c })),
    images: b.images.map((img, j) => ({ _key: key(img.key, j), key: img.key, caption: img.caption, alt: img.alt })),
  });
});

tx.createIfNotExists({ _id: "siteSettings", _type: "siteSettings" });
tx.patch("siteSettings", (p) => p.setIfMissing(copy));

const res = await tx.commit();
console.log(`committed ${res.results.length} mutations`);
const after = await client.fetch(`{ "brands": count(*[_type == "brand"]), "copyKeys": *[_id == "siteSettings"][0]{ ${Object.keys(copy).join(", ")} } }`);
const missing = Object.keys(copy).filter((k) => after.copyKeys?.[k] == null);
console.log(`brands in Sanity: ${after.brands}; site copy fields missing: ${missing.length ? missing.join(", ") : "none"}`);
