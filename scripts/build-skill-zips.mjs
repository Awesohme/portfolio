/**
 * Build the downloadable skill zips for /skills from the private Skills folder.
 *
 *   node scripts/build-skill-zips.mjs [path/to/Skills]   (default: ../Skills)
 *
 * Copies each skill into a temp folder, scrubs personal / client details from the
 * copies (the originals are never touched), adds a README, and writes
 * public/skills/<slug>.zip plus public/skills/all-skills.zip.
 * Fails if a scrub rule stops matching or anything personal is left behind.
 */
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { skills, ALL_SKILLS_SLUG } from "../lib/skills.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(process.argv[2] || join(root, "..", "Skills"));
const out = join(root, "public", "skills");
if (!existsSync(src)) throw new Error(`Skills folder not found: ${src}`);

const SITE = "https://www.olamide-irojah.com.ng/skills";

// Where each skill's files come from (relative to the Skills folder) and how it installs.
// kind "skill" → a Claude Code skill folder (SKILL.md); "command" → a Claude Code slash command file.
const SOURCES = {
  "context-saver": {
    kind: "skill",
    files: { "SKILL.md": "context-saver.md", "SETUP-PROMPT.md": "CONTEXT-SAVER-SETUP.md", "assets/session-start.js": "context-saver/assets/session-start.js" },
    note: "Needs Node.js 18+ and the `claude` CLI signed in. For a full install on a new machine, paste SETUP-PROMPT.md into your agent.",
  },
  "context-catchup": { kind: "skill", files: { "SKILL.md": "context-catchup.md" }, note: "Works best alongside ContextSaver, which writes the summaries this reads." },
  "project-audit": { kind: "skill", files: { "SKILL.md": "project-audit.md" } },
  "new-project-setup": { kind: "command", files: { "new-project-setup.md": "new-project-setup.md" } },
  "project-docs": { kind: "command", files: { "generate-project-docs.md": "generate-project-docs.md" } },
  "second-order-impact": {
    kind: "command",
    files: { "second-order-impact.md": "II-Order-Impt.md" },
    note: "Written for a NestJS + Next.js codebase. Point Step 1 at your own folders before the first run.",
  },
  "lessons-learned": { kind: "command", files: { "lesson-learned-update.md": "lesson-learned-update.md" }, note: "Reads Claude Code session files, so it needs Claude Code." },
  "handoff-generator": { kind: "skill", files: { "SKILL.md": "project-handoff-generator/SKILL.md" } },
  "r2d2-alerts": {
    kind: "skill",
    files: { "SKILL.md": "~/.claude/skills/r2d2-alerts/SKILL.md", "any-agent.md": "R2D2Alerts.md" },
    note: "No sound file is included. Save any short sound you like as `assets/r2d2.mp3` inside the skill folder before the first run.",
  },
  "effort-routing": {
    kind: "command",
    files: { "effort-routing.md": "effort-routing.md", "effort-routing-guide.html": "effort-routing-guide.html" },
    note: "The field guide describes an optional auto-routing hook. That hook isn't part of this download; the framework works without it.",
  },
};

