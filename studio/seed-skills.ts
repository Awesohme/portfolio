import { getCliClient } from "sanity/cli";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
// Run: cd studio && npx sanity exec seed-skills.ts --with-user-token
const config = getCliClient({ apiVersion: "2024-10-01" }).config();
execFileSync(process.execPath, [resolve("../scripts/seed-skills.mjs")], {
  stdio: "inherit",
  env: { ...process.env, SANITY_API_WRITE_TOKEN: config.token, NEXT_PUBLIC_SANITY_PROJECT_ID: config.projectId, NEXT_PUBLIC_SANITY_DATASET: config.dataset },
});
