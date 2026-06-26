import Link from "next/link";
import SpecContactTrigger from "./SpecContactTrigger";
import { getSiteSettings } from "@/lib/siteSettings";

/**
 * Shared top bar for all /v2 (Spec) pages.
 * Clean, sticky, mono. Left: doc id; right: section nav + Let's talk (mailto).
 * Musings link and the Let's-talk CTA respect the site toggles.
 */
export default async function SpecNav({
  docId = "PRD · OLAMIDE_IROJAH · v2.0",
  back,
}: {
  docId?: string;
  back?: { href: string; label: string };
}) {
  const s = await getSiteSettings();
  return (
    <header className="spec-nav">
      <div className="spec-nav-row">
        <div className="spec-nav-left">
          {back ? (
            <Link href={back.href} className="spec-back">
              {back.label}
            </Link>
          ) : (
            <span className="spec-nav-id">{docId}</span>
          )}
        </div>

        <nav className="spec-nav-links">
          {s.show.shipped && <Link href="/v2#shipped">Shipped</Link>}
          <Link href="/v2/about">About</Link>
          {s.show.musingsNav && <Link href="/v2/musings">Musings</Link>}
          {s.show.contact && <SpecContactTrigger />}
        </nav>
      </div>
    </header>
  );
}