// Exact replacements applied to the copies. Every rule must match, so a changed source fails loudly.
const SCRUB = {
  "project-audit/SKILL.md": [[" (impactops uses ≥ 8)", " (8 is a sensible floor)"]],
  "context-saver/assets/session-start.js": [["~/.claude-tech", "~/.claude-work"]],
  "lessons-learned/lesson-learned-update.md": [
    ["`/Users/olamide/Documents/New project/impactops` → `-Users-olamide-Documents-New-project-impactops`", "`/Users/you/projects/my-app` → `-Users-you-projects-my-app`"],
    [
      "## Step 6 — Sync copies\n\nAfter updating the global files, copy them to the Vibe Coding folder so they're accessible via Finder:",
      "## Step 6 — Back up (optional)\n\nIf you keep a backup copy of your skill files somewhere else (a synced or Git folder, for example), copy the updated files there too:",
    ],
    [/~\/Desktop\/Vibe\\ Coding\/\.claude\/commands\//g, "<your-backup-folder>/"],
  ],
  "r2d2-alerts/SKILL.md": [
    ["A pristine copy is bundled in this\nskill at `assets/r2d2.mp3` so it works on a fresh machine with no network.", "No sound is bundled: save a short sound of your own at\n`assets/r2d2.mp3` in this skill folder before the first run."],
  ],
  "r2d2-alerts/any-agent.md": [
    ["The bundled sound `r2d2.mp3` sits next to this file in `Desktop/Vibe Coding/skills/`.", "No sound is bundled: save any short sound you like as `r2d2.mp3` next to this file."],
    ["(copy the bundled `r2d2.mp3` if missing)", "(copy your `r2d2.mp3` if missing)"],
  ],
  "second-order-impact/second-order-impact.md": [
    ["# /II-Order-Impt", "# /second-order-impact"],
    ["following the vista-erp architecture pattern.", "that uses permission slugs, per-client modules and event-driven notifications. Adjust the paths below to your own codebase."],
    ["/II-Order-Impt <feature description>", "/second-order-impact <feature description>"],
    ["`/II-Order-Impt Procurement module with Requisitions and Petty Cash`", "`/second-order-impact Leave management with requests and approvals`"],
    ["`src/lib/sidebar.util.ts`: read", "the file that defines your sidebar (e.g. `src/lib/sidebar.ts`): read"],
    ["`src/services/notifications.ts`: read the `NotificationType` enum", "your notifications service: read the `NotificationType` enum"],
    ["list files in `services/core/src/shared/emails/notification-templates/` to understand", "list files in your email templates folder to understand"],
    ["list files in `services/core/src/sagas/notification/`", "list files in your notification sagas or handlers folder"],
    ["read `services/core/src/domain/auditlogs/` to understand", "read your audit log module to understand"],
    ["e.g. `requisitions`, `petty-cash`", "e.g. `leave-requests`, `leave-balances`"],
    ["need these permissions assigned in Imperium.", "need these permissions assigned in your admin backoffice."],
    ["The slug to register in Imperium so the backoffice can toggle", "The slug to register in your admin backoffice so it can toggle"],
    ["`manage-procurement`", "`manage-leave`"],
    ["REQUISITION_SUBMITTED", "LEAVE_REQUEST_SUBMITTED"],
    ["needed in Imperium after backend is deployed", "needed in your admin backoffice after the backend is deployed"],
    [
      "Example: Petty Cash categories + balance tracking are a separate domain from Requisitions, even though both live under \"Procurement\" in the sidebar.",
      "Example: leave balances and accrual rules are a separate domain from leave requests, even though both live under \"Leave\" in the sidebar.",
    ],
    ["## Step 3 — Output a \"Rasaq handoff\" summary", "## Step 3 — Output a backend handoff summary"],
    ["module slug registration in Imperium", "module slug registration in the admin backoffice"],
    ["needs Rasaq's approval before", "needs the backend lead's approval before"],
    [/Requisitions/g, "LeaveRequests"],
    [/Requisition/g, "LeaveRequest"],
    [/requisitions/g, "leave-requests"],
  ],
};

// Nothing on this list may survive in a published copy.
const DENY = /olamide|irojah|\/Users\/(?!you\b|<)|imperium|rasaq|vista|impactops|\byoke\b|qshop|claude-tech|claude-team|vibe.?coding|awesohme|sahm-117|prod-sam|requisition|petty|procurement|@gmail|ghp_/i;

const expand = (p) => (p.startsWith("~/") ? join(process.env.HOME, p.slice(2)) : join(src, p));

function readme(skill, meta) {
  const install =
    meta.kind === "skill"
      ? `**Claude Code:** copy this folder to \`~/.claude/skills/${skill.slug}/\` (so the file sits at \`~/.claude/skills/${skill.slug}/SKILL.md\`), then start a new session. Claude picks it up when it's relevant, or you can call it by name.`
      : `**Claude Code:** copy the \`.md\` command file into \`~/.claude/commands/\`, then type \`/\` plus its file name (without \`.md\`) in a new session.`;
  return `# ${skill.name}

${skill.line}

Works with: ${skill.worksWith}

## Install

${install}

**Other AI agents (Codex, Cursor, Aider, Gemini and others):** open the \`.md\` file and paste it into your agent as instructions, or save it wherever your tool keeps its rules or custom commands. Each file is written in plain steps, so any capable coding agent can follow it.
${meta.note ? `\n## Before you start\n\n${meta.note}\n` : ""}
## Licence

Free to use, change and share. A link back is appreciated but not required.

Made by Olamide Irojah · ${SITE}
`;
}

function scrub(stageRoot) {
  for (const [rel, rules] of Object.entries(SCRUB)) {
    const file = join(stageRoot, rel);
    let text = readFileSync(file, "utf8");
    for (const [from, to] of rules) {
      const hit = typeof from === "string" ? text.includes(from) : from.test(text);
      if (!hit) throw new Error(`Scrub rule no longer matches in ${rel}: ${String(from).slice(0, 80)}`);
      text = typeof from === "string" ? text.split(from).join(to) : text.replace(from, to);
    }
    writeFileSync(file, text);
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const stage = mkdtempSync(join(tmpdir(), "skill-zips-"));
try {
  for (const skill of skills) {
    const meta = SOURCES[skill.slug];
    if (!meta) throw new Error(`No source mapping for ${skill.slug}`);
    for (const [dest, from] of Object.entries(meta.files)) {
      const target = join(stage, skill.slug, dest);
      mkdirSync(dirname(target), { recursive: true });
      cpSync(expand(from), target);
    }
  }
  scrub(stage);

  // Personal-detail check runs on the scrubbed skill files only (the READMEs carry the credit line).
  const leaks = [];
  for (const file of walk(stage)) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      if (DENY.test(line)) leaks.push(`${file.slice(stage.length + 1)}:${i + 1}: ${line.trim().slice(0, 120)}`);
    });
  }
  if (leaks.length) throw new Error(`Personal details left in the copies:\n${leaks.join("\n")}`);

  for (const skill of skills) writeFileSync(join(stage, skill.slug, "README.md"), readme(skill, SOURCES[skill.slug]));
  writeFileSync(
    join(stage, "README.md"),
    `# Skills by Olamide Irojah\n\n${skills.map((s) => `- **${s.name}** (\`${s.slug}/\`): ${s.line}`).join("\n")}\n\nEach folder has its own README with install steps.\n\nFree to use, change and share. ${SITE}\n`,
  );

  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const zip = (name, entries) => execFileSync("zip", ["-q", "-r", "-X", join(out, `${name}.zip`), ...entries], { cwd: stage });
  for (const skill of skills) zip(skill.slug, [skill.slug]);
  zip(ALL_SKILLS_SLUG, ["README.md", ...skills.map((s) => s.slug)]);
  console.log(`Built ${skills.length} skill zips + ${ALL_SKILLS_SLUG}.zip in public/skills (from ${src})`);
} finally {
  rmSync(stage, { recursive: true, force: true });
}
