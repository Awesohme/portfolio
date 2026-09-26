import Link from "next/link";
import BrandImage from "@/components/brands/BrandImage";
import SpecMotion from "@/components/SpecMotion";
import SpecTagline from "@/components/SpecTagline";
import SpecNav from "@/components/SpecNav";
import SpecSocials from "@/components/SpecSocials";
import SpecToolField from "@/components/SpecToolField";
import { getProjects } from "@/lib/projectsCms";
import { getSiteSettings } from "@/lib/siteSettings";
import { getBrands } from "@/lib/brandsCms";
import { splitLines } from "@/lib/specText";

export const dynamic = "force-dynamic";

export default async function SpecHome() {
  const [projects, s, brands] = await Promise.all([getProjects(), getSiteSettings(), getBrands()]);
  const c = s.copy;
  const teaserBrand = brands[0];
  const [teaserA, ...teaserRest] = splitLines(c.brandTeaserTitle);
  // split for §04: product cases primary, tool/personal builds in "Also built"
  const productCases = projects.filter((p) => p.category === "product" && p.status !== "discovery");
  const discoveryCases = projects.filter((p) => p.status === "discovery");
  const toolCases = projects.filter((p) => p.category === "tool");

  return (
    <>
      <SpecToolField />
      <main className="spec-doc editorial-home">
        <SpecMotion />
        <SpecNav />

      <div className="spec-hero">
        <div className="spec-doctype">{c.homeEyebrow}</div>
        <h1 className="spec-name">
          <span>Olamide</span>
          <span className="editorial-muted">Irojah</span>
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
        <p className="editorial-intro">
          {s.heroThesis}
        </p>
        <SpecTagline prefix={c.taglinePrefix} words={c.taglineWords} />
        {s.show.shipped && <a href="#shipped" className="editorial-explore">{c.exploreWorkLabel} <span aria-hidden="true">↘</span></a>}
      </div>

      {s.show.problem && (
      <section className="spec-sec spec-reveal editorial-context">
        <div className="ln">01</div>
        <div className="body">
          <h2>
            <span className="n">01 ·</span> {c.problemTitle}
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
            <span className="n">02 ·</span> {c.betTitle}
          </h2>
          <div className="spec-lead">{s.betLead}</div>
          <p>{s.betBody}</p>
        </div>
      </section>
      )}

      {s.show.outcome && (
      <section className="spec-sec spec-reveal editorial-outcomes">
        <div className="ln">03</div>
        <div className="body">
          <h2>
            <span className="n">03 ·</span> {c.outcomeTitle}
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
            <span className="n">04 ·</span> {c.selectedWorkTitle}
          </h2>
          <div className="spec-lead" style={{ marginBottom: 8 }}>
            {c.selectedWorkLead}
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
            <h2>{c.discoveryTitle}</h2>
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
            <span className="n">05 ·</span> {c.alsoBuiltTitle}
          </h2>
          <div className="spec-lead" style={{ marginBottom: 8 }}>
            {c.alsoBuiltLead}
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

      <section className="editorial-brand-feature" aria-labelledby="brand-feature-title">
        <div className="editorial-brand-copy">
          <span className="spec-doctype">{c.brandTeaserEyebrow}</span>
          <h2 id="brand-feature-title">{teaserA}{teaserRest.length > 0 && <><br /><em>{teaserRest.join(" ")}</em></>}</h2>
          <p>{c.brandTeaserBody}</p>
          <Link href="/brands" className="editorial-text-link">{c.brandTeaserLink} <span aria-hidden="true">↗</span></Link>
        </div>
        <Link href="/brands" className="editorial-brand-visual" aria-label="Explore the brand identity collection">
          {teaserBrand && <BrandImage asset={`${teaserBrand.slug}/hero`} pic={teaserBrand.pics.hero} alt={teaserBrand.heroAlt} sizes="(max-width: 760px) 100vw, 55vw" />}
          <span>{c.brandTeaserImageLabel} / 01—{String(brands.length).padStart(2, "0")} <span aria-hidden="true">↗</span></span>
        </Link>
      </section>

      <div className="spec-signoff spec-reveal">
        {s.show.signoff && (
        <div className="spec-lead">
          {s.signoffText}
        </div>
        )}
        <div className="spec-cta">
          {s.show.contact && <a href={`mailto:${s.email}?subject=${encodeURIComponent("Product opportunity")}`} className="spec-btn spec-btn-fill">{s.contactCtaLabel} →</a>}
          <Link href="/about" className="spec-btn spec-btn-grey">
            {c.backgroundCtaLabel} →
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
