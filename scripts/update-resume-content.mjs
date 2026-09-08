/** Apply the reviewed resume copy with revision guards. Run with node --env-file=.env.local. */
import { createClient } from '@sanity/client';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const update = JSON.parse(readFileSync(new URL('../content/resume-update.json', import.meta.url)));
export async function updateResumeContent(client) {
const docs = await client.fetch('*[_type in ["siteSettings", "experience", "project"]]', {}, { perspective: 'raw' });
if (docs.some(d => d._id.startsWith('drafts.'))) throw new Error('Unpublished drafts exist; reconcile them before updating published content.');
const backupDir = join(tmpdir(), 'portfolio-content-backups');
mkdirSync(backupDir, { recursive: true });
const backup = join(backupDir, `${Date.now()}.json`);
writeFileSync(backup, JSON.stringify(docs, null, 2));
const settings = docs.find(d => d._id === 'siteSettings');
if (!settings) throw new Error('Site settings not found');
const asset = await client.assets.upload('file', readFileSync(new URL('../public/resume.pdf', import.meta.url)), { filename: 'Olamide-Irojah-Resume.pdf' });
let tx = client.transaction();
const patch = (d, fields) => { tx = tx.patch(d._id, p => p.ifRevisionId(d._rev).set(fields)); };
patch(settings, { ...update.siteSettings, resume: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } } });
for (const [i, experience] of update.experience.entries()) {
  const company = experience.role.split(' · ')[1];
  const existing = docs.find(d => d._type === 'experience' && d.role.includes(company));
  if (!existing) throw new Error(`Missing experience: ${company}`);
  patch(existing, { ...experience, order: i + 1 });
}
for (const [slug, project] of Object.entries(update.projects)) {
  const existing = docs.find(d => d._type === 'project' && d.slug?.current === slug);
  if (existing) patch(existing, project);
  else tx = tx.create({ _id: `project-resume-${slug}`, _type: 'project', slug: { _type: 'slug', current: slug }, ...project });
}
await tx.commit();
const after = await client.fetch('*[_type in ["siteSettings", "experience", "project"]]');
for (const [slug, fields] of Object.entries(update.projects)) {
  const d = after.find(d => d.slug?.current === slug);
  for (const [key, value] of Object.entries(fields)) if (JSON.stringify(d?.[key]) !== JSON.stringify(value)) {
    // Sanity object-key ordering is not significant.
    const normalize = v => Array.isArray(v) ? v.map(normalize) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).sort().map(([k,x]) => [k, normalize(x)])) : v;
    if (JSON.stringify(normalize(d?.[key])) !== JSON.stringify(normalize(value))) throw new Error(`Verification failed: ${slug}.${key}`);
  }
}
console.log(`Updated and verified ${Object.keys(update.projects).length} projects, ${update.experience.length} experiences, and site settings. Backup: ${backup}`);

}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('Missing SANITY_API_WRITE_TOKEN');
  await updateResumeContent(createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', token: process.env.SANITY_API_WRITE_TOKEN, apiVersion: '2024-10-01', useCdn: false }));
}
