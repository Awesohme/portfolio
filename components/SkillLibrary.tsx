"use client";

import { useState } from "react";
import ComingSoonModal from "@/components/ComingSoonModal";
import Arrow from "@/components/Arrow";
import { useTurnstile } from "@/components/NotifyButton";
import type { CmsSkill } from "@/lib/skillsCms";

type Labels = { download: string; downloadAll: string; allTitle: string; allBody: string; thanks: string };

const pad = (n: number) => String(n).padStart(2, "0");

/** Start a browser download for a URL (used once "download all" has passed the check). */
function startDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * The skills grid on /skills. Each card links straight to its zip, so the download
 * works even if logging fails; a beacon tells /api/skill-download it happened.
 * "Download all" asks for the Turnstile check first (keeps bots out of the alerts).
 */
export default function SkillLibrary({ skills, allSlug, labels }: { skills: CmsSkill[]; allSlug: string; labels: Labels }) {
  const [thanked, setThanked] = useState(false);
  const [open, setOpen] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstile = useTurnstile(siteKey, open, setCaptcha);

  function logDownload(slug: string) {
    const body = JSON.stringify({ slug });
    if (!navigator.sendBeacon?.("/api/skill-download", body)) {
      fetch("/api/skill-download", { method: "POST", body, keepalive: true }).catch(() => {});
    }
    setThanked(true);
  }

  async function downloadAll() {
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/skill-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: allSlug, captcha }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.url) throw new Error(data.error || "Something went wrong. Please try again.");
      startDownload(data.url);
      setOpen(false);
      setState("idle");
      setThanked(true);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      turnstile.reset();
    }
  }

  const needsCheck = !!siteKey && !captcha;

  return (
    <>
      <div className="skill-actions">
        <button type="button" className="spec-btn spec-btn-fill" onClick={() => (siteKey ? setOpen(true) : downloadAll())} disabled={state === "sending"}>
          <Arrow dir="down" />&nbsp;{labels.downloadAll}
        </button>
        <p className="skill-thanks" role="status" aria-live="polite">
          {thanked ? labels.thanks : ""}
        </p>
      </div>

      <div className="skill-grid">
        {skills.map((s, i) => (
          <article key={s.slug} className="skill-card" id={`skill-${s.slug}`}>
            <div className="skill-top">
              <span>{pad(i + 1)}</span>
              <span>{s.worksWith}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.line}</p>
            {s.includes.length > 0 && <div className="skill-includes">{s.includes.join(" · ")}</div>}
            <a href={s.zipUrl} download className="skill-download" onClick={() => logDownload(s.slug)} aria-label={`${labels.download} ${s.name}`}>
              <span aria-hidden="true"><Arrow dir="down" /></span> {labels.download}
            </a>
          </article>
        ))}
      </div>

      <ComingSoonModal open={open} onClose={() => setOpen(false)} eyebrow={labels.downloadAll.replace(/^\W+/, "")} title={labels.allTitle} body={labels.allBody}>
        <div className="skill-check">
          {siteKey && <div ref={turnstile.ref} style={{ minHeight: 65 }} />}
          <button type="button" className="skill-check-go" onClick={downloadAll} disabled={state === "sending" || needsCheck}>
            {state === "sending" ? "Preparing…" : labels.downloadAll}
          </button>
          {state === "error" && (
            <p role="alert" className="skill-check-error">
              {error}
            </p>
          )}
        </div>
      </ComingSoonModal>
    </>
  );
}
