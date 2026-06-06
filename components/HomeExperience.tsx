"use client";

import { useState } from "react";
import Hero from "./Hero";
import SaberLoader from "./SaberLoader";

export default function HomeExperience() {
  // NOTE: currently replays on EVERY load for review. To restore once-per-session
  // before launch, gate this on sessionStorage("saber-seen") again.
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      <Hero />
      {showLoader && <SaberLoader onDone={() => setShowLoader(false)} />}
    </>
  );
}
