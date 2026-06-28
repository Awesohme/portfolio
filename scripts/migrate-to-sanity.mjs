/**
 * One-time migration: Strapi → Sanity.
 *
 * Reads the JSON exported from the running Strapi (in the scratchpad) and the
 * media binaries from Strapi's /uploads, then creates the equivalent Sanity
 * documents (projects, musings, experiences, and the siteSettings singleton).
 *
 * Idempotent: deletes previously-migrated docs first, so it can be re-run.
 *
 * Run:  node scripts/migrate-to-sanity.mjs
 * Needs: SANITY_API_WRITE_TOKEN + NEXT_PUBLIC_SANITY_* in .env.local,
 *        and the Strapi server running at STRAPI_URL for media uploads.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// --- load .env.local ---------------------------------------------------------
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const DATA_DIR =
  process.env.STRAPI_EXPORT_DIR ||
  "/private/tmp/claude-501/-Users-olamide-Desktop-Vibe-Coding/55ff56d8-b22d-42d9-b6a0-5f71f0cf9c8c/scratchpad";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const load = (name) =>
  JSON.parse(readFileSync(join(DATA_DIR, `strapi-${name}.json`), "utf8")).data;

const trim = (v) => (typeof v === "string" ? v.trim() : "");

/** Upload a Strapi /uploads file to Sanity as an asset; returns the asset doc. */
async function uploadFromStrapi(kind, url, filename) {
  const res = await fetch(`${STRAPI_URL}${url}`);
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return client.assets.upload(kind, buf, { filename });
}

async function clearExisting() {
  const types = ["project", "musing", "experience"];
  await client.delete({ query: `*[_type in $types]`, params: { types } });
  // Singleton: delete by id (draft + published) so re-runs are clean.
  await client.delete("siteSettings").catch(() => {});
  await client.delete("drafts.siteSettings").catch(() => {});
  console.log("• cleared existing migrated docs");
}

async function migrateProjects() {
  const rows = load("projects");
  const docs = rows.map((p) => ({
    _type: "project",
    _id: `project-${p.documentId}`,
    name: trim(p.name),
    slug: { _type: "slug", current: trim(p.slug) },
    tag: trim(p.tag),
    roleLabel: trim(p.roleLabel),
    period: trim(p.period),
    tagline: trim(p.tagline),
    category: p.category === "tool" ? "tool" : "product",
    stack: Array.isArray(p.stack) ? p.stack : [],
    link: p.link || undefined,
    order: typeof p.order === "number" ? p.order : undefined,
    sections: (p.sections || []).map((s) => ({
      _type: "section",
      _key: `sec-${s.id}`,
      label: trim(s.label),
      body: trim(s.body),
    })),
    features: (p.features || []).map((f) => ({
      _type: "feature",
      _key: `feat-${f.id}`,
      name: trim(f.name),
      blurb: trim(f.blurb),
      detail: trim(f.detail),
      kind: f.kind === "outcome" ? "outcome" : "feature",
    })),
  }));
  for (const d of docs) await client.createOrReplace(d);
  console.log(`• ${docs.length} projects`);
}

async function migrateMusings() {
  const rows = load("musings");
  const docs = rows.map((m) => ({
    _type: "musing",
    _id: `musing-${m.documentId}`,
    title: trim(m.Title),
    notes: trim(m.Notes),
    stage: trim(m.stage) || "queued",
    order: typeof m.order === "number" ? m.order : undefined,
    color: m.color || undefined,
    colorHex: m.colorHex || undefined,
  }));
  for (const d of docs) await client.createOrReplace(d);
  console.log(`• ${docs.length} musings`);
}

async function migrateExperiences() {
  const rows = load("experiences");
  const docs = rows.map((e) => ({
    _type: "experience",
    _id: `experience-${e.documentId}`,
    role: trim(e.role),
    when: trim(e.when),
    note: trim(e.note),
    order: typeof e.order === "number" ? e.order : undefined,
  }));
  for (const d of docs) await client.createOrReplace(d);
  console.log(`• ${docs.length} experiences`);
}

async function migrateSiteSettings() {
  const s = load("site-setting");
  const doc = { _type: "siteSettings", _id: "siteSettings" };

  const stringFields = [
    "heroThesis", "problemLead", "problemBody", "betLead", "betBody",
    "outcomeLead", "aboutHero", "aboutOrigin", "aboutOperatingInstinct",
    "fullName", "jobTitle", "email", "whatsapp", "githubUrl", "linkedinUrl",
    "contactMessage", "signoffText",
  ];
  for (const f of stringFields) if (s[f] != null) doc[f] = s[f];

  const boolFields = [
    "showProfileImage", "showResume", "showProblem", "showBet", "showOutcome",
    "showShipped", "showAlsoBuilt", "showTimeline", "showMusingsNav",
    "showSocials", "showContact", "showSignoff",
  ];
  for (const f of boolFields) if (typeof s[f] === "boolean") doc[f] = s[f];

  // Media: upload from Strapi /uploads → Sanity assets.
  if (s.resume?.url) {
    try {
      const asset = await uploadFromStrapi("file", s.resume.url, s.resume.name);
      doc.resume = { _type: "file", asset: { _type: "reference", _ref: asset._id } };
      console.log("  ↳ uploaded resume");
    } catch (e) {
      console.warn("  ↳ resume upload skipped:", e.message);
    }
  }
  if (s.profileImage?.url) {
    try {
      const asset = await uploadFromStrapi("image", s.profileImage.url, s.profileImage.name);
      doc.profileImage = { _type: "image", asset: { _type: "reference", _ref: asset._id } };
      console.log("  ↳ uploaded profile image");
    } catch (e) {
      console.warn("  ↳ profile image upload skipped:", e.message);
    }
  }

  await client.createOrReplace(doc);
  console.log("• siteSettings singleton");
}

async function main() {
  console.log(`Migrating Strapi → Sanity (${projectId}/${dataset})`);
  await clearExisting();
  await migrateProjects();
  await migrateMusings();
  await migrateExperiences();
  await migrateSiteSettings();
  console.log("✓ migration complete");
}

main().catch((e) => {
  console.error("✗ migration failed:", e);
  process.exit(1);
});
