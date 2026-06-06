"use client";

import { useState } from "react";
import Link from "next/link";
import ContactModal from "./ContactModal";

const timeline = [
  {
    role: "Product Lead — QShop Tech",
    when: "2022 — Present",
    note: "Owned product end-to-end. Cut onboarding drop-off 70% → 45%; grew a multi-product portfolio to 59,700+ businesses, $5.2M GMV, 18,000+ monthly orders. Built a milestone-based autonomy framework that lifted team velocity 30%.",
  },
  {
    role: "Lead Project Manager — Yoke Solutions",
    when: "2022 — Present",
    note: "Led a 5-person team overhauling a government agency portal (+50% UX metrics in 7 months). Directed ~$50k+/yr of B2B enterprise delivery. Learned B2B product the hard way: the people paying aren't always the people using.",
  },
  {
    role: "Chief Operating Officer — MyFarmbase Africa",
    when: "2019 — 2021",
    note: "Zero-to-one in a market with no playbook: scaled an EdTech platform to 9,000+ users across West Africa and launched 200+ profitable agribusinesses. Retention up 25% through engagement design.",
  },
];

const builds = [
  "QShop — multi-product B2B commerce",
  "Imperium Utilities — multi-tenant ERP",
  "Morph Ops — live role-aware PWA",
  "TractaIQ — offline-first field platform",
  "QTrack · Sugar Guest · Jarvis",
  "13 custom Claude Code dev-skills",
];

export default function AboutClient() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink text-[#f1f6f3]">
      {/* ambient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] z-0"
        style={{
          background:
            "radial-gradient(50% 60% at 70% 0%, rgba(16,185,129,.18), transparent 70%)",
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-[6vw] py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-emerald-soft"
        >
          ← Back to the galaxy
        </Link>
        <button
          onClick={() => setContactOpen(true)}
          className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium transition hover:border-emerald hover:shadow-glow"
        >
          Let&apos;s talk →
        </button>
      </nav>

      <div className="relative z-10 mx-auto max-w-3xl px-[6vw] pb-24 pt-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-emerald/[.06] px-4 py-1.5 text-[.72rem] font-semibold uppercase tracking-[.16em] text-emerald-soft">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-glow" />
          About
        </span>

        {/* lead */}
        <h1 className="mt-6 font-sora text-[clamp(1.9rem,4.5vw,3rem)] font-extrabold leading-[1.1]">
          I start with what the business needs to be true —
          <span className="text-emerald"> then work backwards to what the user needs to feel.</span>
        </h1>

        <div className="mt-7 space-y-5 text-[1.05rem] leading-relaxed text-[#cfe3da]">
          <p>
            I started in agriculture — literally. A{" "}
            <b className="text-white">B.Sc. in Agricultural Administration</b>, then COO of an
            EdTech that scaled to <b className="text-white">9,000+ users</b> across West Africa
            with no playbook to copy. That zero-to-one taught me the thing I still build on: start
            with what the business needs to be true, then work backwards to the user.
          </p>
          <p>
            Today I&apos;m a product lead with <b className="text-white">4+ years</b> scaling B2B
            SaaS in emerging markets. My job isn&apos;t to ship features — it&apos;s to find the
            problem worth solving and chase the outcome that proves it.
          </p>
          <p>
            At QShop, onboarding was leaking <b className="text-white">70% of new businesses</b>.
            I didn&apos;t add more onboarding — I redesigned the activation flow through
            hypothesis-driven testing and got drop-off to <b className="text-white">45%</b>, which
            compounded across activation, retention, and revenue. That same instinct scaled the
            portfolio to <b className="text-white">59,700+ businesses</b> and{" "}
            <b className="text-white">$5.2M GMV</b>.
          </p>
          <p>
            The hard part was never the building. It was deciding what{" "}
            <span className="text-white">not</span> to build — killing the twenty requests that
            didn&apos;t earn their place so the few that mattered could land.
          </p>
        </div>

        {/* still a builder */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[.02] p-7">
          <h2 className="font-sora text-xl font-bold text-white">Still a builder.</h2>
          <p className="mt-3 leading-relaxed text-[#cfe3da]">
            I ship fast, validate before I spend engineering, and kill what doesn&apos;t work. And
            I don&apos;t just direct the build — I build the tools that build the products. Over the
            years that&apos;s turned into a whole workshop: a system of{" "}
            <b className="text-white">13 custom dev-workflow skills</b> and automations I use to
            ship solo at team speed.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {builds.map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/10 bg-white/[.03] px-3 py-1 text-xs text-emerald-soft"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* timeline */}
        <h2 className="mt-14 font-sora text-xl font-bold text-white">The path here</h2>
        <div className="mt-6 space-y-6">
          {timeline.map((t) => (
            <div key={t.role} className="relative border-l border-white/10 pl-6">
              <span className="absolute -left-[6px] top-1.5 h-3 w-3 rounded-full bg-emerald shadow-glow" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h3 className="font-semibold text-white">{t.role}</h3>
                <span className="text-xs text-muted">{t.when}</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#cfe3da]">{t.note}</p>
            </div>
          ))}
        </div>

        {/* close + CTAs */}
        <div className="mt-14 rounded-3xl border border-emerald/20 bg-emerald/[.06] p-7 text-center">
          <p className="text-lg text-white">
            Now I&apos;m after the next hard problem — senior product roles where structured
            judgment meets prototyping speed.
          </p>
          <p className="mt-2 text-sm text-muted">
            I&apos;m also starting to write about it —{" "}
            <Link href="/musings" className="text-emerald-soft underline-offset-4 hover:underline">
              Musings
            </Link>{" "}
            is on the way.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setContactOpen(true)}
              className="rounded-2xl bg-emerald px-6 py-3 font-semibold text-[#06150f] shadow-glow transition hover:-translate-y-0.5"
            >
              Let&apos;s talk →
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 bg-white/[.02] px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:border-emerald"
            >
              ⬇ Résumé
            </a>
          </div>
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </main>
  );
}
