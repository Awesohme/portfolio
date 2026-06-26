import Link from "next/link";
import Image from "next/image";
import SpecMotion from "@/components/SpecMotion";
import SpecNav from "@/components/SpecNav";
import SpecSocials from "@/components/SpecSocials";
import { getExperience } from "@/lib/experience";

export const metadata = {
  title: "Background · Spec · Olamide Irojah",
  description:
    "Product Manager who starts with the user's problem, then builds the business around it. 4+ years scaling B2B SaaS in emerging markets.",
};

// fetch the timeline fresh so Strapi edits appear on refresh
export const dynamic = "force-dynamic";

export default async function SpecAbout() {
  const timeline = await getExperience();

  return (
    <main className="spec-doc">
      <SpecMotion />
      <SpecNav back={{ href: "/v2", label: "← Back to home" }} />

      <div className="spec-hero">
        <div className="spec-doctype">Background · the path here</div>
        <h1 className="spec-name" style={{ fontSize: "clamp(1.7rem,4.4vw,3.2rem)", lineHeight: 1.04 }}>
          Start with the user&apos;s problem.
          <br />
          Build the business around it.
        </h1>
      </div>

      <section className="spec-sec spec-reveal">
        <div className="ln">00</div>
        <div className="body">
          <h2>
            <span className="n">00 ·</span> Origin
          </h2>
          <div className="spec-origin">
            <div className="spec-origin-text">
              <p>
                I started in agriculture. Literally, a <mark>B.Sc. in Agricultural Administration</mark>.
                Then I became COO of an EdTech and scaled it to <b>9,000+ users</b> across West Africa with
                no playbook to copy. That zero-to-one taught me the thing I still build on: start with the
                user&apos;s problem, then build the business around it.
              </p>
              <p>
                These days I&apos;m a product manager with <b>4+ years</b> scaling B2B SaaS in emerging
                markets. I don&apos;t measure myself by features shipped. I measure myself by whether I found
                the problem worth solving and moved the number that proves it.
              </p>
            </div>
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
                  src="/olamide.jpg"
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
          <p>
            It was deciding what <i>not</i> to build. The real work is killing the twenty requests that
            didn&apos;t earn their place so the few that matter can actually land. I ship fast, validate
            before I spend a team&apos;s engineering, and I build the tools that build the products too, a
            little workshop of <b>13 custom dev-workflow skills</b> I use to ship solo at team speed.
          </p>
          <p>
            Honestly, the part I love is the people. I enjoy sitting with users, understanding their
            problems, and learning more than I expect to, then turning that into how we&apos;ll actually
            solve it without ever losing sight of the business we&apos;re trying to build. And
            I&apos;m always watching the industry: spotting trends, noticing patterns, connecting dots other
            people walk past. That&apos;s the work I&apos;d do for free.
          </p>
        </div>
      </section>

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

      <div className="spec-signoff spec-reveal">
        <div className="spec-lead">
          Now I&apos;m after the next hard problem. A team that wants a PM who&apos;ll do the thinking and
          ship the prototype to prove it.
        </div>
        <div className="spec-cta">
          <Link href="/v2" className="spec-btn spec-btn-fill">
            ← Back to home
          </Link>
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="spec-btn spec-btn-out">
            ⬇ Résumé.pdf
          </a>
        </div>
        <div className="spec-stamp">SIGNED · OLAMIDE IROJAH · PRODUCT MANAGER · irojaholamide@gmail.com</div>
        <SpecSocials className="spec-stamp-socials" />
      </div>
    </main>
  );
}
