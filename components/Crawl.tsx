"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/lib/projects";

/**
 * Star Wars opening crawl. Plays the project's title + brief receding into
 * space, then calls onDone(). Skippable.
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
    const t = setTimeout(() => finish(), 19000); // crawl length + buffer
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

      {/* intro "A long time ago" line */}
      <p className="intro absolute left-1/2 top-1/3 w-[80%] -translate-x-1/2 text-center text-[clamp(1rem,2.4vw,1.6rem)] font-light text-[#4aa3ff]">
        In a market far, far away....
      </p>

      {/* crawl */}
      <div className="crawl-viewport">
        <div className="crawl-content">
          <p className="crawl-episode">{project.crawlTitle}</p>
          <h1 className="crawl-title">{project.name}</h1>
          {project.crawl.map((para, i) => (
            <p key={i} className="crawl-para">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* fade to space at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black to-transparent" />

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
          background-size: 400px 400px;
          opacity: 0.7;
        }
        .intro {
          opacity: 0;
          animation: introFade 5s ease-in-out forwards;
        }
        @keyframes introFade {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .crawl-viewport {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          perspective: 380px;
          perspective-origin: 50% 100%;
          overflow: hidden;
        }
        .crawl-content {
          position: absolute;
          top: 100%;
          left: 50%;
          width: min(720px, 86vw);
          transform-origin: 50% 0%;
          transform: translateX(-50%) rotateX(28deg);
          color: #ffd54a;
          text-align: justify;
          font-weight: 600;
          animation: crawlUp 18s linear 4.5s forwards;
          opacity: 0;
        }
        @keyframes crawlUp {
          0% {
            top: 100%;
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            top: -160%;
            opacity: 0;
          }
        }
        .crawl-episode {
          text-align: center;
          font-size: clamp(0.9rem, 2vw, 1.3rem);
          letter-spacing: 0.06em;
          margin-bottom: 0.6em;
        }
        .crawl-title {
          text-align: center;
          font-family: var(--font-sora), sans-serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 5vw, 3.4rem);
          line-height: 1.05;
          margin-bottom: 1.1em;
          text-shadow: 0 0 24px rgba(255, 213, 74, 0.4);
        }
        .crawl-para {
          font-size: clamp(1.1rem, 2.6vw, 1.9rem);
          line-height: 1.5;
          margin-bottom: 1em;
        }
      `}</style>
    </div>
  );
}
