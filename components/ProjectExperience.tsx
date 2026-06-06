"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/projects";
import Crawl from "./Crawl";

// Planet is heavy (three.js) — client-only, mounted UNDER the crawl so it
// renders real frames (warms up) while the crawl plays. No load gap after.
const Planet = dynamic(() => import("./Planet"), { ssr: false });

export default function ProjectExperience({ project }: { project: Project }) {
  const [crawlFinished, setCrawlFinished] = useState(false);
  const [planetReady, setPlanetReady] = useState(false);
  // null until we've checked sessionStorage (avoids a flash of the crawl on repeats)
  const [seen, setSeen] = useState<boolean | null>(null);

  // Auto-skip the crawl ONLY if its story has already fully played this session.
  // We mark "seen" when the crawl finishes (not on mount) so React Strict Mode's
  // double-mount in dev can't falsely flag an unseen project as seen.
  useEffect(() => {
    const already = sessionStorage.getItem(`crawl-seen:${project.slug}`) === "1";
    if (already) setCrawlFinished(true);
    setSeen(already);
  }, [project.slug]);

  const handleCrawlDone = () => {
    sessionStorage.setItem(`crawl-seen:${project.slug}`, "1");
    setCrawlFinished(true);
  };

  // Reveal only when the crawl is done AND the planet has actually painted.
  const reveal = crawlFinished && planetReady;

  // Safety net: if the planet somehow never signals ready (WebGL failure),
  // reveal anyway 2s after the crawl finishes so the user is never stuck.
  useEffect(() => {
    if (!crawlFinished || planetReady) return;
    const t = setTimeout(() => setPlanetReady(true), 2000);
    return () => clearTimeout(t);
  }, [crawlFinished, planetReady]);

  return (
    <>
      {/* Planet mounted at full opacity from the start so r3f paints real frames
          and warms up. It's simply covered by the opaque crawl overlay until the
          crawl fades out. */}
      <Planet project={project} onReady={() => setPlanetReady(true)} />

      {/* crawl overlay — only for first visit to this project this session */}
      {seen === false && !reveal && (
        <Crawl project={project} onDone={handleCrawlDone} />
      )}

      {/* on a repeat visit, hold a brief loader until the planet paints */}
      {seen === true && !planetReady && (
        <div className="fixed inset-0 z-[160] flex flex-col items-center justify-center gap-4 bg-ink">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald/30 border-t-emerald" />
          <p className="text-sm uppercase tracking-[.2em] text-emerald-soft">
            Entering orbit…
          </p>
        </div>
      )}

      {/* tiny loader for the sub-second gap if crawl finished before planet painted */}
      {crawlFinished && !planetReady && (
        <div className="fixed inset-0 z-[160] flex flex-col items-center justify-center gap-4 bg-ink">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald/30 border-t-emerald" />
          <p className="text-sm uppercase tracking-[.2em] text-emerald-soft">
            Entering orbit…
          </p>
        </div>
      )}
    </>
  );
}
