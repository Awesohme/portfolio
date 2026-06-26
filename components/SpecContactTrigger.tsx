"use client";

import { useState } from "react";
import SpecContact from "./SpecContact";

/** The "Let's talk" CTA used in SpecNav; opens the light contact popup. */
export default function SpecContactTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="spec-nav-cta" onClick={() => setOpen(true)}>
        Let&apos;s talk →
      </button>
      <SpecContact open={open} onClose={() => setOpen(false)} />
    </>
  );
}
