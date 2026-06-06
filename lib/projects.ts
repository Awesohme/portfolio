export type Continent = {
  name: string;
  kind: "feature" | "outcome";
  blurb: string;
  detail: string;
};

export type Project = {
  slug: string;
  name: string;
  tag: string;
  role: string;
  period: string;
  // short label used on the constellation node
  node: string;
  // one-line tagline shown under the title
  tagline: string;
  // Star Wars crawl: title + paragraphs
  crawlTitle: string;
  crawl: string[];
  stack: string[];
  link?: string;
  // planet styling
  planet: { base: string; land: string; atmosphere: string };
  continents: Continent[];
};

export const projects: Project[] = [
  {
    slug: "qshop",
    name: "QShop Tech",
    node: "QShop",
    tag: "B2B SaaS",
    role: "Product Lead",
    period: "Jun 2022 – Present",
    tagline: "A multi-product commerce portfolio scaled to 59,700+ stores.",
    crawlTitle: "Episode I — THE COMMERCE ENGINE",
    crawl: [
      "Across the emerging markets, thousands of merchants struggled to come online and stay online.",
      "A multi-product portfolio was forged — and grown to 59,700+ stores processing $5.2M in annual GMV and 18,000+ monthly orders.",
      "But growth alone was never the mission. The real work was deciding what to build, what to kill, and how to make activation, retention, and revenue compound...",
    ],
    stack: ["Product Strategy", "Activation", "Experimentation", "B2B SaaS"],
    planet: { base: "#0E5C46", land: "#13B981", atmosphere: "#34D399" },
    continents: [
      { name: "Activation Flow Redesign", kind: "outcome", blurb: "Onboarding drop-off cut 70% → 45%", detail: "Redesigned the activation flow through hypothesis-driven testing. One change compounded across activation, retention, and revenue per user." },
      { name: "Portfolio Scale", kind: "outcome", blurb: "59,700+ stores · $5.2M GMV", detail: "Owned end-to-end product strategy from discovery through delivery, scaling a multi-product portfolio to 59,700+ stores and 18,000+ monthly orders." },
      { name: "Disciplined Roadmap", kind: "feature", blurb: "3 features → 15% engagement", detail: "Shipped 3 core features that drove a 15% engagement increase and 10% fewer support tickets — by killing the 20 requests that didn't make the cut." },
      { name: "Team Operating Model", kind: "outcome", blurb: "+30% sprint velocity", detail: "Built a milestone-based autonomy framework that lifted sprint velocity 30% across Design, Engineering, and Associate PMs — so the business could scale without me as the bottleneck." },
    ],
  },
  {
    slug: "imperium-utilities",
    name: "Imperium Utilities",
    node: "Imperium Utilities",
    tag: "Enterprise ERP",
    role: "Product / Delivery Lead",
    period: "2024 – Present",
    tagline: "A multi-tenant ERP platform for enterprise operations.",
    crawlTitle: "Episode II — THE IMPERIUM",
    crawl: [
      "An advisory enterprise needed one system to rule its companies, users, and operations.",
      "A multi-tenant ERP rose — backoffice, core services, and customer-facing UI, governed by roles and migrations.",
      "The challenge: ship enterprise-grade capability without becoming an enterprise-grade mess...",
    ],
    stack: ["NestJS", "Next.js", "Multi-tenant", "RBAC"],
    planet: { base: "#0B4A57", land: "#10B981", atmosphere: "#2ED9A0" },
    continents: [
      { name: "Multi-Tenant Core", kind: "feature", blurb: "Companies & users, isolated", detail: "A core backend handling migrations, endpoints, controllers and repositories — isolating each customer's data and configuration." },
      { name: "Super-Admin Backoffice", kind: "feature", blurb: "Manage every company", detail: "A super-admin interface to manage all companies and users as configured by customers." },
      { name: "Customer UI", kind: "feature", blurb: "The product customers touch", detail: "A dedicated frontend for Vista's customers — role-aware and built on the shared core." },
      { name: "Governed Delivery", kind: "outcome", blurb: "Enterprise-grade, shipped", detail: "Coordinated cross-team delivery with backend ownership boundaries respected, migrations gated, and shared infrastructure protected." },
    ],
  },
  {
    slug: "morph-ops",
    name: "Morph Ops Control Room",
    node: "Morph",
    tag: "Live PWA",
    role: "Product Lead & Builder",
    period: "2025 – Present",
    tagline: "The operational source of truth for running cohorts — mobile-first, role-aware.",
    crawlTitle: "Episode III — THE CONTROL ROOM",
    crawl: [
      "A growing programme ran on a fragile Excel control workbook. The team flew blind.",
      "In its place rose a Supabase-backed app — surfacing at-risk students early, pushing role-scoped tasks, and keeping an audit trail of every change.",
      "Three roles, one source of truth, current and accountable...",
    ],
    stack: ["Next.js 15", "React 19", "Supabase", "PWA", "Vercel Cron"],
    link: "https://tnx-morph-fob.vercel.app",
    planet: { base: "#0E5C46", land: "#16C98A", atmosphere: "#34D399" },
    continents: [
      { name: "At-Risk Detection", kind: "outcome", blurb: "Flag students early", detail: "Surfaces at-risk participants early so the team can intervene before it's too late." },
      { name: "Role-Scoped Tasks", kind: "feature", blurb: "Admin · Facilitator · CM", detail: "Three roles with scoped permissions; role tasks, reviews, and daily 08:00 reminders via Vercel Cron." },
      { name: "Self-Service Links", kind: "feature", blurb: "Submit & sign in publicly", detail: "Participants self-submit work and sign into sessions via public links — no account friction." },
      { name: "Audit Trail", kind: "feature", blurb: "Every change accountable", detail: "Supabase RLS + audit logs keep the whole team working from current, accountable data." },
    ],
  },
  {
    slug: "tracta",
    name: "TractaIQ",
    node: "TractaIQ",
    tag: "Field Tech",
    role: "Product Owner",
    period: "2025",
    tagline: "A WhatsApp + offline PWA for distributed field workers in low-connectivity environments.",
    crawlTitle: "Episode IV — THE FIELD",
    crawl: [
      "Far from reliable networks, field workers and their supervisors could not stay in sync.",
      "A hybrid platform answered — WhatsApp where there's signal, an offline-first PWA where there isn't, one backend behind both.",
      "Built to work when the connection doesn't...",
    ],
    stack: ["NestJS", "CQRS", "React PWA", "PostgreSQL", "offline-first"],
    planet: { base: "#0B4A40", land: "#12B981", atmosphere: "#2ED9A0" },
    continents: [
      { name: "Offline-First PWA", kind: "feature", blurb: "Works without signal", detail: "A React PWA with offline-first capabilities so field workers stay productive in low-connectivity environments." },
      { name: "WhatsApp Hybrid", kind: "feature", blurb: "Meet workers where they are", detail: "A WhatsApp channel for the workers who live in it, unified with the PWA behind a single backend." },
      { name: "CQRS Backend", kind: "feature", blurb: "Repository + CQRS", detail: "A NestJS backend using the Repository pattern + CQRS for clean reads/writes and scale." },
      { name: "Supervisor Backoffice", kind: "outcome", blurb: "Distributed teams, managed", detail: "An admin dashboard giving supervisors visibility and control over distributed field teams." },
    ],
  },
  {
    slug: "atia",
    name: "ATIA",
    node: "ATIA",
    tag: "Investment Platform",
    role: "Product Manager",
    period: "2025",
    tagline: "Connecting investors with startups across three tailored dashboards.",
    crawlTitle: "Episode V — THE EXCHANGE",
    crawl: [
      "Investors and startups spoke different languages and needed different tools.",
      "A platform bridged them — three dashboards, one CQRS core, a single source of capital truth.",
      "Each side gets its own view; the system keeps them in sync...",
    ],
    stack: ["NestJS", "CQRS", "React", "Monorepo"],
    planet: { base: "#0E5249", land: "#13B981", atmosphere: "#34D399" },
    continents: [
      { name: "Investor Dashboard", kind: "feature", blurb: "Discover & track deals", detail: "A dedicated investor experience for discovering startups and managing positions." },
      { name: "Startup Dashboard", kind: "feature", blurb: "Raise & report", detail: "A startup-facing view for raising and reporting to investors." },
      { name: "Backoffice", kind: "feature", blurb: "Operate the marketplace", detail: "An admin dashboard operating the two-sided marketplace." },
      { name: "CQRS Architecture", kind: "outcome", blurb: "Clean, scalable core", detail: "A modern monorepo with CQRS separating commands from queries for a maintainable platform." },
    ],
  },
  {
    slug: "sunset-haven",
    name: "Sunset Haven",
    node: "Sunset Haven",
    tag: "Resort + Admin",
    role: "Product / Builder",
    period: "2025",
    tagline: "A luxury resort website with a complete content-management backoffice.",
    crawlTitle: "Episode VI — THE HAVEN",
    crawl: [
      "A luxury resort needed a presence as polished as its experience — and a way to run it.",
      "A public showcase rose beside a full admin backoffice: events, gallery, inquiries, newsletters, all role-governed.",
      "Beauty for guests; control for the team...",
    ],
    stack: ["Next.js 14", "TypeScript", "Supabase", "Paystack", "shadcn/ui"],
    planet: { base: "#13503A", land: "#19C98A", atmosphere: "#34D399" },
    continents: [
      { name: "Events & Payments", kind: "feature", blurb: "Multi-tier pricing + Paystack", detail: "A multi-tier event pricing system with Paystack integration for real bookings." },
      { name: "RBAC Admin", kind: "feature", blurb: "viewer → super_admin", detail: "Role-based access control across viewer, editor, admin and super_admin roles." },
      { name: "Content Studio", kind: "feature", blurb: "Gallery, events, testimonials", detail: "A complete backoffice to manage gallery (with tagging), events, inquiries and testimonials." },
      { name: "Analytics", kind: "outcome", blurb: "Behaviour tracked end-to-end", detail: "Microsoft Clarity on both the frontend and admin to understand user behaviour." },
    ],
  },
  {
    slug: "impactops",
    name: "Adlai ImpactOps",
    node: "ImpactOps",
    tag: "Programme Ops",
    role: "Product / Builder",
    period: "2025",
    tagline: "Programme operations for a foundation — structured, secure, auditable.",
    crawlTitle: "Episode VII — THE MISSION",
    crawl: [
      "A foundation's impact was real but its operations lived in scattered records.",
      "A focused web app gathered them — compact structured records, auth, row-level security, audit metadata.",
      "Phase one: make the operation legible...",
    ],
    stack: ["Next.js", "Vercel", "Supabase", "RLS"],
    planet: { base: "#0E5249", land: "#12B981", atmosphere: "#2ED9A0" },
    continents: [
      { name: "Structured Records", kind: "feature", blurb: "Compact, queryable data", detail: "Supabase-backed structured records replacing scattered programme data." },
      { name: "Auth & RLS", kind: "feature", blurb: "Secure by default", detail: "Authentication and row-level security so the right people see the right records." },
      { name: "Audit Metadata", kind: "feature", blurb: "Accountable changes", detail: "Audit metadata on records for accountability across programme operations." },
      { name: "Phase-1 Foundation", kind: "outcome", blurb: "Operation made legible", detail: "A deployable Phase-1 shell on Vercel that makes the foundation's operations legible and extensible." },
    ],
  },
  {
    slug: "mikano",
    name: "Mikano Image Guide",
    node: "Mikano",
    tag: "Auto-crawling Tool",
    role: "Builder",
    period: "2025",
    tagline: "A self-refreshing image design reference that crawls a live site.",
    crawlTitle: "Episode VIII — THE CARTOGRAPHER",
    crawl: [
      "Designers needed exact image dimensions from a constantly-changing website.",
      "A crawler answered — reading the sitemap, rendering pages in Chromium, extracting every content image's dimensions.",
      "A reference that updates itself...",
    ],
    stack: ["Crawler", "Chromium", "Sitemap", "HTML output"],
    planet: { base: "#0B4A40", land: "#13B981", atmosphere: "#34D399" },
    continents: [
      { name: "Sitemap Crawl", kind: "feature", blurb: "Reads the live sitemap", detail: "Crawls the site's sitemap.xml to discover every public page automatically." },
      { name: "Chromium Render", kind: "feature", blurb: "Renders real Vue pages", detail: "Renders the Vue pages in Chromium to measure images as users actually see them." },
      { name: "Dimension Extraction", kind: "feature", blurb: "Exact CMS image sizes", detail: "Extracts content/CMS image dimensions into a designer-friendly reference." },
      { name: "Auto-Refresh", kind: "outcome", blurb: "Never goes stale", detail: "Publishes a self-updating HTML guide so designers always work from current truth." },
    ],
  },
  {
    slug: "qtrack",
    name: "QTrack",
    node: "QTrack",
    tag: "AI Build",
    role: "Product Owner",
    period: "Mar – Sep 2025",
    tagline: "A WhatsApp-based AI expense tracker, built with AI tools at 10× speed.",
    crawlTitle: "Episode IX — THE LEDGER",
    crawl: [
      "Tracking expenses was friction nobody wanted. The interface had to disappear.",
      "So it lived in WhatsApp — an AI expense tracker built entirely with AI tools, 10× faster than a traditional cycle.",
      "Validation came fast: 500+ users in two months...",
    ],
    stack: ["AI tools", "WhatsApp", "0-to-1"],
    planet: { base: "#0E5C46", land: "#16C98A", atmosphere: "#34D399" },
    continents: [
      { name: "WhatsApp-Native", kind: "feature", blurb: "No app to install", detail: "An AI expense tracker that lives where users already are — WhatsApp — removing all install friction." },
      { name: "AI-Built, 10× Faster", kind: "outcome", blurb: "10× time-to-market", detail: "Built and deployed using only AI tools, reaching market 10× faster than a traditional engineering cycle." },
      { name: "Fast Validation", kind: "outcome", blurb: "500+ users in 2 months", detail: "Acquired 500+ users in two months — validating the bet before any heavy investment." },
    ],
  },
  {
    slug: "sugar-guest-pro",
    name: "Sugar Guest Pro",
    node: "Sugar Guest",
    tag: "AI Event SaaS",
    role: "Product Manager",
    period: "Jun 2025 – Present",
    tagline: "AI event management — validated with a 48-hour WhatsApp bot before any engineering.",
    crawlTitle: "Episode X — THE GATHERING",
    crawl: [
      "Event planners drowned in check-in chaos at the door.",
      "Rather than build first, a WhatsApp bot shipped in 48 hours to test the hypothesis with real planners.",
      "Check-in times fell by half — the bet was real...",
    ],
    stack: ["WhatsApp bot", "AI", "Rapid validation"],
    planet: { base: "#0E5249", land: "#13B981", atmosphere: "#2ED9A0" },
    continents: [
      { name: "48-Hour Validation", kind: "outcome", blurb: "Hypothesis tested in 2 days", detail: "Deployed a WhatsApp bot in 48 hours to validate a usage hypothesis before committing any engineering resources." },
      { name: "Check-in Speed", kind: "outcome", blurb: "Check-in times cut 50%", detail: "Served 20+ event planners with check-in times cut by half." },
      { name: "Planner Workflow", kind: "feature", blurb: "Manage guests end-to-end", detail: "An event-management tool shaped around how planners actually run the door." },
    ],
  },
  {
    slug: "jarvis",
    name: "Jarvis",
    node: "Jarvis",
    tag: "Personal AI OS",
    role: "Product Lead & Architect",
    period: "Jan 2026 – Present",
    tagline: "A custom AI operating system — a second brain that runs the work.",
    crawlTitle: "Episode XI — THE SECOND BRAIN",
    crawl: [
      "Context was scattered across tools, chats, and memory. Nothing held the whole picture.",
      "Jarvis was architected — a custom AI agent that automates research, synthesis, and workflow as a second brain.",
      "Built on Claude Code & Make, it turns intent into executed work...",
    ],
    stack: ["Claude Code", "Make", "AI agents", "Automation"],
    planet: { base: "#0B4A57", land: "#10B981", atmosphere: "#34D399" },
    continents: [
      { name: "Research & Synthesis", kind: "feature", blurb: "Automated knowledge work", detail: "Automates research and knowledge synthesis so decisions start from a digested picture, not raw noise." },
      { name: "Workflow Automation", kind: "feature", blurb: "Intent → executed work", detail: "Wires Claude Code & Make so assigned work gets executed and reviewed, not just tracked." },
      { name: "Context Continuity", kind: "outcome", blurb: "Never loses the thread", detail: "Acts as a second brain that carries context across sessions, tools, and projects." },
    ],
  },
  {
    slug: "claude-skills",
    name: "Claude Code Skill System",
    node: "Skill System",
    tag: "Dev Workflow",
    role: "Builder",
    period: "2025 – Present",
    tagline: "13 custom skills & hooks that make solo, AI-assisted delivery fast.",
    crawlTitle: "Episode XII — THE WORKSHOP",
    crawl: [
      "Directing AI to ship real products needs more than a chat box.",
      "A workshop was built — 13 custom skills and hooks across attention, continuity, project lifecycle, and quality.",
      "The furniture is the products; this is the workshop that makes them...",
    ],
    stack: ["Claude Code", "Hooks", "Skills", "Automation"],
    planet: { base: "#0E5C46", land: "#16C98A", atmosphere: "#2ED9A0" },
    continents: [
      { name: "Attention & Focus", kind: "feature", blurb: "Voice · R2D2 · Stay-Awake", detail: "Hooks that read responses aloud, beep when blocked, and keep the screen awake — so long agent runs don't chain you to the terminal." },
      { name: "Context & Continuity", kind: "feature", blurb: "Save · Catch-up · Handoff", detail: "ContextSaver, ContextCatchup and a handoff generator carry work across sessions, agents, and people." },
      { name: "Project Lifecycle", kind: "feature", blurb: "Scaffold · Docs", detail: "New-project setup (targets 95+/100 react-doctor) and a docs generator for PRD, README, guides, and posts." },
      { name: "Quality & Review", kind: "outcome", blurb: "Audit · 2nd-order · Lessons", detail: "Project audits, second-order impact analysis, and a lessons-learned pipeline keep delivery honest." },
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
