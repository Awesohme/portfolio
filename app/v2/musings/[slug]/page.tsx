import Link from "next/link";
import { notFound } from "next/navigation";
import SpecNav from "@/components/SpecNav";
import MusingBody from "@/components/MusingBody";
import ReadProgress from "@/components/ReadProgress";
import { getMusing } from "@/lib/musings";
import { getSiteSettings } from "@/lib/siteSettings";

// always render fresh so edits/publishes in Strapi appear on refresh
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getMusing(slug);
  return {
    title: m ? `${m.title} · Musings · Olamide Irojah` : "Musings · Olamide Irojah",
    description: m?.preview,
  };
}

export default async function MusingPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [m, s] = await Promise.all([getMusing(slug), getSiteSettings()]);
  // only published musings have a readable page
  if (!m || !m.published) notFound();

  return (
    <main className="spec-doc">
      <ReadProgress />
      <SpecNav back={{ href: "/v2/musings", label: "← All musings" }} />

      <div className="spec-hero">
        <div className="spec-doctype">Musings · Olamide Irojah</div>
        <h1 className="spec-name" style={{ fontSize: "clamp(1.9rem,5vw,3.4rem)", lineHeight: 1.05 }}>
          {m.title}
        </h1>
      </div>

      <section className="spec-sec">
        <div className="ln">✺</div>
        <div className="body">
          <MusingBody markdown={m.note} />
        </div>
      </section>

      <div className="spec-signoff">
        <div className="spec-cta" style={{ flexDirection: "column" }}>
          <Link href="/v2/musings" className="spec-btn spec-btn-fill" style={{ textAlign: "center", width: "100%" }}>
            ← All musings
          </Link>
          <a
            href={`mailto:${s.email}`}
            className="spec-btn spec-btn-out"
            style={{ textAlign: "center", width: "100%" }}
          >
            ✉ Get notified of the next one
          </a>
        </div>
        <div className="spec-stamp">
          {s.fullName.toUpperCase()} · {s.jobTitle.toUpperCase()} · {s.email}
        </div>
      </div>
    </main>
  );
}
