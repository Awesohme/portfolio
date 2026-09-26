"use client";

import { useEffect, useRef, useState } from "react";
import ComingSoonModal from "@/components/ComingSoonModal";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  color: "#16140f",
  border: "1px solid rgba(22,20,15,0.35)",
  borderRadius: 3,
  padding: "12px 14px",
  fontFamily: "var(--font-grotesk), ui-monospace, monospace",
  fontSize: 14,
};

const submitStyle: React.CSSProperties = {
  marginTop: 10,
  width: "100%",
  background: "#16140f",
  color: "#f4f2ec",
  border: "1px solid #16140f",
  borderRadius: 3,
  padding: "12px 20px",
  fontFamily: "var(--font-grotesk), ui-monospace, monospace",
  fontSize: 13,
  cursor: "pointer",
};

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Load Cloudflare Turnstile once and render the check into `el`. */
function useTurnstile(siteKey: string | undefined, active: boolean, onToken: (t: string) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  useEffect(() => {
    if (!siteKey || !active) return;
    let cancelled = false;
    const mount = () => {
      if (cancelled || !ref.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    };
    if (window.turnstile) mount();
    else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
      if (!script) {
        script = document.createElement("script");
        script.src = TURNSTILE_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", mount);
    }
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey, active, onToken]);
  const reset = () => {
    if (widget.current && window.turnstile) window.turnstile.reset(widget.current);
    onToken("");
  };
  return { ref, reset };
}

/**
 * The "Get notified" CTA on the musings pages. When sign-up is on (the site has
 * NOTIFY_SCRIPT_URL), it opens a name + email form (with a Cloudflare Turnstile
 * check when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set) that posts to /api/subscribe;
 * the details land in the subscribers Google Sheet. Otherwise it keeps showing the
 * "coming soon" modal. Keeps the same button markup/classes so the look is unchanged.
 */
export default function NotifyButton({
  label,
  className,
  style,
  signup,
  comingSoon,
}: {
  label: string;
  className?: string;
  style?: React.CSSProperties;
  signup: { title: string; body: string; success: string } | null;
  comingSoon: { title: string; body: string };
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [website, setWebsite] = useState(""); // honeypot: real people never fill this
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const turnstile = useTurnstile(siteKey, open && !!signup && state !== "done", setCaptcha);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, website, captcha }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      turnstile.reset();
    }
  }

  const close = () => {
    setOpen(false);
    if (state === "done") {
      setState("idle");
      setName("");
      setEmail("");
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {signup ? (
        <ComingSoonModal
          open={open}
          onClose={close}
          eyebrow="New musings"
          title={state === "done" ? "You're on the list" : signup.title}
          body={state === "done" ? signup.success : signup.body}
        >
          {state === "done" ? (
            <button type="button" onClick={close} style={{ ...submitStyle, marginTop: 22 }}>
              Got it
            </button>
          ) : (
            <form onSubmit={submit} style={{ marginTop: 20 }}>
              <label htmlFor="notify-name" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                Your name
              </label>
              <input
                id="notify-name"
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ ...inputStyle, marginBottom: 10 }}
              />
              <label htmlFor="notify-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                Email address
              </label>
              <input
                id="notify-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
              />
              {siteKey && <div ref={turnstile.ref} style={{ marginTop: 12, minHeight: 65 }} />}
              <button type="submit" disabled={state === "sending" || (!!siteKey && !captcha)} style={{ ...submitStyle, opacity: state === "sending" || (!!siteKey && !captcha) ? 0.6 : 1 }}>
                {state === "sending" ? "Adding you…" : "Notify me"}
              </button>
              {state === "error" && (
                <p role="alert" style={{ marginTop: 10, fontSize: 13, color: "#b42318" }}>
                  {error}
                </p>
              )}
            </form>
          )}
        </ComingSoonModal>
      ) : (
        <ComingSoonModal
          open={open}
          onClose={() => setOpen(false)}
          title={comingSoon.title}
          body={comingSoon.body}
        />
      )}
    </>
  );
}
