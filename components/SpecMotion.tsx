"use client";

import { useEffect } from "react";

/**
 * Mounts the shared Spec-theme interactions once per page:
 *  - scroll-reveal for .spec-reveal
 *  - outcome-bar fill for .spec-orow .v[data-w]
 * Runs after hydration; safe to include on any /v2 page.
 */
export default function SpecMotion() {
  useEffect(() => {
    const revealEls = document.querySelectorAll<HTMLElement>(".spec-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => io.observe(el));

    const bars = document.querySelectorAll<HTMLElement>(".spec-orow .v[data-w]");
    const bio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.setProperty("--w", (el.dataset.w || "0") + "%");
            el.classList.add("go");
            bio.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach((el) => bio.observe(el));

    return () => {
      io.disconnect();
      bio.disconnect();
    };
  }, []);

  return null;
}
