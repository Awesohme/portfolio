import Link from "next/link";
import SpecMotion from "@/components/SpecMotion";
import SpecTagline from "@/components/SpecTagline";
import SpecNav from "@/components/SpecNav";
import SpecSocials from "@/components/SpecSocials";
import SpecToolField from "@/components/SpecToolField";
import { getProjects } from "@/lib/projectsCms";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";

export default async function SpecHome() {
  const [projects, s] = await Promise.all([getProjects(), getSiteSettings()]);
  // split for §04: product cases primary, tool/personal builds in "Also built"
  const productCases = projects.filter((p) => p.category === "product" && p.status !== "discovery");
  const discoveryCases = projects.filter((p) => p.status === "discovery");
  const toolCases = projects.filter((p) => p.category === "tool");

  return (
    <>
      <SpecToolField />
      <main className="spec-doc">
        <SpecMotion />
        <SpecNav />

      <div className="spec-hero">
        <div className="spec-doctype">Product Requirements Document · Self</div>
        <h1 className="spec-name">
          Olamide
          <br />
          Irojah
        </h1>
        <div className="spec-meta-row">
          <span>
            ROLE · <b>{s.jobTitle}</b>
          </span>
          <span>
            EXP · <b>{s.heroExperience}</b>
          </span>
          <span>
            MARKET · <b>{s.heroMarket}</b>
          </span>
          <span>
            STATUS · <b>{s.heroStatus}</b>
          </span>
        </div>
        <p
          style={{
            marginTop: 18,
            maxWidth: "62ch",
            color: "#3b372e",
            lineHeight: 1.6,
            fontSize: "1.02rem",
          }}
        >
          {s.heroThesis}
        </p>
        <SpecTagline />
      </div>

      {s.show.problem && (
      <section className="spec-sec spec-reveal">
        <div className="ln">01</div>
        <div className="body">
          <h2>
            <span className="n">01 ·</span> Problem
          </h2>
          <div className="spec-lead">{s.problemLead}</div>
          <p>{s.problemBody}</p>
        </div>
      </section>
      )}

      {s.show.bet && (
      <section className="spec-sec spec-reveal">
        <div className="ln">02</div>
        <div className="body">
          <h2>
            <span className="n">02 ·</span> Bet
          </h2>
          <div className="spec-lead">{s.betLead}</div>
          <p>{s.betBody}</p>
        </div>
      </section>
      )}

      {s.show.outcome && (
      <section className="spec-sec spec-reveal">
        <div className="ln">03</div>
        <div className="body">
          <h2>
            <span className="n">03 ·</span> Outcome
          </h2>
          <div className="spec-lead">{s.outcomeLead}</div>
          <div className="spec-otable">
            {s.outcomeMetrics.map((metric, i) => (
              <div className="spec-orow" key={metric._key || i}>
                <div className="k">{metric.label}</div>
                <div className="v"><span>{metric.value}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {s.show.shipped && (
      <>
      <section id="shipped" className="spec-sec spec-reveal" style={{ scrollMarginTop: 72 }}>
        <div className="ln">04</div>
        <div className="body" style={{ paddingBottom: 0 }}>
          <h2>
            <span className="n">04 ·</span> Selected work
          </h2>
          <div className="spec-lead" style={{ marginBottom: 8 }}>
            Product decisions, delivery, and the work behind them.
          </div>
        </div>
      </section>

      <div className="spec-windex">
        {productCases.map((p, i) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="wrow">
            <span className="id">{String(i + 1).padStart(2, "0")}</span>
            <div className="nm">
              {p.name}
              <small>
                {p.roleLabel} · {p.period}
              </small>
            </div>
            <span className="out">{p.summary ?? p.tag} →</span>
          </Link>
        ))}
      </div>
      </>
      )}

      {s.show.shipped && discoveryCases.length > 0 && (
        <section className="spec-sec spec-reveal">
          <div className="ln">↗</div>
          <div className="body">
            <h2>In discovery</h2>
            {discoveryCases.map(p => (
              <p key={p.slug}><Link href={`/work/${p.slug}`}><b>{p.name} →</b></Link><br />{p.tagline}</p>
            ))}
          </div>
        </section>
      )}

      {s.show.alsoBuilt && toolCases.length > 0 && (
      <>
      {/* Also built — tools & experiments (kept distinct from the product cases) */}
      <section className="spec-sec spec-reveal">
        <div className="ln">05</div>
        <div className="body" style={{ paddingBottom: 0 }}>
          <h2>
            <span className="n">05 ·</span> Also built
          </h2>
          <div className="spec-lead" style={{ marginBottom: 8 }}>
            Side projects, tools, and systems I have shipped along the way.
          </div>
        </div>
      </section>

      <div className="spec-windex">
        {toolCases.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className="wrow">
            <span className="id">▦</span>
            <div className="nm">
              {p.name}
              <small>
                {p.roleLabel} · {p.period}
              </small>
            </div>
            <span className="out">{p.summary ?? p.tag} →</span>
          </Link>
        ))}
      </div>
      </>
      )}

      <div className="spec-signoff spec-reveal">
        {s.show.signoff && (
        <div className="spec-lead">
          {s.signoffText}
        </div>
        )}
        <div className="spec-cta">
          {s.show.contact && <a href={`mailto:${s.email}?subject=${encodeURIComponent("Product opportunity")}`} className="spec-btn spec-btn-fill">{s.contactCtaLabel} →</a>}
          <Link href="/about" className="spec-btn spec-btn-fill">
            My Background →
          </Link>
          {s.show.resume && (
            <a href={s.resumeUrl} target="_blank" rel="noopener noreferrer" className="spec-btn spec-btn-out" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {s.resumeCtaLabel}
            </a>
          )}
        </div>
        <div className="spec-stamp">
          SIGNED · {s.fullName.toUpperCase()} · {s.jobTitle.toUpperCase()} · {s.email} · REV 2026.09
        </div>
        {s.show.socials && (
          <SpecSocials className="spec-stamp-socials" github={s.githubUrl} linkedin={s.linkedinUrl} />
        )}
      </div>
      </main>
    </>
  );
}
