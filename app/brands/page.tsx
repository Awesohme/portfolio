import type { Metadata } from "next";
import Link from "next/link";
import SpecNav from "@/components/SpecNav";
import BrandImage from "@/components/brands/BrandImage";
import { brands } from "@/lib/brands";

export const metadata: Metadata = {
  title: "Brand Design · Olamide Irojah",
  description: "Five distinct identities across community, sportswear, fashion, and technology. Brand design by Olamide Irojah.",
};

export default function BrandsPage() {
  return <>
    <SpecNav back={{ href: "/", label: "Olamide Irojah ↗" }} />
    <main id="brand-main">
      <header className="brand-gallery-hero brand-wrap">
        <div className="brand-eyebrow-row"><span className="brand-label">Independent thinking. Distinct identities.</span><span className="brand-label">Selected brand work / 01—05</span></div>
        <h1>Identity.<br /><span>With intent.</span><sup aria-hidden="true">*</sup></h1>
        <div className="brand-hero-bottom"><p>I build brands with a point of view.<br />From the first idea to the things you hold.</p><a href="#identities" className="brand-round-link">Explore the identities <span aria-hidden="true">↓</span></a></div>
      </header>
      <section id="identities" className="brand-wrap brand-gallery" aria-label="Selected brand identities">
        <div className="brand-section-rule"><span className="brand-label">The collection</span><span className="brand-label">Five brands. Five different worlds.</span></div>
        <div className="brand-project-grid">
          {brands.map((brand, i) => <article key={brand.slug} className={`brand-project brand-project-${i + 1}`}>
            <Link href={`/brands/${brand.slug}`} className="brand-project-link" aria-label={`Explore ${brand.name} case study`}>
              <div className="brand-project-art" style={{background:brand.paper}}>
                <BrandImage asset={`${brand.slug}/hero`} alt={`${brand.name} ${i === 0 ? "market entrance and signage" : i === 1 ? "sportswear packaging" : i === 2 ? "bespoke fashion packaging" : i === 3 ? "vehicle livery" : "shopping bag"} mockup`} priority={i === 0} sizes={i === 0 || i === 3 ? "95vw" : "(max-width: 760px) 100vw, 60vw"} />
                <span className="brand-project-open" aria-hidden="true">View identity ↗</span>
              </div>
              <div className="brand-project-meta"><div><span className="brand-label">0{i + 1} / {brand.sector}</span><h2>{brand.name}</h2><p>{brand.line}</p></div><span className="brand-project-arrow" aria-hidden="true">↗</span></div>
            </Link>
          </article>)}
          <aside className="brand-gallery-note"><span className="brand-label">A connected practice</span><p>The idea matters.<br />So does every<br /><em>little detail.</em></p><span>Strategy, identity, and the everyday expressions that make a brand feel like itself.</span></aside>
        </div>
      </section>
      <section className="brand-about-strip brand-wrap"><span className="brand-label">Behind the work</span><p>I’m Olamide. Alongside my work in product, I create visual identities that connect an idea to the way a brand shows up in the world.</p><Link href="/about">More about me ↗</Link></section>
      <footer className="brand-footer brand-wrap"><span className="brand-label">Have something in mind?</span><Link href="mailto:irojaholamide@gmail.com">Let’s make<br /><em>an impression.</em> <span aria-hidden="true">↗</span></Link><div className="brand-footer-bottom"><span>Olamide Irojah · Brand design</span><a href="#brand-main">Back to top ↑</a></div></footer>
    </main>
  </>;
}
