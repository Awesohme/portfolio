/**
 * /v2 (Spec) case-study copy overrides.
 *
 * lib/projects.ts is written in the galaxy site's "mythic crawl" voice
 * ("A portfolio was forged…") with em dashes + trailing ellipses. That reads
 * wrong on the PRD theme, so the Spec pages use THIS first-person copy instead.
 * Structured fields (stack, continents, link, name) still come from projects.ts.
 *
 * `category` drives the home §04 split: "product" cases are primary,
 * "tool" cases live in the "Also built" shelf.
 * `roleLabel` overrides the role shown on /v2 so standalone "Builder" reads
 * in a product-framed way (hybrid PM + builder thesis).
 *
 * Kept CMS-agnostic on purpose: this is a plain data map, easy to migrate to
 * Supabase or Strapi later without touching the page components.
 */

export type SpecCase = {
  category: "product" | "tool";
  roleLabel?: string; // overrides projects.ts role on /v2
  period: string; // dash-free
  tagline: string; // dash-free, first person where it reads naturally
  // narrative sections — labels are fixed (Problem / What I did / Outcome)
  sections: { label: string; body: string }[];
};

export const specCases: Record<string, SpecCase> = {
  qshop: {
    category: "product",
    roleLabel: "Product Lead",
    period: "Jun 2022 to Present",
    tagline: "The multi-product commerce portfolio I grew from a leaky funnel to 59,700+ stores.",
    sections: [
      {
        label: "Problem",
        body: "Across emerging markets, thousands of merchants struggled to come online and stay online. Onboarding leaked 70% of new businesses before they ever transacted, so growth was capped no matter how many merchants we acquired.",
      },
      {
        label: "Hypothesis",
        body: "The obvious fix was to strip out steps and make onboarding shorter. I instrumented the funnel, found drop-off concentrated early in activation, and formed a different hypothesis: the problem was not the number of steps, it was that the first run asked merchants to commit real effort and their own data before they had seen any value.",
      },
      {
        label: "What I did",
        body: "I ran A/B tests on the activation flow, then reviewed the results both quantitatively and qualitatively, the numbers told me where merchants left, the conversations told me why. The data pointed to one insight: people wanted to explore the product before committing their own data. So I built a sample, pre-filled first-run experience they could play with first, and only asked for real input once they had seen the value. That shortened time-to-value instead of just shortening the form, and I validated it before spending heavy engineering.",
      },
      {
        label: "Outcome",
        body: "Drop-off fell from 70% to 45%. That single change compounded across activation, retention, and revenue per user, and the portfolio grew to 59,700+ stores processing $5.2M in annual GMV and 18,000+ monthly orders. The lesson I kept: the answer was not fewer steps, it was getting users to value sooner by letting them explore before they commit.",
      },
      {
        label: "How I led the team",
        body: "Scaling this meant I could not be the bottleneck. I moved the team from task-by-task direction to a milestone-based operating model: clear goals and owned milestones, with autonomy on how to hit them, across Design, Engineering, and Associate PMs. Sprint velocity rose 30%, and the business kept moving when I was not in the room. I also held a disciplined roadmap, shipping the 3 features that drove a 15% engagement lift and 10% fewer support tickets by killing the 20 requests that did not earn their place.",
      },
    ],
  },
  "imperium-utilities": {
    category: "product",
    roleLabel: "Product / Delivery Lead",
    period: "2024 to Present",
    tagline: "A multi-tenant ERP platform for enterprise operations.",
    sections: [
      {
        label: "Problem",
        body: "An advisory enterprise needed one system to run its companies, users, and operations, without each new customer turning into a bespoke, unmaintainable build.",
      },
      {
        label: "What I did",
        body: "I led delivery of a multi-tenant ERP: a core backend, a super-admin backoffice, and a customer-facing UI, governed by roles and migrations. I held backend ownership boundaries, gated migrations, and protected shared infrastructure so the team could move without breaking each other.",
      },
      {
        label: "Outcome",
        body: "Enterprise-grade capability shipped without becoming an enterprise-grade mess: isolated tenants, role-aware UIs, and a coordinated cross-team delivery that scaled.",
      },
    ],
  },
  "morph-ops": {
    category: "tool",
    roleLabel: "Product Lead & Builder",
    period: "2025 to Present",
    tagline: "The operational source of truth for running cohorts: mobile-first and role-aware.",
    sections: [
      {
        label: "Problem",
        body: "A growing programme ran on a fragile Excel control workbook. The team flew blind, and at-risk students were caught too late.",
      },
      {
        label: "What I did",
        body: "I shipped a Supabase-backed app in its place: it surfaces at-risk students early, pushes role-scoped tasks across three roles, and keeps an audit trail of every change. Participants self-submit work and sign in via public links, so there is no account friction.",
      },
      {
        label: "Outcome",
        body: "Three roles, one source of truth, current and accountable. The team intervenes before it is too late, working from live data instead of a stale spreadsheet.",
      },
    ],
  },
  tracta: {
    category: "product",
    roleLabel: "Product Owner",
    period: "2025",
    tagline: "A WhatsApp and offline-first PWA for field workers in low-connectivity environments.",
    sections: [
      {
        label: "Problem",
        body: "Far from reliable networks, field workers and their supervisors could not stay in sync. Tools that assumed a connection simply failed where the work happened.",
      },
      {
        label: "What I did",
        body: "I owned a hybrid platform: WhatsApp where there is signal, an offline-first PWA where there is not, one backend behind both. The supervisor backoffice gives visibility and control over distributed teams.",
      },
      {
        label: "Outcome",
        body: "A platform built to work when the connection does not, keeping distributed field teams productive and managed.",
      },
    ],
  },
  atia: {
    category: "tool",
    roleLabel: "Product Manager",
    period: "2025",
    tagline: "Connecting investors with startups across three tailored dashboards.",
    sections: [
      {
        label: "Problem",
        body: "Investors and startups spoke different languages and needed different tools, but had to stay in sync around a single source of capital truth.",
      },
      {
        label: "What I did",
        body: "I shaped a two-sided platform: an investor dashboard to discover and track deals, a startup dashboard to raise and report, and a backoffice to operate the marketplace, all on one CQRS core.",
      },
      {
        label: "Outcome",
        body: "Each side gets its own view while the system keeps them in sync, on a clean, scalable core that separates commands from queries.",
      },
    ],
  },
  "sunset-haven": {
    category: "tool",
    roleLabel: "Product / Builder",
    period: "2025",
    tagline: "A luxury resort website with a complete content-management backoffice.",
    sections: [
      {
        label: "Problem",
        body: "A luxury resort needed a presence as polished as its experience, and a way for the team to actually run it.",
      },
      {
        label: "What I did",
        body: "I built a public showcase alongside a full admin backoffice: multi-tier event pricing with Paystack, role-based access from viewer to super-admin, and a content studio for gallery, events, inquiries, and testimonials. I wired Microsoft Clarity on both surfaces to understand behaviour.",
      },
      {
        label: "Outcome",
        body: "Beauty for guests, control for the team, with real bookings and behaviour tracked end to end.",
      },
    ],
  },
  impactops: {
    category: "tool",
    roleLabel: "Product / Builder",
    period: "2025",
    tagline: "Programme operations for a foundation: structured, secure, and auditable.",
    sections: [
      {
        label: "Problem",
        body: "A foundation's impact was real, but its operations lived in scattered records that no one could query or trust.",
      },
      {
        label: "What I did",
        body: "I gathered them into a focused web app: compact structured records on Supabase, authentication and row-level security so the right people see the right records, and audit metadata for accountable changes.",
      },
      {
        label: "Outcome",
        body: "A deployable Phase-1 foundation that makes the operation legible and extensible, with security in by default.",
      },
    ],
  },
  qtrack: {
    category: "product",
    roleLabel: "Product Owner",
    period: "Mar to Sep 2025",
    tagline: "A WhatsApp AI expense tracker, built with AI tools at 10x speed.",
    sections: [
      {
        label: "Problem",
        body: "Tracking expenses was friction nobody wanted. For it to stick, the interface had to disappear.",
      },
      {
        label: "What I did",
        body: "So it lived in WhatsApp, where users already are, with no app to install. I built and shipped it end to end using AI tools, reaching market roughly 10x faster than a traditional engineering cycle.",
      },
      {
        label: "Outcome",
        body: "500+ users in two months, validating the bet before any heavy investment.",
      },
    ],
  },
  "sugar-guest-pro": {
    category: "product",
    roleLabel: "Product Manager",
    period: "Jun 2025 to Present",
    tagline: "AI event management, validated with a 48-hour WhatsApp bot before any engineering.",
    sections: [
      {
        label: "Problem",
        body: "Event planners drowned in check-in chaos at the door, and building the full product first would have been an expensive guess.",
      },
      {
        label: "What I did",
        body: "Rather than build first, I shipped a WhatsApp bot in 48 hours to test the hypothesis with real planners, then shaped the tool around how they actually run the door.",
      },
      {
        label: "Outcome",
        body: "Check-in times fell by half across 20+ event planners. The bet was real, and proven cheaply.",
      },
    ],
  },
  jarvis: {
    category: "tool",
    roleLabel: "Product Lead & Architect",
    period: "Jan 2026 to Present",
    tagline: "A custom AI operating system: a second brain that runs the work.",
    sections: [
      {
        label: "Problem",
        body: "Context was scattered across tools, chats, and memory. Nothing held the whole picture, so every decision restarted from raw noise.",
      },
      {
        label: "What I did",
        body: "I architected Jarvis, a custom AI agent that automates research, synthesis, and workflow as a second brain. Built on Claude Code and Make, it wires intent into executed, reviewed work, not just tracked tasks.",
      },
      {
        label: "Outcome",
        body: "It carries context across sessions, tools, and projects, turning intent into executed work and never losing the thread.",
      },
    ],
  },
  mikano: {
    category: "tool",
    roleLabel: "Product Builder",
    period: "2025",
    tagline: "A self-refreshing image design reference that crawls a live site.",
    sections: [
      {
        label: "Problem",
        body: "Designers kept asking for exact image dimensions from a site whose content images changed constantly. Answers were manual and stale within days.",
      },
      {
        label: "What I did",
        body: "I built a crawler that reads the live sitemap, renders each page in Chromium, and extracts every content image's dimensions into a designer-friendly reference that updates itself.",
      },
      {
        label: "Outcome",
        body: "A guide that never goes stale, so designers always work from current truth and the recurring question answers itself.",
      },
    ],
  },
  "claude-skills": {
    category: "tool",
    roleLabel: "Product Builder",
    period: "2025 to Present",
    tagline: "13 custom skills and hooks that make solo, AI-assisted delivery fast.",
    sections: [
      {
        label: "Problem",
        body: "Directing AI to ship real products needs more than a chat box. Long agent runs lose context, drift, and chain you to the terminal.",
      },
      {
        label: "What I did",
        body: "I built a workshop of 13 custom skills and hooks across attention, continuity, project lifecycle, and quality: voice and alerts for long runs, save and handoff for continuity, scaffolding and docs generation, and audits plus a lessons-learned pipeline.",
      },
      {
        label: "Outcome",
        body: "The products are the furniture; this is the workshop that makes them. It keeps solo, AI-assisted delivery fast and honest.",
      },
    ],
  },
};

export const getSpecCase = (slug: string) => specCases[slug];
