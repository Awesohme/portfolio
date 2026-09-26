/**
 * Free AI coding skills offered for download on /skills.
 * Local source of truth + fallback when the CMS is unreachable (like lib/brands.ts).
 * The zips in public/skills/<slug>.zip are built by scripts/build-skill-zips.mjs.
 */

export type Skill = {
  slug: string;
  name: string;
  /** one plain-English line: what it does for you */
  line: string;
  /** e.g. "Any AI agent" or "Claude Code" */
  worksWith: string;
  /** what's inside the download, shown on the card */
  includes: string[];
};

export const ALL_SKILLS_SLUG = "all-skills";

export const skills: Skill[] = [
  {
    slug: "context-saver",
    name: "ContextSaver",
    line: "Saves a short summary of every AI coding session into your project, so the next session, or another AI tool, picks up where you left off.",
    worksWith: "Claude Code · other agents",
    includes: ["Skill", "Setup prompt", "Hook script"],
  },
  {
    slug: "context-catchup",
    name: "ContextCatchup",
    line: "Reads those saved summaries at the start of a session and tells you what is still pending before you touch anything.",
    worksWith: "Any AI agent",
    includes: ["Skill"],
  },
  {
    slug: "project-audit",
    name: "Project Audit",
    line: "Checks a Next.js + Supabase app for security, performance and React gaps, then gives a score and a fix list by severity.",
    worksWith: "Any AI agent",
    includes: ["Skill"],
  },
  {
    slug: "new-project-setup",
    name: "New Project Setup",
    line: "Starts a new Next.js + Supabase app with sign-in, database security and error handling done properly from day one.",
    worksWith: "Any AI agent",
    includes: ["Command"],
  },
  {
    slug: "project-docs",
    name: "Project Docs Generator",
    line: "Writes a PRD, a README, HTML and PowerPoint user guides and a LinkedIn post from your codebase.",
    worksWith: "Any AI agent",
    includes: ["Command"],
  },
  {
    slug: "second-order-impact",
    name: "Second-Order Impact",
    line: "Lists everything else a new feature will need, from permissions and emails to notifications and audit logs, before the team finds out late.",
    worksWith: "Any AI agent",
    includes: ["Command"],
  },
  {
    slug: "lessons-learned",
    name: "Lessons Learned",
    line: "Reads a project's past AI sessions for bugs and gotchas, then folds the lessons into your setup and audit checklists.",
    worksWith: "Claude Code",
    includes: ["Command"],
  },
  {
    slug: "handoff-generator",
    name: "Handoff Generator",
    line: "Writes a complete handoff document so another person, chat or AI tool can carry on the work without losing context.",
    worksWith: "Any AI agent",
    includes: ["Skill"],
  },
  {
    slug: "r2d2-alerts",
    name: "R2D2 Alerts",
    line: "Plays a beep whenever your AI coding agent needs your permission or is waiting on you. Bring your own sound.",
    worksWith: "Claude Code · other agents",
    includes: ["Skill", "Any-agent guide"],
  },
  {
    slug: "effort-routing",
    name: "Effort Routing",
    line: "A simple way to choose how hard the AI should think, and which model to use, so you get quality without paying for it everywhere.",
    worksWith: "Claude Code",
    includes: ["Command", "Field guide"],
  },
];
