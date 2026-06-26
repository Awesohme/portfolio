"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mikano-only custom block for the Spec case study:
 *  (1) before/after problem framing: designers kept asking "what size is this image?"
 *  (2) a mock auto-generated image-dimension report (what the crawler actually outputs),
 *      with a live "last crawled" clock + a re-crawl progress animation on scroll.
 */

type Row = { file: string; dims: string; size: string; page: string; type: string };

const ROWS: Row[] = [
  { file: "hero-showroom.jpg", dims: "1920×1080", size: "248 KB", page: "/", type: "JPG" },
  { file: "suv-x7-front.png", dims: "1200×800", size: "186 KB", page: "/vehicles/x7", type: "PNG" },
  { file: "generator-15kva.webp", dims: "1024×1024", size: "94 KB", page: "/power/15kva", type: "WEBP" },
  { file: "brand-mark.svg", dims: "512×512", size: "11 KB", page: "/", type: "SVG" },
  { file: "campaign-banner.jpg", dims: "2400×900", size: "312 KB", page: "/promos", type: "JPG" },
  { file: "team-portrait.png", dims: "1600×1067", size: "204 KB", page: "/about", type: "PNG" },
];

export default function MikanoReport() {
  const [crawling, setCrawling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stamp, setStamp] = useState("just now");
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired.current) {
            fired.current = true;
            setCrawling(true);
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / 1400, 1);
              setProgress(Math.round(p * 100));
              if (p < 1) requestAnimationFrame(tick);
              else {
                setCrawling(false);
                setStamp("just now");
              }
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* (1) before / after problem framing */}
      <section className="spec-sec spec-reveal">
        <div className="ln">★</div>
        <div className="body">
          <h2>
            <span className="n">★ ·</span> The actual problem
          </h2>
          <div className="spec-lead">&ldquo;What size is this image?&rdquo; Asked, again, every week.</div>
          <div className="mik-ba">
            <div className="mik-ba-col before">
              <div className="tag">BEFORE</div>
              <p>
                Designers pinged the team constantly for exact dimensions on a site whose content images changed
                all the time. Answers were manual, stale within days, and a recurring tax on everyone&apos;s time.
              </p>
            </div>
            <div className="mik-ba-arrow">→</div>
            <div className="mik-ba-col after">
              <div className="tag">AFTER</div>
              <p>
                A crawler reads the live sitemap, renders each page in Chromium, and measures every content image
                as users actually see it, publishing a self-updating guide. The question answers itself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* (2) the image-dimension report it outputs */}
      <section className="spec-sec spec-reveal" ref={ref}>
        <div className="ln">▦</div>
        <div className="body">
          <h2>
            <span className="n">▦ ·</span> What it outputs
          </h2>
          <div className="mik-report">
            <div className="mik-report-bar">
              <span className="t">image_dimensions.crawl</span>
              <span className="meta">
                {crawling ? (
                  <span className="crawling">CRAWLING… {progress}%</span>
                ) : (
                  <span className="done">✓ {ROWS.length} images · last crawled {stamp}</span>
                )}
              </span>
            </div>
            {crawling && (
              <div className="mik-progress">
                <span style={{ width: progress + "%" }} />
              </div>
            )}
            <div className="mik-head">
              <span>IMAGE</span>
              <span>DIMENSIONS</span>
              <span>SIZE</span>
              <span>PAGE</span>
            </div>
            {ROWS.map((r, i) => (
              <div
                className="mik-row"
                key={r.file}
                style={{ opacity: crawling && progress < (i + 1) * (100 / ROWS.length) ? 0.25 : 1 }}
              >
                <span className="img">
                  <span className="swatch" data-type={r.type}>
                    {r.type}
                  </span>
                  {r.file}
                </span>
                <span className="dims">{r.dims}</span>
                <span className="size">{r.size}</span>
                <span className="pg">{r.page}</span>
              </div>
            ))}
            <div className="mik-foot">AUTO-REFRESH · reads sitemap.xml · renders in Chromium · never goes stale</div>
          </div>
        </div>
      </section>
    </>
  );
}
