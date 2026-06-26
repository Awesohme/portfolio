"use client";

import { useEffect, useRef } from "react";

/**
 * A slim reading-progress bar pinned to the very top of the viewport.
 * Fills left→right as the reader scrolls through the page. Decorative only.
 */
export default function ReadProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    // keep the bar pinned to the nav's bottom border, whatever its height
    const syncNavHeight = () => {
      const nav = document.querySelector<HTMLElement>(".spec-nav");
      if (nav) {
        document.querySelector<HTMLElement>(".spec")?.style.setProperty("--spec-nav-h", `${nav.offsetHeight}px`);
      }
    };
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      el.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    syncNavHeight();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      syncNavHeight();
      onScroll();
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="read-progress" aria-hidden="true">
      <div ref={ref} className="read-progress-fill" />
    </div>
  );
}
