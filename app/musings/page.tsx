import Link from "next/link";
import Gargantua from "@/components/Gargantua";

export const metadata = {
  title: "Musings — Olamide Irojah",
  description: "Notes on product, building, and the hard part: deciding what not to build. Coming soon.",
};

export default function MusingsPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-[#f1f6f3]">
      {/* starfield backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 15% 25%, #fff, transparent), radial-gradient(1px 1px at 75% 35%, #cfe, transparent), radial-gradient(1.5px 1.5px at 45% 70%, #9fe, transparent), radial-gradient(1px 1px at 85% 80%, #fff, transparent), radial-gradient(1px 1px at 30% 85%, #fff, transparent)",
          backgroundSize: "320px 320px",
        }}
      />

      <Link
        href="/"
        className="absolute left-[6vw] top-8 z-10 inline-flex items-center gap-2 text-sm text-muted transition hover:text-emerald-soft"
      >
        ← Back to the galaxy
      </Link>

      <div className="relative z-[1] flex flex-col items-center">
        <Gargantua />

        <div className="-mt-8 sm:-mt-10">
          <p className="text-[.72rem] uppercase tracking-[.22em] text-emerald-soft">
            Musings
          </p>
          <h1 className="mt-3 font-sora text-[clamp(2rem,6vw,3.5rem)] font-extrabold leading-none">
            Coming soon
          </h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Notes on product, building, and the hard part — deciding what{" "}
            <span className="text-white">not</span> to build. Pulled past the
            horizon shortly.
          </p>
        </div>
      </div>
    </main>
  );
}
