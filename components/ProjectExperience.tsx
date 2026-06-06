"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/projects";
import Crawl from "./Crawl";

// Planet is heavy (three.js) — load only on the client, after crawl.
const Planet = dynamic(() => import("./Planet"), { ssr: false });

export default function ProjectExperience({ project }: { project: Project }) {
  const [phase, setPhase] = useState<"crawl" | "planet">("crawl");

  return (
    <>
      {phase === "planet" && <Planet project={project} />}
      {phase === "crawl" && <Crawl project={project} onDone={() => setPhase("planet")} />}
    </>
  );
}
