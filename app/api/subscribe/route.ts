import { NextResponse } from "next/server";
import { callNotifyScript } from "@/lib/notifyScript";
import { clientIp, passesCaptcha } from "@/lib/captcha";

/** "Get Notified" form → adds the name + email to the subscribers Google Sheet. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // honeypot filled → a bot; pretend it worked
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
  if (!name) {
    return NextResponse.json({ ok: false, error: "Please add your name." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  const ip = clientIp(req);
  if (!(await passesCaptcha(body.captcha, ip))) {
    return NextResponse.json({ ok: false, error: "Please complete the check and try again." }, { status: 400 });
  }
  try {
    const result = await callNotifyScript({ action: "subscribe", email, name });
    if (!result.ok) throw new Error(String(result.error));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("subscribe failed", err);
    return NextResponse.json({ ok: false, error: "Couldn't add you just now. Please try again in a moment." }, { status: 502 });
  }
}
