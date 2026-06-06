"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const EMAIL = "irojaholamide@gmail.com";
const WHATSAPP = "2348121364213";
const SUBJECT = "Let's talk — opportunity for Olamide";
const MESSAGE =
  "Hi Olamide — I came across your portfolio and I'd love to talk about a product role / opportunity. When are you free for a quick chat?";

const enc = encodeURIComponent;

const links = {
  gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(EMAIL)}&su=${enc(
    SUBJECT
  )}&body=${enc(MESSAGE)}`,
  outlook: `https://outlook.office.com/mail/deeplink/compose?to=${enc(
    EMAIL
  )}&subject=${enc(SUBJECT)}&body=${enc(MESSAGE)}`,
  default: `mailto:${EMAIL}?subject=${enc(SUBJECT)}&body=${enc(MESSAGE)}`,
  whatsapp: `https://wa.me/${WHATSAPP}?text=${enc(MESSAGE)}`,
};

export default function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* card */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0f1714]/95 p-7 shadow-glow backdrop-blur-xl"
            initial={{ y: 24, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* glow accent */}
            <div
              className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, #10b981, transparent 70%)" }}
            />

            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/30 hover:text-white"
            >
              ✕
            </button>

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.14em] text-emerald-soft">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-glow" />
                Open to senior product roles
              </span>
              <h2 className="mt-4 font-sora text-2xl font-bold text-white">Let&apos;s talk</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Pick whatever&apos;s easiest — I&apos;ll get a prefilled message either way.
              </p>

              <div className="mt-6 space-y-3">
                {/* WhatsApp */}
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-emerald/30 bg-emerald/10 px-5 py-4 transition hover:border-emerald hover:bg-emerald/20 active:scale-[.98]"
                >
                  <span className="text-xl">💬</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-white">WhatsApp</span>
                    <span className="block text-xs text-muted">Fastest — chat me directly</span>
                  </span>
                  <span className="text-emerald-soft">→</span>
                </a>

                {/* Email (expands to app chooser) */}
                {!emailOpen ? (
                  <button
                    onClick={() => setEmailOpen(true)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[.03] px-5 py-4 transition hover:border-white/30 active:scale-[.98]"
                  >
                    <span className="text-xl">✉️</span>
                    <span className="flex-1 text-left">
                      <span className="block font-semibold text-white">Email</span>
                      <span className="block text-xs text-muted">{EMAIL}</span>
                    </span>
                    <span className="text-muted">→</span>
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] p-3"
                  >
                    <p className="mb-2 px-2 text-xs text-muted">Open in…</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { k: "gmail", label: "Gmail", emoji: "📧" },
                        { k: "outlook", label: "Outlook", emoji: "📨" },
                        { k: "default", label: "Mail app", emoji: "💻" },
                      ].map((o) => (
                        <a
                          key={o.k}
                          href={links[o.k as keyof typeof links]}
                          target={o.k === "default" ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-white/[.03] py-3 text-center transition hover:border-emerald hover:bg-emerald/10 active:scale-95"
                        >
                          <span className="text-lg">{o.emoji}</span>
                          <span className="text-xs font-medium text-white">{o.label}</span>
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
