import Link from "next/link";
import SpecNav from "@/components/SpecNav";
import NotifyButton from "@/components/NotifyButton";
import { getMusings } from "@/lib/musings";
import { Fragment } from "react";
import { getSiteSettings, notifyProps } from "@/lib/siteSettings";
import { splitLines } from "@/lib/specText";

export const metadata = {
  title: "Musings · Spec · Olamide Irojah",
  description: "Notes on product, building, and the hard part: deciding what not to build. ",
};

// always render fresh so edits published in Strapi show up on refresh
export const dynamic = "force-dynamic";

export default async function SpecMusings() {
  const [drafts, s] = await Promise.all([getMusings(), getSiteSettings()]);
  const c = s.copy;
  const [titleA, ...titleRest] = splitLines(c.musingsTitle);

  return (
    <main className="spec-doc editorial-musings">
      <SpecNav back={{ href: "/", label: "← Back to home" }} />

      <div className="spec-hero">
        <div className="spec-doctype">{c.musingsEyebrow}</div>
        <h1 className="spec-name">
          <span>{titleA}</span>
          {titleRest.length > 0 && <span className="editorial-muted">{titleRest.join(" ")}</span>}
        </h1>
        <p style={{ marginTop: 22, maxWidth: "52ch", color: "#3b372e", lineHeight: 1.6 }}>
          {/* *word* in Studio → italics */}
          {c.musingsIntro.split(/\*([^*]+)\*/).map((part, i) => (i % 2 ? <i key={i}>{part}</i> : <Fragment key={i}>{part}</Fragment>))}
        </p>
      </div>

      <section className="spec-sec">
        <div className="ln">01</div>
        <div className="body">
          <h2>
            <span className="n">01 ·</span> {c.musingsNotebookTitle}
          </h2>
          <div className="mus-list">
            {drafts.map((d, i) => {
              const pill = (
                <span
                  className={`mus-status ${d.stage}`}
                  style={d.hex ? { background: d.hex, color: "var(--ink)" } : undefined}
                >
                  {d.stage}
                </span>
              );
              // a published musing is a real readable post → preview + Read link
              if (d.published) {
                return (
                  <Link href={`/musings/${d.slug}`} className="mus-item mus-item--read" key={`${d.order}-${i}`}>
                    <span className="mus-id">{String(d.order).padStart(3, "0")}</span>
                    <div className="mus-body">
                      <div className="mus-title">{d.title}</div>
                      <p className="mus-note">{d.preview}</p>
                      <span className="mus-read">Read →</span>
                    </div>
                    {pill}
                  </Link>
                );
              }
              // drafts: just the note line, no link (nothing to read yet)
              return (
                <div className="mus-item" key={`${d.order}-${i}`}>
                  <span className="mus-id">{String(d.order).padStart(3, "0")}</span>
                  <div className="mus-body">
                    <div className="mus-title">{d.title}</div>
                    <p className="mus-note">{d.note}</p>
                  </div>
                  {pill}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="spec-signoff">
        <div className="spec-cta editorial-paired-actions">
          <NotifyButton
            {...notifyProps(s)}
            className="spec-btn spec-btn-fill"
            style={{ textAlign: "center", border: "none", cursor: "pointer" }}
          />
          <Link href="/" className="spec-btn spec-btn-out" style={{ textAlign: "center" }}>
            ← Back to home
          </Link>
        </div>
        <div className="spec-stamp">
          {s.fullName.toUpperCase()} · {s.jobTitle.toUpperCase()} · {s.email}
        </div>
      </div>
    </main>
  );
}
