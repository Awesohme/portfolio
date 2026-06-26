import Link from "next/link";
import { notFound } from "next/navigation";
import SpecMotion from "@/components/SpecMotion";
import SpecNav from "@/components/SpecNav";
import MikanoReport from "@/components/MikanoReport";
import { getProjects, getProjectBySlug, allProjectSlugs } from "@/lib/projectsCms";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return allProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  return {
    title: p ? `${p.name} · Spec · Olamide Irojah` : "Project · Olamide Irojah",
    description: p?.tagline,
  };
}

export default async function SpecWorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [all, s] = await Promise.all([getProjects(), getSiteSettings()]);
  const p = all.find((x) => x.slug === slug);
  if (!p) notFound();

  const idx = all.findIndex((x) => x.slug === slug);
  const next = all[(idx + 1) % all.length];
  const { sections, features } = p;

  return (
    <main className="spec-doc">
      <SpecMotion />
      <SpecNav back={{ href: "/v2", label: "← Back to home" }} />

      <div className="spec-hero">
        <div className="spec-doctype">
          {p.tag} · {p.roleLabel} · {p.period}
        </div>
        <h1 className="spec-name">{p.name}</h1>
        <div className="spec-meta-row" style={{ marginTop: 22 }}>
          {p.stack.map((s) => (
            <span key={s}>
              <b>{s}</b>
            </span>
          ))}
        </div>
        <p style={{ marginTop: 22, maxWidth: "60ch", color: "#3b372e", lineHeight: 1.6 }}>{p.tagline}</p>
      </div>

      {/* narrative: Problem / What I did / Outcome */}
      {sections.map((sec, i) => (
        <section className="spec-sec spec-reveal" key={i}>
          <div className="ln">{String(i + 1).padStart(2, "0")}</div>
          <div className="body">
            <h2>
              <span className="n">
                {String(i + 1).padStart(2, "0")} ·
              </span>{" "}
              {sec.label}
            </h2>
            <p style={{ marginTop: 10 }}>{sec.body}</p>
          </div>
        </section>
      ))}

      {/* Mikano-only: the image-dimension report it produces */}
      {p.slug === "mikano" && <MikanoReport />}

      {/* features & outcomes */}
      <section className="spec-sec spec-reveal">
        <div className="ln">{String(sections.length + 1).padStart(2, "0")}</div>
        <div className="body">
          <h2>
            <span className="n">{String(sections.length + 1).padStart(2, "0")} ·</span> Features &amp; outcomes
          </h2>
          <div className="spec-otable" style={{ maxWidth: 640, marginTop: 18 }}>
            {features.map((c) => (
              <div className="spec-orow" key={c.name}>
                <div className="k">
                  {c.kind === "outcome" ? "◆ " : "□ "}
                  {c.name}
                </div>
                <div className="v" style={{ color: c.kind === "outcome" ? "var(--accent)" : "var(--ink)" }}>
                  <span>{c.blurb}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, display: "grid", gap: 12, maxWidth: "64ch" }}>
            {features.map((c) => (
              <p key={c.name} style={{ margin: 0, fontSize: ".95rem", color: "#3b372e", lineHeight: 1.55 }}>
                <b style={{ color: "var(--ink)" }}>{c.name}.</b> {c.detail}
              </p>
            ))}
          </div>
        </div>
      </section>

      <div className="spec-signoff spec-reveal">
        <div className="spec-cta">
          {p.link && (
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="spec-btn spec-btn-fill">
              Visit the live product →
            </a>
          )}
          <Link href={`/v2/work/${next.slug}`} className="spec-btn spec-btn-out">
            Next spec · {next.name} →
          </Link>
          <Link href="/v2" className="spec-btn spec-btn-out">
            ← Back to index
          </Link>
        </div>
        <div className="spec-stamp">
          SPEC {String(idx + 1).padStart(2, "0")} · {p.name.toUpperCase()} · {s.fullName.toUpperCase()} · REV 2026.06
        </div>
      </div>
    </main>
  );
}
