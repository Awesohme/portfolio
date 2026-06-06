"use client";

import { useEffect, useState } from "react";

/**
 * Entry loader: a realistic lightsaber hilt sits at the bottom of the viewport
 * and a GREEN blade ignites straight upward (layered bloom + white-hot core +
 * flicker), then the scene fades to reveal the hero.
 */
export default function SaberLoader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "lit" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("lit"), 500); // ignite upward
    const t2 = setTimeout(() => setPhase("out"), 2600); // hold, then fade
    const t3 = setTimeout(() => onDone(), 3300);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onDone]);

  const lit = phase === "lit" || phase === "out";

  return (
    <div
      className={`fixed inset-0 z-[300] overflow-hidden bg-black transition-opacity duration-700 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* ambient green wash once lit */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
          lit ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(45% 60% at 50% 72%, rgba(16,185,129,.28), transparent 70%)",
        }}
      />

      <div className="rig">
        {/* blade layers: outer halo, mid glow, white-hot core, rounded tip */}
        <div className={`halo ${lit ? "lit" : ""}`} />
        <div className={`glow ${lit ? "lit" : ""}`} />
        <div className={`core ${lit ? "lit" : ""}`} />
        <div className={`tip ${lit ? "lit" : ""}`} />

        {/* realistic SVG hilt */}
        <Hilt />
      </div>

      <button
        onClick={onDone}
        className="absolute bottom-6 right-7 z-10 rounded-full border border-white/15 px-5 py-2 text-sm text-white/60 transition hover:border-emerald hover:text-white"
      >
        Skip →
      </button>

      <style jsx>{`
        .rig {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          /* responsive: scales down on phones */
          --hilt-w: clamp(64px, 18vw, 96px);
          --hilt-h: calc(var(--hilt-w) * 2.6);
          --blade-w: calc(var(--hilt-w) * 0.34);
          --blade-h: 76vh;
          width: var(--hilt-w);
          height: var(--hilt-h);
        }

        /* ---- blade layers (all grow upward from the emitter) ---- */
        .halo,
        .glow,
        .core {
          position: absolute;
          left: 50%;
          bottom: calc(var(--hilt-h) * 0.92);
          transform: translateX(-50%);
          height: 0;
          border-radius: 999px 999px 0 0;
          transition: height 0.55s cubic-bezier(0.16, 0.84, 0.3, 1);
        }
        .halo {
          width: calc(var(--blade-w) * 2.6);
          background: linear-gradient(
            to top,
            rgba(16, 185, 129, 0.35),
            rgba(52, 211, 153, 0.25)
          );
          filter: blur(14px);
        }
        .glow {
          width: var(--blade-w);
          background: linear-gradient(
            to top,
            rgba(16, 185, 129, 1),
            rgba(110, 231, 183, 1)
          );
          box-shadow: 0 0 22px 6px rgba(16, 185, 129, 0.75);
        }
        .core {
          width: calc(var(--blade-w) * 0.42);
          background: linear-gradient(to top, #eafff5, #ffffff);
        }
        .tip {
          position: absolute;
          left: 50%;
          bottom: calc(var(--hilt-h) * 0.92);
          transform: translateX(-50%);
          width: calc(var(--blade-w) * 1.1);
          height: calc(var(--blade-w) * 1.1);
          border-radius: 50%;
          background: radial-gradient(circle, #fff 28%, rgba(110, 231, 183, 0) 72%);
          opacity: 0;
          transition: bottom 0.55s cubic-bezier(0.16, 0.84, 0.3, 1),
            opacity 0.3s ease;
        }
        .halo.lit {
          height: calc(var(--blade-h) + 4vh);
        }
        .glow.lit {
          height: var(--blade-h);
          animation: flicker 0.09s steps(2) 0.55s infinite alternate;
        }
        .core.lit {
          height: var(--blade-h);
        }
        .tip.lit {
          bottom: calc(var(--hilt-h) * 0.92 + var(--blade-h));
          opacity: 1;
        }
        /* subtle unstable-blade flicker via brightness + glow pulse */
        @keyframes flicker {
          from {
            box-shadow: 0 0 22px 6px rgba(16, 185, 129, 0.75);
            filter: brightness(1);
          }
          to {
            box-shadow: 0 0 30px 9px rgba(16, 185, 129, 0.9);
            filter: brightness(1.08);
          }
        }
      `}</style>
    </div>
  );
}

/** Detailed metallic lightsaber hilt (Skywalker/graflex-style), inline SVG. */
function Hilt() {
  return (
    <svg
      className="hiltSvg"
      viewBox="0 0 96 250"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMax meet"
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        {/* horizontal metallic gradient = cylindrical shading */}
        <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3c4046" />
          <stop offset="22%" stopColor="#9aa0a8" />
          <stop offset="48%" stopColor="#eef1f4" />
          <stop offset="60%" stopColor="#c3c8ce" />
          <stop offset="100%" stopColor="#33363b" />
        </linearGradient>
        <linearGradient id="steelDark" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#212327" />
          <stop offset="50%" stopColor="#6c7178" />
          <stop offset="100%" stopColor="#1b1d20" />
        </linearGradient>
        <linearGradient id="black" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0c0d0f" />
          <stop offset="50%" stopColor="#3a3d42" />
          <stop offset="100%" stopColor="#0a0b0d" />
        </linearGradient>
        <radialGradient id="emit" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#d8fff0" />
          <stop offset="55%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#0f9b6f" />
        </radialGradient>
      </defs>

      {/* emitter shroud (top) */}
      <rect x="20" y="6" width="56" height="10" rx="3" fill="url(#steelDark)" />
      <path d="M22 16 H74 L70 28 H26 Z" fill="url(#steel)" />
      {/* emitter glow disc */}
      <ellipse cx="48" cy="10" rx="20" ry="6" fill="url(#emit)" />

      {/* neck rings */}
      <rect x="24" y="28" width="48" height="6" rx="2" fill="url(#steelDark)" />
      <rect x="22" y="34" width="52" height="10" rx="2" fill="url(#steel)" />

      {/* upper body */}
      <rect x="24" y="44" width="48" height="34" rx="3" fill="url(#steel)" />
      {/* machined groove */}
      <rect x="24" y="58" width="48" height="3" fill="#2b2e33" opacity="0.6" />

      {/* control box (right) + green activation switch */}
      <rect x="68" y="58" width="14" height="26" rx="2" fill="url(#steelDark)" />
      <circle cx="75" cy="66" r="3.4" fill="#34d399">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <rect x="71" y="73" width="8" height="3" rx="1" fill="#1b1d20" />
      <rect x="71" y="78" width="8" height="3" rx="1" fill="#1b1d20" />

      {/* knurled grip section (black ribbed) */}
      <rect x="26" y="86" width="44" height="78" rx="3" fill="url(#black)" />
      {Array.from({ length: 11 }).map((_, i) => (
        <rect
          key={i}
          x="26"
          y={90 + i * 6.6}
          width="44"
          height="3.2"
          rx="1.5"
          fill="#54585f"
          opacity="0.9"
        />
      ))}

      {/* lower body ring */}
      <rect x="24" y="166" width="48" height="12" rx="2" fill="url(#steel)" />
      <rect x="22" y="178" width="52" height="8" rx="2" fill="url(#steelDark)" />

      {/* clamp detail */}
      <rect x="20" y="186" width="56" height="20" rx="3" fill="url(#steel)" />
      <rect x="44" y="186" width="4" height="20" fill="#2b2e33" opacity="0.5" />

      {/* pommel (bottom) */}
      <path d="M22 206 H74 L78 240 H18 Z" fill="url(#steelDark)" />
      <rect x="16" y="240" width="64" height="8" rx="3" fill="#15171a" />

      {/* vertical specular highlight down the whole hilt */}
      <rect x="44" y="16" width="3" height="224" fill="#ffffff" opacity="0.22" />
    </svg>
  );
}
