import Link from "next/link";
import SpecContactTrigger from "./SpecContactTrigger";
import Arrow from "./Arrow";
import { getSiteSettings } from "@/lib/siteSettings";

/**
 * Shared top bar for all /v2 (Spec) pages.
 * Clean, sticky, mono. Left: doc id; right: section nav + Let's talk (mailto).
 * Musings link and the Let's-talk CTA respect the site toggles.
 */
export default async function SpecNav({
  docId = "Olamide Irojah / Portfolio",
  back,
}: {
  docId?: string;
  /** arrow is drawn: "left" sits before the label (default), "up-right" after it */
  back?: { href: string; label: string; arrow?: "left" | "up-right" };
}) {
  const s = await getSiteSettings();
  return (
    <header className="spec-nav">
      <div className="spec-nav-row">
        <div className="spec-nav-left">
          {back ? (
            <Link href={back.href} className="spec-back">
              {back.arrow === "up-right" ? <>{back.label}&nbsp;<Arrow dir="up-right" /></> : <><Arrow dir="left" />&nbsp;{back.label}</>}
            </Link>
          ) : (
            <span className="spec-nav-id">{docId}</span>
          )}
        </div>

        <nav className="spec-nav-links">
          {s.show.shipped && <Link href="/#shipped">Work</Link>}
          <Link href="/brands">Brand Design</Link>
          <Link href="/about">About</Link>
          {s.show.musingsNav && <Link href="/musings">Musings</Link>}
          {s.show.contact && (
            <SpecContactTrigger
              email={s.email}
              whatsapp={s.whatsapp}
              github={s.githubUrl}
              linkedin={s.linkedinUrl}
              message={s.contactMessage}
            />
          )}
        </nav>
      </div>
    </header>
  );
}
