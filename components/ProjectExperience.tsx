"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/projects";
import Crawl from "./Crawl";

// Planet is heavy (three.js) — client-only, but we mount it UNDER the crawl
// so it preloads while the crawl plays. No load gap when the crawl ends.
const Planet = dynamic(() => import("./Planet"), { ssr: false });

export default function ProjectExperience({ project }: { project: Project }) {
  const [crawlDone, setCrawlDone] = useState(false);

  return (
    <>
      {/* planet always mounted underneath, fades in when crawl finishes */}
      <div
        className={`transition-opacity duration-700 ${
          crawlDone ? "opacity-100" : "opacity-0"
        }`}
      >
        <Planet project={project} />
      </div>

      {!crawlDone && <Crawl project={project} onDone={() => setCrawlDone(true)} />}
    </>
  );
}
