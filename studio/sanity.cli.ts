import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "iwiuwy59";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineCliConfig({
  api: { projectId, dataset },
  // Deploys to https://olamide-portfolio.sanity.studio
  studioHost: "olamide-portfolio",
  deployment: { autoUpdates: true, appId: "ird0c3ic2dlwduuluz60g1x7" },
});
