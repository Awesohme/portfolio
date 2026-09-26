/**
 * Server-only bridge to the "Get Notified" Google Apps Script (scripts/notify-apps-script.gs).
 * The script URL + shared secret stay on the server; the browser only talks to /api/*.
 */
export async function callNotifyScript(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string; [k: string]: unknown }> {
  const url = process.env.NOTIFY_SCRIPT_URL;
  const secret = process.env.NOTIFY_SCRIPT_SECRET;
  if (!url || !secret) return { ok: false, error: "not-configured" };
  // Apps Script answers POSTs with a redirect to the result; fetch follows it.
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...payload, secret }),
    cache: "no-store",
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: `bad-response-${res.status}` };
  }
}
