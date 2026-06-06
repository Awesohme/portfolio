"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen warp-jump overlay. When `active` is true it:
 *  1. opens a hyperspace tunnel of green star-streaks radiating from `origin`
 *  2. flies a Millennium-Falcon-style ship out toward the viewer
 *  3. calls onComplete() when the jump finishes (parent then navigates)
 */
export default function WarpTransition({
  active,
  origin,
  onComplete,
}: {
  active: boolean;
  origin: { x: number; y: number } | null;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active || !origin) return;
    doneRef.current = false;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // tunnel converges from the click origin toward screen center as the jump engages
    const cx0 = origin.x;
    const cy0 = origin.y;
    const cxC = W / 2;
    const cyC = H / 2;

    type Streak = { a: number; r: number; len: number; speed: number; hue: number };
    const streaks: Streak[] = [];
    for (let i = 0; i < 320; i++) {
      streaks.push({
        a: Math.random() * Math.PI * 2,
        r: Math.random() * 40,
        len: 0,
        speed: 2 + Math.random() * 7,
        hue: 150 + Math.random() * 20, // greens
      });
    }

    const start = performance.now();
    const DURATION = 2200; // ms

    function frame(now: number) {
      const t = Math.min((now - start) / DURATION, 1);
      // ease the tunnel center from origin to screen center
      const cx = cx0 + (cxC - cx0) * easeInOut(t);
      const cy = cy0 + (cyC - cy0) * easeInOut(t);

      // accelerate
      const accel = 1 + t * t * 9;

      ctx.fillStyle = `rgba(5,9,7,${0.25 + t * 0.2})`;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.translate(cx, cy);
      for (const s of streaks) {
        s.r += s.speed * accel;
        s.len = Math.min(s.len + s.speed * accel * 0.6, 260);
        const x1 = Math.cos(s.a) * s.r;
        const y1 = Math.sin(s.a) * s.r;
        const x2 = Math.cos(s.a) * (s.r - s.len);
        const y2 = Math.sin(s.a) * (s.r - s.len);
        const alpha = Math.min(s.r / 120, 1);
        const grad = ctx.createLinearGradient(x2, y2, x1, y1);
        grad.addColorStop(0, `hsla(${s.hue},90%,60%,0)`);
        grad.addColorStop(1, `hsla(${s.hue},90%,65%,${alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 + t * 2;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        if (s.r > Math.max(W, H)) {
          s.r = Math.random() * 30;
          s.len = 0;
        }
      }
      ctx.restore();

      // central white-green flash building to the jump
      const flash = Math.max(0, t - 0.55) / 0.45;
      if (flash > 0) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * flash);
        g.addColorStop(0, `rgba(110,231,183,${flash * 0.9})`);
        g.addColorStop(0.5, `rgba(16,185,129,${flash * 0.4})`);
        g.addColorStop(1, "rgba(16,185,129,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      if (t >= 1 && !doneRef.current) {
        doneRef.current = true;
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [active, origin, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#050907]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* Millennium-Falcon-style ship flying out of the jump */}
      <div className="falcon" aria-hidden>
        <Falcon />
      </div>
      <style jsx>{`
        .falcon {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 120px;
          height: 90px;
          transform: translate(-50%, -50%) scale(0.05) rotate(8deg);
          opacity: 0;
          animation: flyout 2.2s cubic-bezier(0.5, 0, 0.7, 1) forwards;
          filter: drop-shadow(0 0 18px rgba(52, 211, 153, 0.8));
        }
        @keyframes flyout {
          0% {
            transform: translate(-50%, -50%) scale(0.04) rotate(10deg);
            opacity: 0;
          }
          35% {
            opacity: 1;
          }
          70% {
            transform: translate(-50%, -54%) scale(1) rotate(-4deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -60%) scale(7) rotate(-10deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/** Simplified top-down Millennium-Falcon silhouette in SVG. */
function Falcon() {
  return (
    <svg viewBox="0 0 120 90" width="120" height="90">
      <defs>
        <radialGradient id="hull" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#cfeede" />
          <stop offset="70%" stopColor="#7f9c8e" />
          <stop offset="100%" stopColor="#4a5d54" />
        </radialGradient>
        <linearGradient id="engine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* main disc */}
      <ellipse cx="60" cy="46" rx="44" ry="34" fill="url(#hull)" stroke="#36473f" strokeWidth="1.5" />
      {/* mandible prongs */}
      <path d="M96 38 L120 30 L120 40 L100 46 Z" fill="url(#hull)" stroke="#36473f" strokeWidth="1" />
      <path d="M96 54 L120 50 L120 60 L100 50 Z" fill="url(#hull)" stroke="#36473f" strokeWidth="1" />
      {/* cockpit (side) */}
      <circle cx="92" cy="62" r="7" fill="#9fc7b6" stroke="#36473f" strokeWidth="1.2" />
      {/* central dome */}
      <circle cx="60" cy="46" r="13" fill="#b9d8c9" stroke="#36473f" strokeWidth="1" />
      <circle cx="60" cy="46" r="5" fill="#5b7468" />
      {/* panel lines */}
      <path d="M60 12 L60 80 M16 46 L104 46" stroke="#3a4d44" strokeWidth="0.8" opacity="0.5" />
      {/* rear engine glow */}
      <rect x="18" y="40" width="6" height="12" rx="2" fill="url(#engine)" />
      <ellipse cx="14" cy="46" rx="10" ry="7" fill="#6ee7b7" opacity="0.6" />
    </svg>
  );
}
