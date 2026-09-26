/**
 * Seed Sanity with the skills in lib/skills.ts (one "skill" document each, created
 * only if missing) and the Skills page wording from content/site-copy.json on the
 * siteSettings singleton (setIfMissing, so anything already edited in Studio is left alone).
 *
 * Safe to re-run. Backs up the current docs to the OS temp dir first.
 * Run:  cd studio && npx sanity exec seed-skills.ts --with-user-token
 */
import { createClient } from "@sanity/client";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { skills } from "../lib/skills.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
const copy = JSON.parse(readFileSync(join(root, "content/site-copy.json"), "utf8"));
const skillsCopy = Object.fromEntries(Object.entries(copy).filter(([k]) => k.startsWith("skills")));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const existing = await client.fetch('*[_type in ["skill", "siteSettings"]]', {}, { perspective: "raw" });
const backupDir = join(tmpdir(), "portfolio-content-backups");
mkdirSync(backupDir, { recursive: true });
const backup = join(backupDir, `seed-skills-${Date.now()}.json`);
writeFileSync(backup, JSON.stringify(existing, null, 2));
console.log("backup:", backup);

const tx = client.transaction();
skills.forEach((s, i) => {
  tx.createIfNotExists({
    _id: `skill-${s.slug}`,
    _type: "skill",
    name: s.name,
    slug: { _type: "slug", current: s.slug },
    order: i + 1,
    hidden: false,
    line: s.line,
    worksWith: s.worksWith,
    includes: s.includes,
  });
});
tx.createIfNotExists({ _id: "siteSettings", _type: "siteSettings" });
tx.patch("siteSettings", (p) => p.setIfMissing(skillsCopy));

const res = await tx.commit();
console.log(`committed ${res.results.length} mutations`);
const after = await client.fetch(`{ "skills": count(*[_type == "skill"]), "copy": *[_id == "siteSettings"][0]{ ${Object.keys(skillsCopy).join(", ")} } }`);
const missing = Object.keys(skillsCopy).filter((k) => after.copy?.[k] == null);
console.log(`skills in Sanity: ${after.skills}; skills copy fields missing: ${missing.length ? missing.join(", ") : "none"}`);
