import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import SpecNav from "@/components/SpecNav";
import Arrow from "@/components/Arrow";
import BrandImage from "@/components/brands/BrandImage";
import { getBrands } from "@/lib/brandsCms";
import { getSiteSettings } from "@/lib/siteSettings";
import { splitLines } from "@/lib/specText";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brand Design · Olamide Irojah",
  description: "Five distinct identities across community, sportswear, fashion, and technology. Brand design by Olamide Irojah.",
};

const pad = (n: number) => String(n).padStart(2, "0");

export default async function BrandsPage() {
  const [brands, s] = await Promise.all([getBrands(), getSiteSettings()]);
  const c = s.copy;
  const [titleA, ...titleRest] = splitLines(c.brandsTitle);
  const noteLines = splitLines(c.brandsNoteTitle);
  const [footA, ...footRest] = splitLines(c.brandsFooterTitle);
  return <>
    <SpecNav back={{ href: "/", label: "Olamide Irojah", arrow: "up-right" }} />
    <main id="brand-main">
      <header className="brand-gallery-hero brand-wrap">
        <div className="brand-eyebrow-row"><span className="brand-label">{c.brandsEyebrow}</span><span className="brand-label">{c.brandsCountLabel} / 01—{pad(brands.length)}</span></div>
        <h1>{titleA}{titleRest.length > 0 && <><br /><span>{titleRest.join(" ")}</span></>}<sup aria-hidden="true">*</sup></h1>
        <div className="brand-hero-bottom"><p>{splitLines(c.brandsIntro).map((l, i) => <Fragment key={i}>{i > 0 && <br />}{l}</Fragment>)}</p><a href="#identities" className="brand-round-link">{c.brandsExploreLabel} <span aria-hidden="true"><Arrow dir="down" /></span></a></div>
      </header>
      <section id="identities" className="brand-wrap brand-gallery" aria-label="Selected brand identities">
        <div className="brand-section-rule"><span className="brand-label">{c.brandsCollectionLabel}</span><span className="brand-label">{c.brandsCollectionNote}</span></div>
        <div className="brand-project-grid">
          {brands.map((brand, i) => <article key={brand.slug} className={`brand-project brand-project-${i + 1}`}>
            <Link href={`/brands/${brand.slug}`} className="brand-project-link" aria-label={`Explore ${brand.name} case study`}>
              <div className="brand-project-art" style={{background:brand.paper}}>
                <BrandImage asset={`${brand.slug}/hero`} pic={brand.pics.hero} alt={brand.heroAlt} priority={i === 0} sizes={i === 0 || i === 3 ? "95vw" : "(max-width: 760px) 100vw, 60vw"} />
                <span className="brand-project-open" aria-hidden="true">View identity&nbsp;<Arrow dir="up-right" /></span>
              </div>
              <div className="brand-project-meta"><div><span className="brand-label">{pad(i + 1)} / {brand.sector}</span><h2>{brand.name}</h2><p>{brand.line}</p></div><span className="brand-project-arrow" aria-hidden="true"><Arrow dir="up-right" /></span></div>
            </Link>
          </article>)}
          <aside className="brand-gallery-note"><span className="brand-label">{c.brandsNoteLabel}</span><p>{noteLines.map((l, i) => <Fragment key={i}>{i > 0 && <br />}{i === noteLines.length - 1 && noteLines.length > 1 ? <em>{l}</em> : l}</Fragment>)}</p><span>{c.brandsNoteBody}</span></aside>
        </div>
      </section>
      <section className="brand-about-strip brand-wrap"><span className="brand-label">{c.brandsAboutLabel}</span><p>{c.brandsAboutBody}</p><Link href="/about">{c.brandsAboutLink}&nbsp;<Arrow dir="up-right" /></Link></section>
      <footer className="brand-footer brand-wrap"><span className="brand-label">{c.brandsFooterLabel}</span><Link href={`mailto:${s.email}`}>{footA}{footRest.length > 0 && <><br /><em>{footRest.join(" ")}</em></>} <span aria-hidden="true"><Arrow dir="up-right" /></span></Link><div className="brand-footer-bottom"><span>{c.brandsSignature}</span><a href="#brand-main">Back to top&nbsp;<Arrow dir="up" /></a></div></footer>
    </main>
  </>;
}
