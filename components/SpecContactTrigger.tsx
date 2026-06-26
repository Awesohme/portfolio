"use client";

import { useState } from "react";
import SpecContact from "./SpecContact";

/** The "Let's talk" CTA used in SpecNav; opens the light contact popup.
 *  Contact details are passed in from the CMS (with built-in defaults). */
export default function SpecContactTrigger({
  email,
  whatsapp,
  github,
  linkedin,
  message,
}: {
  email?: string;
  whatsapp?: string;
  github?: string;
  linkedin?: string;
  message?: string;
} = {}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="spec-nav-cta" onClick={() => setOpen(true)}>
        Let&apos;s talk →
      </button>
      <SpecContact
        open={open}
        onClose={() => setOpen(false)}
        email={email}
        whatsapp={whatsapp}
        github={github}
        linkedin={linkedin}
        message={message}
      />
    </>
  );
}
