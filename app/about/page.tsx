import Link from "next/link";
import Image from "next/image";
import SpecMotion from "@/components/SpecMotion";
import SpecNav from "@/components/SpecNav";
import SpecProse from "@/components/SpecProse";
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
      <SpecNav back={{ href: "/", label: "← Back to home" }} />

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
              <SpecProse content={s.aboutOrigin} />
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
          <SpecProse content={s.aboutOperatingInstinct} />
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
                  <div style={{ margin: "8px 0 0", fontFamily: "var(--font-grotesk)", color: "#3b372e", lineHeight: 1.55, fontWeight: 400 }}>
                    <SpecProse content={t.note} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      <div className="spec-signoff spec-reveal">
        {s.show.signoff && (
        <div className="spec-lead">
          {s.signoffText}
        </div>
        )}
        <div className="spec-cta">
          <Link href="/" className="spec-btn spec-btn-fill">
            ← Back to home
          </Link>
          {s.show.resume && (
            <a href={s.resumeUrl} target="_blank" rel="noopener noreferrer" className="spec-btn spec-btn-out" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Résumé.pdf
            </a>
          )}
        </div>
        <div className="spec-stamp">
          SIGNED · {s.fullName.toUpperCase()} · {s.jobTitle.toUpperCase()} · {s.email}
        </div>
        {s.show.socials && (
          <SpecSocials className="spec-stamp-socials" github={s.githubUrl} linkedin={s.linkedinUrl} />
        )}
      </div>
    </main>
  );
}
