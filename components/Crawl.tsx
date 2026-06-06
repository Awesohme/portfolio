"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/projects";

/**
 * Star Wars opening crawl. Plays the project's title + brief receding up and
 * away into space, then calls onDone(). Skippable.
 */
export default function Crawl({
  project,
  onDone,
}: {
  project: Project;
  onDone: () => void;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // safety net only — the real handoff happens on the crawl's onAnimationEnd
    // (1.5s delay + 21s anim = 22.5s); fire slightly after as a fallback
    const t = setTimeout(() => finish(), 23500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    if (hidden) return;
    setHidden(true);
    setTimeout(onDone, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-[150] overflow-hidden bg-black transition-opacity duration-700 ${
        hidden ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* starfield */}
      <div className="absolute inset-0 starfield" />

      {/* intro line */}
      <p className="intro absolute left-1/2 top-1/3 w-[80%] -translate-x-1/2 text-center text-[clamp(1rem,2.4vw,1.6rem)] font-light text-[#4aa3ff]">
        In a market far, far away....
      </p>

      {/* crawl: .fade holds perspective, .crawl tilts, .crawl-content scrolls up */}
      <div className="fade">
        <div className="crawl">
          <div className="crawl-content" onAnimationEnd={finish}>
            <p className="crawl-episode">{project.crawlTitle}</p>
            <h1 className="crawl-title">{project.name}</h1>
            {project.crawl.map((para, i) => (
              <p key={i} className="crawl-para">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={finish}
        className="absolute bottom-7 right-7 z-10 rounded-full border border-white/20 px-5 py-2 text-sm text-white/70 transition hover:border-emerald hover:text-white"
      >
        Skip intro →
      </button>

      <style jsx>{`
        .starfield {
          background-image: radial-gradient(1px 1px at 20% 30%, #fff, transparent),
            radial-gradient(1px 1px at 80% 40%, #fff, transparent),
            radial-gradient(1.5px 1.5px at 50% 70%, #cfe, transparent),
            radial-gradient(1px 1px at 35% 80%, #fff, transparent),
            radial-gradient(1px 1px at 65% 20%, #fff, transparent),
            radial-gradient(1px 1px at 10% 60%, #9fe, transparent),
            radial-gradient(1px 1px at 90% 75%, #fff, transparent);
          background-repeat: repeat;
          background-size: 360px 360px;
          opacity: 0.7;
        }
        .intro {
          opacity: 0;
          animation: introFade 2.4s ease-in-out forwards;
          z-index: 2;
        }
        @keyframes introFade {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* perspective container */
        .fade {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          /* larger perspective = text stays closer/flatter = far more readable */
          perspective: 900px;
          overflow: hidden;
          /* darken text as it recedes toward the top */
          -webkit-mask-image: linear-gradient(
            to top,
            transparent 0%,
            #000 14%,
            #000 72%,
            transparent 96%
          );
          mask-image: linear-gradient(
            to top,
            transparent 0%,
            #000 14%,
            #000 72%,
            transparent 96%
          );
        }
        /* the tilted plane — fixed tilt, no movement, no translateX */
        .crawl {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: min(820px, 92vw);
          margin-left: calc(min(820px, 92vw) / -2);
          height: 100%;
          transform-origin: 50% 100%;
          /* gentle tilt so text stays close + legible as it rises */
          transform: rotateX(28deg);
        }
        /* the text — only translateY animates, so it slides straight up the plane */
        .crawl-content {
          position: absolute;
          top: 100%;
          color: #ffd54a;
          text-align: justify;
          font-weight: 600;
          /* comfortable reading pace; minimal overshoot so there's no dead black
             tail before handoff */
          animation: crawlUp 21s linear 1.5s forwards;
          will-change: transform;
        }
        @keyframes crawlUp {
          0% {
            top: 88%;
          }
          100% {
            top: -110%;
          }
        }
        .crawl-episode {
          text-align: center;
          font-size: clamp(1.05rem, 2.4vw, 1.6rem);
          letter-spacing: 0.06em;
          margin-bottom: 0.7em;
          color: #ffe27a;
        }
        .crawl-title {
          text-align: center;
          font-family: var(--font-sora), sans-serif;
          font-weight: 800;
          font-size: clamp(2.2rem, 6vw, 4rem);
          line-height: 1.05;
          margin-bottom: 1.1em;
          text-shadow: 0 0 24px rgba(255, 213, 74, 0.4);
        }
        .crawl-para {
          font-size: clamp(1.4rem, 3.2vw, 2.3rem);
          line-height: 1.6;
          margin-bottom: 1em;
        }
      `}</style>
    </div>
  );
}
