"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Lightweight "coming soon" modal, styled to match the .spec theme (light cream
 * surface, monospace, ink text). Portals to document.body, closes on Escape or
 * backdrop click.
 */
export default function ComingSoonModal({
  open,
  onClose,
  title = "Oops — still building this",
  body = "This isn't live yet. I'm working on it and it'll be here soon. Thanks for the interest.",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  body?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="spec"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(22,20,15,0.55)",
              backdropFilter: "blur(3px)",
            }}
            onClick={onClose}
          />
          {/* card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              background: "#f4f2ec",
              color: "#16140f",
              border: "1px solid #16140f",
              borderRadius: 6,
              padding: "30px 28px",
              fontFamily: "var(--font-grotesk), ui-monospace, monospace",
              boxShadow: "0 24px 60px rgba(22,20,15,0.28)",
            }}
            initial={{ y: 20, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute",
                right: 14,
                top: 14,
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: "1px solid rgba(22,20,15,0.25)",
                background: "transparent",
                color: "#16140f",
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                opacity: 0.6,
              }}
            >
              Coming soon
            </div>
            <h2 style={{ marginTop: 10, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
              {title}
            </h2>
            <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.6, color: "#3b372e" }}>
              {body}
            </p>

            <button
              onClick={onClose}
              style={{
                marginTop: 22,
                width: "100%",
                background: "#16140f",
                color: "#f4f2ec",
                border: "1px solid #16140f",
                borderRadius: 3,
                padding: "12px 20px",
                fontFamily: "var(--font-grotesk), ui-monospace, monospace",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Got it
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
