import Link from "next/link";
import SpecNav from "@/components/SpecNav";

export const metadata = {
  title: "Musings · Spec · Olamide Irojah",
  description: "Notes on product, building, and the hard part: deciding what not to build. Coming soon.",
};

export default function SpecMusings() {
  return (
    <main className="spec-doc">
      <SpecNav back={{ href: "/v2", label: "← Back to home" }} />

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
            {[
              {
                id: "001",
                title: "On killing features",
                note: "Why saying no to twenty good ideas is the whole job, and how I decide which one survives.",
                status: "drafting",
              },
              {
                id: "002",
                title: "Validate before you build",
                note: "The 48-hour WhatsApp-bot test, and why a prototype beats a PRD when the bet is uncertain.",
                status: "outline",
              },
              {
                id: "003",
                title: "AI-native PM, in practice",
                note: "Shipping solo at team speed: the tools, the workflow, and where judgment still wins.",
                status: "queued",
              },
              {
                id: "004",
                title: "Start from the problem",
                note: "Working backwards from the user's pain to a business, not the other way round.",
                status: "queued",
              },
            ].map((d) => (
              <div className="mus-item" key={d.id}>
                <span className="mus-id">{d.id}</span>
                <div className="mus-body">
                  <div className="mus-title">{d.title}</div>
                  <p className="mus-note">{d.note}</p>
                </div>
                <span className={`mus-status ${d.status}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="spec-signoff">
        <div className="spec-cta" style={{ flexDirection: "column" }}>
          <a
            href="mailto:irojaholamide@gmail.com"
            className="spec-btn spec-btn-fill"
            style={{ textAlign: "center", width: "100%" }}
          >
            ✉ Get Notified
          </a>
          <Link href="/v2" className="spec-btn spec-btn-out" style={{ textAlign: "center", width: "100%" }}>
            ← Back to home
          </Link>
        </div>
        <div className="spec-stamp">OLAMIDE IROJAH · PRODUCT MANAGER · irojaholamide@gmail.com</div>
      </div>
    </main>
  );
}
