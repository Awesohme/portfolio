import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { callNotifyScript } from "@/lib/notifyScript";
import { makePreview, slugify } from "@/lib/musings";

type MusingWebhook = { _id?: string; title?: string; notes?: string; stage?: string };

/**
 * Sanity webhook (musing published) → emails everyone on the subscribers sheet.
 * The Apps Script remembers which musings it already sent, so later edits
 * to a published musing don't email people again.
 */
export async function POST(req: NextRequest) {
  const { isValidSignature, body } = await parseBody<MusingWebhook>(req, process.env.SANITY_WEBHOOK_SECRET);
  if (!isValidSignature) return NextResponse.json({ ok: false, error: "invalid-signature" }, { status: 401 });
  if (!body?._id || !body.title || body.stage?.trim() !== "published") {
    return NextResponse.json({ ok: true, skipped: "not-published" });
  }
  const id = body._id.replace(/^drafts\./, "");
  const site = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin).replace(/\/$/, "");
  const result = await callNotifyScript({
    action: "notify",
    id,
    title: body.title,
    preview: body.notes ? makePreview(body.notes) : "",
    url: `${site}/musings/${slugify(body.title)}`,
  });
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
