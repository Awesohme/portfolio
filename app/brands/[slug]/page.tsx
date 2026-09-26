import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpecNav from "@/components/SpecNav";
import BrandImage from "@/components/brands/BrandImage";
import BrandLightbox from "@/components/brands/BrandLightbox";
import { brands } from "@/lib/brands";

export function generateStaticParams() { return brands.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find(b => b.slug === slug);
  return brand ? { title: `${brand.name} · Brand Design · Olamide Irojah`, description: brand.intro } : { title: "Brand not found" };
}

export default async function BrandCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = brands.findIndex(b => b.slug === slug);
  if (index < 0) notFound();
  const brand = brands[index];
  const next = brands[(index + 1) % brands.length];
  return <div className={`brand-case brand-case-${slug}`} style={{ "--brand-accent": brand.accent, "--brand-paper": brand.paper, "--brand-ink": brand.ink } as CSSProperties}>
    <SpecNav back={{ href: "/brands", label: "← All identities" }} />
    <main>
      <header className="brand-case-header brand-wrap">
        <div className="brand-eyebrow-row"><span className="brand-label">Identity study / 0{index + 1}</span><span className="brand-label">{brand.sector}{brand.year && ` · ${brand.year}`}</span></div>
        <p className="brand-case-name">{brand.name}</p>
        <h1>{brand.headline.split("\n").map((line, i) => <span key={line}>{i === 1 ? <em>{line}</em> : line}</span>)}</h1>
        <div className="brand-case-summary"><span className="brand-label">Visual identity & applications</span><p>{brand.line}</p></div>
      </header>
      <div className="brand-case-cover"><BrandImage asset={`${slug}/hero`} alt={`${brand.name} hero application mockup`} priority sizes="100vw" /></div>
      <section className="brand-story brand-wrap" id="story">
        <div className="brand-chapter"><span className="brand-label">01 / The context</span><h2>A brand with<br />something to say.</h2></div>
        <div className="brand-story-copy"><p>{brand.intro}</p><dl className="brand-facts"><div><dt>Design</dt><dd>Olamide Irojah</dd></div><div><dt>Studio credit</dt><dd>Lightening Growth Consulting</dd></div><div><dt>Discipline</dt><dd>Brand identity</dd></div></dl></div>
      </section>
      <section className="brand-idea">
        <div className="brand-wrap brand-idea-inner"><div><span className="brand-label">02 / The central idea</span><h2>{brand.idea}</h2><p>{brand.ideaBody}</p></div><div className="brand-mark"><BrandImage asset={`${slug}/mark`} alt={`${brand.name} original brand mark from the identity guidelines`} sizes="(max-width: 760px) 90vw, 45vw" /></div></div>
      </section>
      <section className="brand-system brand-wrap">
        <div className="brand-system-intro"><span className="brand-label">03 / The visual language</span><h2>{brand.type}</h2><p>{brand.typeBody}</p></div>
        <div className="brand-colours" aria-label={`${brand.name} colour palette`}>{brand.colours.map(colour => <div key={colour.hex} style={{background:colour.hex,color:colour.ink}}><span>{colour.name}</span><span>{colour.hex}</span></div>)}</div>
        <div className="brand-type-panel"><span className="brand-label">The typographic voice</span><BrandImage asset={`${slug}/type`} alt={`${brand.name} original typography specimens from the brand guide`} sizes="90vw" /></div>
      </section>
      <section className="brand-applications brand-wrap">
        <div className="brand-section-rule"><span className="brand-label">04 / In the world</span><span className="brand-label">Application mockups</span></div>
        <h2>An idea you<br /><em>can put your hands on.</em></h2>
        <div className="brand-application-grid">{brand.images.map(img => <BrandLightbox key={img.key} asset={`${slug}/${img.key}`} alt={img.alt} caption={img.caption} />)}</div>
      </section>
      <section className="brand-delivery brand-wrap"><div><span className="brand-label">05 / The identity, delivered</span><h2>From the core idea<br />to the smallest detail.</h2></div><ul>{brand.scope.map(item => <li key={item}>{item}<span aria-hidden="true">↗</span></li>)}</ul></section>
      <footer className="brand-next"><Link href={`/brands/${next.slug}`} className="brand-wrap"><div><span className="brand-label">Next identity / 0{(index + 1) % brands.length + 1}</span><h2>{next.name}<span aria-hidden="true">↗</span></h2><p>{next.line}</p></div><BrandImage asset={`${next.slug}/hero`} alt={`${next.name} identity preview`} sizes="(max-width: 760px) 90vw, 30vw" /></Link><div className="brand-wrap brand-footer-bottom"><Link href="/brands">← Back to the collection</Link><span>Olamide Irojah · Brand design</span></div></footer>
    </main>
  </div>;
}
