import Link from "next/link";
import SpecContactTrigger from "./SpecContactTrigger";

/**
 * Shared top bar for all /v2 (Spec) pages.
 * Clean, sticky, mono. Left: doc id; right: section nav + Let's talk (mailto).
 * `left` overrides the doc-id label per page (e.g. a "← all specs" back link slot).
 */
export default function SpecNav({
  docId = "PRD · OLAMIDE_IROJAH · v2.0",
  back,
}: {
  docId?: string;
  back?: { href: string; label: string };
}) {
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
          <Link href="/v2#shipped">Shipped</Link>
          <Link href="/v2/about">About</Link>
          <Link href="/v2/musings">Musings</Link>
          <SpecContactTrigger />
        </nav>
      </div>
    </header>
  );
}
