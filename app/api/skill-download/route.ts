import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { callNotifyScript } from "@/lib/notifyScript";
import { clientIp, passesCaptcha } from "@/lib/captcha";
import { ALL_SKILLS_SLUG } from "@/lib/skills";
import { skillZipUrl } from "@/lib/skillsCms";

const BOT_UA = /bot|crawl|spider|slurp|preview|facebookexternalhit|headless/i;

/**
 * Logs a skill download to the Google Sheet (and emails the owner, at most once
 * per visitor, per skill, per day; the Apps Script handles that).
 * Single skills: the card link downloads the zip directly and pings this with a beacon.
 * "Download all": needs the captcha first, then gets the zip URL back.
 * The visitor is identified only by a salted hash of their IP.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const slug = typeof body.slug === "string" ? body.slug.trim().slice(0, 96) : "";
  const target = slug ? await skillZipUrl(slug) : null;
  if (!target) return NextResponse.json({ ok: false, error: "Unknown skill." }, { status: 404 });

  const ip = clientIp(req);
  if (slug === ALL_SKILLS_SLUG && !(await passesCaptcha(body.captcha, ip))) {
    return NextResponse.json({ ok: false, error: "Please complete the check and try again." }, { status: 400 });
  }

  const ua = req.headers.get("user-agent") || "";
  if (!BOT_UA.test(ua)) {
    const visitor = createHash("sha256")
      .update(`${ip || "unknown"}|${process.env.NOTIFY_SCRIPT_SECRET || ""}`)
      .digest("hex")
      .slice(0, 16);
    try {
      await callNotifyScript({ action: "download", slug, skill: target.name, visitor });
    } catch (err) {
      // logging is best-effort: the download itself must never fail because of it
      console.error("skill download log failed", err);
    }
  }
  return NextResponse.json({ ok: true, url: target.url });
}
