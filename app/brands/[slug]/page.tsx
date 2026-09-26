import type { Metadata } from "next";
import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpecNav from "@/components/SpecNav";
import BrandImage from "@/components/brands/BrandImage";
import BrandLightbox from "@/components/brands/BrandLightbox";
import { allBrandSlugs, getBrands } from "@/lib/brandsCms";
import { getSiteSettings } from "@/lib/siteSettings";
import { splitLines } from "@/lib/specText";

export const dynamic = "force-dynamic";

export function generateStaticParams() { return allBrandSlugs().map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = (await getBrands()).find(b => b.slug === slug);
  return brand ? { title: `${brand.name} · Brand Design · Olamide Irojah`, description: brand.intro } : { title: "Brand not found" };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Heading typed with line breaks in Studio → one <br /> per line, optional italic second line. */
function Lines({ text, italicRest = false }: { text: string; italicRest?: boolean }) {
  const [first, ...rest] = splitLines(text);
  return <>{first}{rest.length > 0 && <><br />{italicRest ? <em>{rest.join(" ")}</em> : rest.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)}</>}</>;
}

export default async function BrandCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [brands, s] = await Promise.all([getBrands(), getSiteSettings()]);
  const c = s.copy;
  const index = brands.findIndex(b => b.slug === slug);
  if (index < 0) notFound();
  const brand = brands[index];
  const next = brands[(index + 1) % brands.length];
  return <div className={`brand-case brand-case-${slug}`} style={{ "--brand-accent": brand.accent, "--brand-paper": brand.paper, "--brand-ink": brand.ink } as CSSProperties}>
    <SpecNav back={{ href: "/brands", label: "← All identities" }} />
    <main>
      <header className="brand-case-header brand-wrap">
        <div className="brand-eyebrow-row"><span className="brand-label">Identity study / {pad(index + 1)}</span><span className="brand-label">{brand.sector}{brand.year && ` · ${brand.year}`}</span></div>
        <p className="brand-case-name">{brand.name}</p>
        <h1>{splitLines(brand.headline).map((line, i) => <span key={line}>{i === 1 ? <em>{line}</em> : line}</span>)}</h1>
        <div className="brand-case-summary"><span className="brand-label">{c.brandCaseSummaryLabel}</span><p>{brand.line}</p></div>
      </header>
      <div className="brand-case-cover"><BrandImage asset={`${slug}/hero`} pic={brand.pics.hero} alt={`${brand.name} hero application mockup`} priority sizes="100vw" /></div>
      <section className="brand-story brand-wrap" id="story">
        <div className="brand-chapter"><span className="brand-label">01 / {c.brandContextLabel}</span><h2><Lines text={c.brandContextTitle} /></h2></div>
        <div className="brand-story-copy"><p>{brand.intro}</p><dl className="brand-facts"><div><dt>Design</dt><dd>{brand.facts.design}</dd></div><div><dt>Studio credit</dt><dd>{brand.facts.credit}</dd></div><div><dt>Discipline</dt><dd>{brand.facts.discipline}</dd></div></dl></div>
      </section>
      <section className="brand-idea">
        <div className="brand-wrap brand-idea-inner"><div><span className="brand-label">02 / {c.brandIdeaLabel}</span><h2>{brand.idea}</h2><p>{brand.ideaBody}</p></div><div className="brand-mark"><BrandImage asset={`${slug}/mark`} pic={brand.pics.mark} alt={`${brand.name} original brand mark from the identity guidelines`} sizes="(max-width: 760px) 90vw, 45vw" /></div></div>
      </section>
      <section className="brand-system brand-wrap">
        <div className="brand-system-intro"><span className="brand-label">03 / {c.brandSystemLabel}</span><h2>{brand.type}</h2><p>{brand.typeBody}</p></div>
        <div className="brand-colours" aria-label={`${brand.name} colour palette`}>{brand.colours.map(colour => <div key={colour.hex} style={{background:colour.hex,color:colour.ink}}><span>{colour.name}</span><span>{colour.hex}</span></div>)}</div>
        <div className="brand-type-panel"><span className="brand-label">{c.brandTypeLabel}</span><BrandImage asset={`${slug}/type`} pic={brand.pics.type} alt={`${brand.name} original typography specimens from the brand guide`} sizes="90vw" /></div>
      </section>
      <section className="brand-applications brand-wrap">
        <div className="brand-section-rule"><span className="brand-label">04 / {c.brandWorldLabel}</span><span className="brand-label">{c.brandWorldNote}</span></div>
        <h2><Lines text={c.brandWorldTitle} italicRest /></h2>
        <div className="brand-application-grid">{brand.images.map((img, i) => <BrandLightbox key={img.key || i} asset={`${slug}/${img.key}`} pic={img.pic} alt={img.alt} caption={img.caption} />)}</div>
      </section>
      <section className="brand-delivery brand-wrap"><div><span className="brand-label">05 / {c.brandDeliveryLabel}</span><h2><Lines text={c.brandDeliveryTitle} /></h2></div><ul>{brand.scope.map(item => <li key={item}>{item}<span aria-hidden="true">↗</span></li>)}</ul></section>
      <footer className="brand-next"><Link href={`/brands/${next.slug}`} className="brand-wrap"><div><span className="brand-label">Next identity / {pad((index + 1) % brands.length + 1)}</span><h2>{next.name}<span aria-hidden="true">↗</span></h2><p>{next.line}</p></div><BrandImage asset={`${next.slug}/hero`} pic={next.pics.hero} alt={`${next.name} identity preview`} sizes="(max-width: 760px) 90vw, 30vw" /></Link><div className="brand-wrap brand-footer-bottom"><Link href="/brands">← Back to the collection</Link><span>{c.brandsSignature}</span></div></footer>
    </main>
  </div>;
}
