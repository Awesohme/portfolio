import Link from "next/link";
import SpecNav from "@/components/SpecNav";
import { getMusings } from "@/lib/musings";
import { getSiteSettings } from "@/lib/siteSettings";

export const metadata = {
  title: "Musings · Spec · Olamide Irojah",
  description: "Notes on product, building, and the hard part: deciding what not to build. Coming soon.",
};

// always render fresh so edits published in Strapi show up on refresh
export const dynamic = "force-dynamic";

export default async function SpecMusings() {
  const [drafts, s] = await Promise.all([getMusings(), getSiteSettings()]);

  return (
    <main className="spec-doc">
      <SpecNav back={{ href: "/", label: "← Back to home" }} />

      <div className="spec-hero">
        <div className="spec-doctype">Writing · drafts in the pipeline</div>
        <h1 className="spec-name" style={{ fontSize: "clamp(1.9rem,5vw,3.4rem)", lineHeight: 1.04 }}>
          Musings.
          <br />
          Shipping soon.
        </h1>
        <p style={{ marginTop: 22, maxWidth: "52ch", color: "#3b372e", lineHeight: 1.6 }}>
          Short notes on product, building, and the hard part: deciding what <i>not</i> to build. Treated
          like any other backlog, written when the idea has earned its place.
        </p>
      </div>

      <section className="spec-sec">
        <div className="ln">01</div>
        <div className="body">
          <h2>
            <span className="n">01 ·</span> Drafts
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
        <div className="spec-cta" style={{ flexDirection: "column" }}>
          <a
            href={`mailto:${s.email}`}
            className="spec-btn spec-btn-fill"
            style={{ textAlign: "center", width: "100%" }}
          >
            ✉ Get Notified
          </a>
          <Link href="/" className="spec-btn spec-btn-out" style={{ textAlign: "center", width: "100%" }}>
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
