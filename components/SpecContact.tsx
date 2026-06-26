"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/* monochrome inline icons (currentColor) */
const I = {
  whatsapp: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M.06 24l1.69-6.16a11.86 11.86 0 0 1-1.59-5.95C.16 5.34 5.5 0 12.06 0a11.82 11.82 0 0 1 8.41 3.49 11.82 11.82 0 0 1 3.48 8.42c0 6.56-5.34 11.9-11.9 11.9a11.9 11.9 0 0 1-5.69-1.45L.06 24zM6.6 20.2c1.68 1 3.28 1.6 5.4 1.6 5.46 0 9.9-4.43 9.9-9.88a9.83 9.83 0 0 0-2.9-7 9.82 9.82 0 0 0-7-2.9c-5.46 0-9.9 4.43-9.9 9.88 0 2.23.65 3.9 1.75 5.65l-1 3.65 3.75-1zM17.5 14.4c-.07-.12-.27-.2-.57-.35-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07a8.1 8.1 0 0 1-2.39-1.47 9 9 0 0 1-1.65-2.06c-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6l9 6 9-6" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  ),
  gmail: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  outlook: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <circle cx="8" cy="12" r="3" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 5h16v14H4z" /><path d="M4 7l8 5 8-5" />
    </svg>
  ),
};

// defaults (used if no props are passed / CMS unavailable)
const DEF_EMAIL = "irojaholamide@gmail.com";
const DEF_WHATSAPP = "2348121364213";
const DEF_GITHUB = "https://github.com/awesohme";
const DEF_LINKEDIN = "https://www.linkedin.com/in/irojaholamide/";
const DEF_MESSAGE =
  "Hi Olamide, I came across your portfolio and I'd love to talk about a product role / opportunity. When are you free for a quick chat?";
const SUBJECT = "Let's talk: opportunity for Olamide";

const enc = encodeURIComponent;

function buildLinks(email: string, whatsapp: string, message: string) {
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(email)}&su=${enc(SUBJECT)}&body=${enc(message)}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?to=${enc(email)}&subject=${enc(SUBJECT)}&body=${enc(message)}`,
    default: `mailto:${email}?subject=${enc(SUBJECT)}&body=${enc(message)}`,
    whatsapp: `https://wa.me/${whatsapp}?text=${enc(message)}`,
  };
}

/** Light, PRD-themed contact popup (WhatsApp + Email). Scoped under .spec. */
export default function SpecContact({
  open,
  onClose,
  email = DEF_EMAIL,
  whatsapp = DEF_WHATSAPP,
  github = DEF_GITHUB,
  linkedin = DEF_LINKEDIN,
  message = DEF_MESSAGE,
}: {
  open: boolean;
  onClose: () => void;
  email?: string;
  whatsapp?: string;
  github?: string;
  linkedin?: string;
  message?: string;
}) {
  const links = buildLinks(email, whatsapp, message);
  const EMAIL = email;
  const GITHUB = github;
  const LINKEDIN = linkedin;
  const [mounted, setMounted] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) setEmailOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="spec spec-contact-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="spec-contact-backdrop" onClick={onClose} />
          <motion.div
            className="spec-contact-card"
            initial={{ y: 22, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 22, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <button className="spec-contact-close" aria-label="Close" onClick={onClose}>
              ✕
            </button>

            <h2 className="spec-contact-title">Let&apos;s talk</h2>
            <p className="spec-contact-sub">Pick whatever&apos;s easiest. I&apos;ll get a prefilled message either way.</p>

            <a className="spec-contact-opt primary" href={links.whatsapp} target="_blank" rel="noopener noreferrer">
              <span className="ic">{I.whatsapp}</span>
              <span className="txt">
                <b>WhatsApp</b>
                <small>Fastest, chat me directly</small>
              </span>
              <span className="arr">→</span>
            </a>

            {!emailOpen ? (
              <button className="spec-contact-opt" onClick={() => setEmailOpen(true)}>
                <span className="ic">{I.email}</span>
                <span className="txt">
                  <b>Email</b>
                  <small>{EMAIL}</small>
                </span>
                <span className="arr">→</span>
              </button>
            ) : (
              <motion.div
                className="spec-contact-choose"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <p className="lbl">OPEN IN…</p>
                <div className="grid">
                  {[
                    { k: "gmail", label: "Gmail", icon: I.gmail },
                    { k: "outlook", label: "Outlook", icon: I.outlook },
                    { k: "default", label: "Mail app", icon: I.mail },
                  ].map((o) => (
                    <a
                      key={o.k}
                      href={links[o.k as keyof typeof links]}
                      target={o.k === "default" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                    >
                      <span className="emoji">{o.icon}</span>
                      <span>{o.label}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="spec-contact-socials">
              <span className="lbl">OR FIND ME ON</span>
              <div className="row">
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                  {I.linkedin} LinkedIn
                </a>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                  {I.github} GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
