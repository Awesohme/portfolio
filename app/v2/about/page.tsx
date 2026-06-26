import Link from "next/link";
import Image from "next/image";
import SpecMotion from "@/components/SpecMotion";
import SpecNav from "@/components/SpecNav";
import SpecSocials from "@/components/SpecSocials";
import { getExperience } from "@/lib/experience";
import { getSiteSettings } from "@/lib/siteSettings";

export const metadata = {
  title: "Background · Spec · Olamide Irojah",
  description:
    "Product Manager who starts with the user's problem, then builds the business around it. 4+ years scaling B2B SaaS in emerging markets.",
};

// fetch the timeline fresh so Strapi edits appear on refresh
export const dynamic = "force-dynamic";

export default async function SpecAbout() {
  const [timeline, s] = await Promise.all([getExperience(), getSiteSettings()]);

  return (
    <main className="spec-doc">
      <SpecMotion />
      <SpecNav back={{ href: "/v2", label: "← Back to home" }} />

      <div className="spec-hero">
        <div className="spec-doctype">Background · the path here</div>
        <h1 className="spec-name" style={{ fontSize: "clamp(1.7rem,4.4vw,3.2rem)", lineHeight: 1.04 }}>
          {s.aboutHero}
        </h1>
      </div>

      <section className="spec-sec spec-reveal">
        <div className="ln">00</div>
        <div className="body">
          <h2>
            <span className="n">00 ·</span> Origin
          </h2>
          <div className={`spec-origin${s.show.profileImage ? "" : " spec-origin--noimage"}`}>
            <div className="spec-origin-text">
              <p>{s.aboutOrigin}</p>
            </div>
            {s.show.profileImage && (
              <figure className="spec-idcard">
                <span className="spec-id-clip" aria-hidden="true">
                  <span className="spec-id-hole" />
                </span>
                <div className="spec-id-body">
                  <div className="spec-id-top">
                    <span className="spec-id-org">OLAMIDE_IROJAH</span>
                    <span className="spec-id-no">ID · PM-001</span>
                  </div>
                  <Image
                    src={s.profileImageUrl}
                    alt="Olamide Irojah"
                    width={1024}
                    height={1024}
                    priority
                    className="spec-id-photo"
                  />
                  <figcaption className="spec-id-info">
                    <b>Olamide Irojah</b>
                    <span className="role">Product Manager</span>
                    <span className="stat">
                      <span className="d" />
                      STATUS · AVAILABLE
                    </span>
                  </figcaption>
                </div>
              </figure>
            )}
          </div>
        </div>
      </section>

      <section className="spec-sec spec-reveal">
        <div className="ln">01</div>
        <div className="body">
          <h2>
            <span className="n">01 ·</span> Operating instinct
          </h2>
          <div className="spec-lead">The hard part was never the building.</div>
          <p>{s.aboutOperatingInstinct}</p>
          <p>
            Honestly, the part I love is the people. I enjoy sitting with users, understanding their
            problems, and learning more than I expect to, then turning that into how we&apos;ll actually
            solve it without ever losing sight of the business we&apos;re trying to build. And
            I&apos;m always watching the industry: spotting trends, noticing patterns, connecting dots other
            people walk past. That&apos;s the work I&apos;d do for free.
          </p>
        </div>
      </section>

      {s.show.timeline && (
      <section className="spec-sec spec-reveal">
        <div className="ln">02</div>
        <div className="body">
          <h2>
            <span className="n">02 ·</span> Changelog
          </h2>
          <div className="spec-otable" style={{ maxWidth: "100%", marginTop: 18 }}>
            {timeline.map((t) => (
              <div className="spec-orow" key={t.role} style={{ gridTemplateColumns: "1fr", alignItems: "start" }}>
                <div className="k" style={{ borderRight: "none", color: "var(--ink)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <b style={{ fontFamily: "var(--font-grotesk)" }}>{t.role}</b>
                    <span style={{ color: "var(--accent)" }}>{t.when}</span>
                  </div>
                  <p style={{ margin: "8px 0 0", fontFamily: "var(--font-grotesk)", color: "#3b372e", lineHeight: 1.55, fontWeight: 400 }}>
                    {t.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      <div className="spec-signoff spec-reveal">
        <div className="spec-lead">
          Now I&apos;m after the next hard problem. A team that wants a PM who&apos;ll do the thinking and
          ship the prototype to prove it.
        </div>
        <div className="spec-cta">
          <Link href="/v2" className="spec-btn spec-btn-fill">
            ← Back to home
          </Link>
          {s.show.resume && (
            <a href={s.resumeUrl} target="_blank" rel="noopener noreferrer" className="spec-btn spec-btn-out">
              ⬇ Résumé.pdf
            </a>
          )}
        </div>
        <div className="spec-stamp">SIGNED · OLAMIDE IROJAH · PRODUCT MANAGER · irojaholamide@gmail.com</div>
        {s.show.socials && <SpecSocials className="spec-stamp-socials" />}
      </div>
    </main>
  );
}
