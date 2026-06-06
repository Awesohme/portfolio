"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { projects } from "@/lib/projects";
import WarpTransition from "./WarpTransition";

type Node = {
  slug: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

export default function Hero() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouse = useRef({ x: -999, y: -999 });
  const cursor = useRef<HTMLDivElement>(null);
  const hovered = useRef<string | null>(null);

  const [warp, setWarp] = useState(false);
  const [warpOrigin, setWarpOrigin] = useState<{ x: number; y: number } | null>(null);
  const pendingSlug = useRef<string | null>(null);

  const launchWarp = useCallback(
    (slug: string, x: number, y: number) => {
      if (warp) return;
      pendingSlug.current = slug;
      setWarpOrigin({ x, y });
      setWarp(true);
    },
    [warp]
  );

  const onWarpComplete = useCallback(() => {
    if (pendingSlug.current) router.push(`/work/${pendingSlug.current}`);
  }, [router]);

  // ---- constellation canvas ----
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = 0,
      H = 0,
      raf = 0;

    function build() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      nodesRef.current = projects.map((p) => ({
        slug: p.slug,
        label: p.node,
        x: Math.random() * W * 0.8 + W * 0.1,
        y: Math.random() * H * 0.55 + H * 0.18,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 0,
      }));
    }
    build();

    // twinkling background stars (all glow)
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * Math.PI * 2,
      s: Math.random() * 0.025 + 0.006,
      hue: Math.random() < 0.25 ? 160 : 0, // some emerald-tinted, rest white
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // stars — every star glows + twinkles
      for (const s of stars) {
        s.a += s.s;
        const tw = 0.55 + Math.abs(Math.sin(s.a)) * 0.45; // floor 0.55 so all stay visible
        // soft glow halo
        const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        if (s.hue) {
          halo.addColorStop(0, `rgba(110,231,183,${tw * 0.5})`);
          halo.addColorStop(1, "rgba(110,231,183,0)");
        } else {
          halo.addColorStop(0, `rgba(220,255,240,${tw * 0.45})`);
          halo.addColorStop(1, "rgba(220,255,240,0)");
        }
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, 7);
        ctx.fill();
        // bright core
        ctx.fillStyle = s.hue
          ? `rgba(180,255,220,${tw})`
          : `rgba(255,255,255,${tw})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 7);
        ctx.fill();
      }

      const nodes = nodesRef.current;
      // movement
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 60 || n.x > W - 60) n.vx *= -1;
        if (n.y < 90 || n.y > H * 0.82) n.vy *= -1;
      }
      // links between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i],
            b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 230) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(16,185,129,${(1 - d / 230) * 0.28})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      // mouse links + hover detection
      hovered.current = null;
      for (const n of nodes) {
        const dm = Math.hypot(n.x - mouse.current.x, n.y - mouse.current.y);
        if (dm < 220) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.strokeStyle = `rgba(52,211,153,${(1 - dm / 220) * 0.45})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        if (dm < 26) hovered.current = n.slug;
      }
      // nodes
      for (const n of nodes) {
        const isHover = hovered.current === n.slug;
        const glow = isHover ? 22 : 14;
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glow);
        g.addColorStop(0, `rgba(16,185,129,${isHover ? 1 : 0.85})`);
        g.addColorStop(1, "rgba(16,185,129,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glow, 0, 7);
        ctx.fill();
        ctx.fillStyle = isHover ? "#9ff5d2" : "#34D399";
        ctx.beginPath();
        ctx.arc(n.x, n.y, isHover ? 3.6 : 2.6, 0, 7);
        ctx.fill();
        ctx.fillStyle = isHover ? "rgba(225,255,243,.95)" : "rgba(220,246,237,.7)";
        ctx.font = `${isHover ? "600 " : ""}11px var(--font-grotesk), sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y - 14);
      }

      // cursor style hint
      canvas.style.cursor = hovered.current ? "pointer" : "default";
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onClick = (e: MouseEvent) => {
      // find node under click
      const nodes = nodesRef.current;
      for (const n of nodes) {
        if (Math.hypot(n.x - e.clientX, n.y - e.clientY) < 28) {
          launchWarp(n.slug, n.x, n.y);
          return;
        }
      }
    };
    const onResize = () => build();
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, [launchWarp]);

  // ---- magnetic cursor ----
  useEffect(() => {
    let cx = innerWidth / 2,
      cy = innerHeight / 2,
      tx = cx,
      ty = cy,
      raf = 0;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      if (cursor.current) {
        cursor.current.style.left = cx + "px";
        cursor.current.style.top = cy + "px";
        cursor.current.style.width = hovered.current ? "10px" : "32px";
        cursor.current.style.height = hovered.current ? "10px" : "32px";
        cursor.current.style.background = hovered.current ? "#34D399" : "transparent";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    loop();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  // ---- count-up stats ----
  const statRefs = useRef<(HTMLSpanElement | null)[]>([]);
  useEffect(() => {
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const run = (node: HTMLSpanElement) => {
      const to = parseFloat(node.dataset.to!);
      const pre = node.dataset.pre || "";
      const suf = node.dataset.suf || "";
      const dec = to % 1 !== 0;
      const dur = 1600;
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const v = ease(p) * to;
        const out =
          to >= 1000
            ? Math.floor(v).toLocaleString()
            : dec
            ? v.toFixed(1)
            : Math.floor(v).toString();
        node.textContent = pre + out + suf;
        if (p < 1) requestAnimationFrame(step);
        else node.textContent = pre + (dec ? to.toFixed(1) : to.toLocaleString()) + suf;
      };
      requestAnimationFrame(step);
    };
    const t = setTimeout(() => statRefs.current.forEach((n) => n && run(n)), 800);
    return () => clearTimeout(t);
  }, []);

  // ---- typed roles ----
  const typedRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const roles = [
      "to business outcome.",
      "to activation lift.",
      "to retention.",
      "to revenue.",
      "to a validated bet.",
    ];
    let r = 0,
      c = 0,
      del = false,
      timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const w = roles[r];
      if (typedRef.current)
        typedRef.current.textContent = del ? w.slice(0, c--) : w.slice(0, c++);
      if (!del && c === w.length + 1) {
        del = true;
        timer = setTimeout(type, 1600);
        return;
      }
      if (del && c < 0) {
        del = false;
        r = (r + 1) % roles.length;
        c = 0;
      }
      timer = setTimeout(type, del ? 40 : 75);
    };
    timer = setTimeout(type, 1200);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { to: "5.2", pre: "$", suf: "M", label: "Annual GMV" },
    { to: "59700", suf: "+", label: "Users scaled to" },
    { to: "18000", suf: "+", label: "Monthly orders" },
    { to: "12", suf: "+", label: "Products driving outcomes" },
  ];

  return (
    <main className="custom-cursor relative min-h-screen overflow-hidden bg-ink text-[#f1f6f3]">
      {/* aurora */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] z-0"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 0%, rgba(16,185,129,.22), transparent 70%), radial-gradient(50% 50% at 20% 10%, rgba(20,120,90,.16), transparent 70%)",
        }}
      />
      {/* grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(circle at 50% 30%, #000 0%, transparent 75%)",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div
        ref={cursor}
        className="pointer-events-none fixed z-[90] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald transition-[width,height,background] duration-200 md:block"
        style={{ mixBlendMode: "screen" }}
      />

      {/* nav */}
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[6vw] py-5 backdrop-blur-md">
        <div className="flex items-center gap-2.5 font-sora text-[1.05rem] font-bold tracking-tight">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald shadow-glow" />
          OLAMIDE IROJAH
        </div>
        <div className="flex items-center gap-1.5">
          <a href="#work" className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:text-white sm:block">
            Work
          </a>
          <a href="#about" className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted transition hover:text-white sm:block">
            About
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-medium transition hover:border-emerald hover:shadow-glow"
          >
            Let&apos;s talk →
          </a>
        </div>
      </nav>

      {/* hero content */}
      <header className="relative z-10 mx-auto max-w-[1180px] px-[6vw] pb-24 pt-[170px] text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-emerald/[.06] px-[18px] py-[9px] text-[.76rem] font-semibold uppercase tracking-[.18em] text-emerald-soft">
          <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-emerald-glow shadow-glow" />
          Open to senior product roles
        </span>

        <h1 className="mx-auto mt-7 font-sora text-[clamp(2.4rem,6.4vw,5.4rem)] font-extrabold leading-[1.02] tracking-[-.03em]">
          <span className="block">From bet</span>
          <span
            className="block bg-gradient-to-r from-emerald via-emerald-glow to-white bg-clip-text text-transparent"
            style={{ textShadow: "0 0 60px rgba(16,185,129,.5)" }}
          >
            <span ref={typedRef} />
            <span className="ml-1 inline-block h-[.78em] w-[3px] translate-y-[2px] animate-blink rounded-sm bg-emerald align-baseline" />
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-[620px] text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed text-muted">
          I turn ambiguous goals into <b className="text-white">product bets and measurable results</b> — fast,
          with AI-native prototyping, validated before the engineering spend. <b className="text-white">4+ years</b> scaling
          B2B SaaS across emerging markets.
        </p>

        {/* ticker */}
        <div className="mx-auto mt-10 inline-flex flex-wrap items-stretch overflow-hidden rounded-2xl border border-white/10 bg-white/[.02] backdrop-blur">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex min-w-[150px] flex-col gap-1 border-r border-white/10 px-6 py-[18px] last:border-r-0"
            >
              <span
                ref={(el) => {
                  statRefs.current[i] = el;
                }}
                data-to={s.to}
                data-pre={s.pre || ""}
                data-suf={s.suf || ""}
                className="bg-gradient-to-r from-white to-emerald-soft bg-clip-text font-sora text-[clamp(1.4rem,3vw,2rem)] font-bold text-transparent"
              >
                {(s.pre || "") + "0" + (s.suf || "")}
              </span>
              <span className="text-[.72rem] uppercase tracking-wide text-muted">{s.label}</span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="mt-9 flex flex-wrap justify-center gap-3.5">
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald px-7 py-[15px] font-semibold text-[#06150f] shadow-glow transition hover:-translate-y-0.5"
          >
            ▸ Enter the work
          </a>
          <a
            href="/resume.pdf"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.02] px-7 py-[15px] font-semibold transition hover:-translate-y-0.5 hover:border-emerald"
          >
            ⬇ Résumé
          </a>
        </div>

        {/* constellation hint */}
        <div id="work" className="mt-16 scroll-mt-24 text-[.74rem] uppercase tracking-[.18em] text-muted">
          — Click a glowing project to jump in —
        </div>
        <div className="mt-3.5 flex flex-wrap justify-center gap-x-5 gap-y-2">
          {projects.slice(0, 8).map((p) => (
            <button
              key={p.slug}
              onClick={() => {
                const n = nodesRef.current.find((nd) => nd.slug === p.slug);
                launchWarp(p.slug, n ? n.x : innerWidth / 2, n ? n.y : innerHeight / 2);
              }}
              className="flex items-center gap-2 text-sm text-muted transition hover:text-emerald-soft"
            >
              <span className="h-2 w-2 rounded-full bg-emerald shadow-glow" />
              {p.node}
            </button>
          ))}
        </div>
      </header>

      <WarpTransition active={warp} origin={warpOrigin} onComplete={onWarpComplete} />
    </main>
  );
}
