"use client";

/**
 * Cinematic black hole (Interstellar "Gargantua" style): a dark event-horizon
 * core, a glowing emerald-tinted accretion disc (a rotating ring), a vertical
 * "photon ring" arc over the top (the lensed disc), and a soft bloom.
 * Pure CSS — performant, scales for mobile.
 */
export default function Gargantua() {
  return (
    <div className="gargantua" aria-hidden>
      <div className="bloom" />
      <div className="disc" />
      <div className="lens-top" />
      <div className="horizon" />
      <div className="photon-ring" />

      <style jsx>{`
        .gargantua {
          position: relative;
          width: min(70vmin, 520px);
          height: min(70vmin, 520px);
          display: grid;
          place-items: center;
        }
        /* outer soft bloom */
        .bloom {
          position: absolute;
          inset: -18%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(16, 185, 129, 0.25),
            rgba(16, 185, 129, 0.06) 45%,
            transparent 70%
          );
          filter: blur(8px);
          animation: pulse 6s ease-in-out infinite;
        }
        /* the flat accretion disc — a glowing ring, slightly squashed + tilted,
           rotating around the hole */
        .disc {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: rotateX(74deg);
          background: conic-gradient(
            from 0deg,
            rgba(255, 255, 255, 0.95),
            rgba(110, 231, 183, 0.9),
            rgba(16, 185, 129, 0.7),
            rgba(13, 90, 66, 0.4),
            rgba(110, 231, 183, 0.9),
            rgba(255, 255, 255, 0.95)
          );
          -webkit-mask: radial-gradient(
            circle,
            transparent 36%,
            #000 40%,
            #000 60%,
            transparent 66%
          );
          mask: radial-gradient(
            circle,
            transparent 36%,
            #000 40%,
            #000 60%,
            transparent 66%
          );
          box-shadow: 0 0 60px rgba(16, 185, 129, 0.5);
          animation: spin 14s linear infinite;
        }
        /* the lensed top arc — the disc bent up and over the hole (Interstellar's
           signature halo). A bright ring sitting upright. */
        .lens-top {
          position: absolute;
          width: 58%;
          height: 58%;
          border-radius: 50%;
          border: 3px solid transparent;
          background: linear-gradient(
              to right,
              rgba(110, 231, 183, 0),
              rgba(255, 255, 255, 0.95),
              rgba(110, 231, 183, 0)
            )
            border-box;
          -webkit-mask: linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          filter: blur(0.5px) drop-shadow(0 0 14px rgba(16, 185, 129, 0.8));
          clip-path: inset(0 0 50% 0);
        }
        /* the black sphere (event horizon) */
        .horizon {
          position: absolute;
          width: 42%;
          height: 42%;
          border-radius: 50%;
          background: #000;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 1),
            0 0 26px 6px rgba(0, 0, 0, 0.9);
        }
        /* thin glowing photon ring hugging the horizon */
        .photon-ring {
          position: absolute;
          width: 44%;
          height: 44%;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.9),
            0 0 24px 6px rgba(16, 185, 129, 0.7);
        }
        @keyframes spin {
          to {
            transform: rotateX(74deg) rotate(360deg);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .disc,
          .bloom {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
