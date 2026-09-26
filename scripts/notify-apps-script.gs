/**
 * "Get Notified" email list — Google Apps Script, bound to the subscribers sheet.
 *
 * Setup (once): open the Google Sheet → Extensions → Apps Script → paste this
 * file → Project Settings → Script properties → add SECRET (same value as
 * NOTIFY_SCRIPT_SECRET in the site env) → Deploy → New deployment → Web app,
 * "Execute as: Me", "Who has access: Anyone" → copy the /exec URL into
 * NOTIFY_SCRIPT_URL.
 *
 * Tabs (created automatically on first use):
 *   Subscribers: email | joined | status (active/unsubscribed) | token | name
 *   Sent:        musing id | title | sent at | recipients
 *
 * The site calls this from its server only (/api/subscribe, /api/musing-published),
 * so SECRET never reaches the browser. Unsubscribe links hit doGet directly.
 */

const SUBSCRIBERS = "Subscribers";
const SENT = "Sent";

function sheet_(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
  }
  return sh;
}

function subscribers_() {
  const sh = sheet_(SUBSCRIBERS, ["email", "joined", "status", "token", "name"]);
  // sheets created before names were collected: add the header
  if (!sh.getRange(1, 5).getValue()) sh.getRange(1, 5).setValue("name");
  return sh;
}

function sent_() {
  return sheet_(SENT, ["musing id", "title", "sent at", "recipients"]);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: "bad-json" });
  }
  const secret = PropertiesService.getScriptProperties().getProperty("SECRET");
  if (!secret || body.secret !== secret) return json_({ ok: false, error: "unauthorised" });

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    if (body.action === "subscribe") return json_(subscribe_(body));
    if (body.action === "notify") return json_(notify_(body));
    return json_({ ok: false, error: "unknown-action" });
  } finally {
    lock.releaseLock();
  }
}

function subscribe_(body) {
  const email = String(body.email || "").trim().toLowerCase();
  const name = String(body.name || "").trim().slice(0, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "invalid-email" };
  const sh = subscribers_();
  const rows = sh.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]).toLowerCase() === email) {
      // re-subscribing someone who left: flip them back to active
      if (rows[i][2] !== "active") sh.getRange(i + 1, 3).setValue("active");
      if (name && !rows[i][4]) sh.getRange(i + 1, 5).setValue(name);
      return { ok: true, already: true };
    }
  }
  sh.appendRow([email, new Date(), "active", Utilities.getUuid(), name]);
  return { ok: true };
}

function notify_(body) {
  const id = String(body.id || "");
  if (!id || !body.title || !body.url) return { ok: false, error: "missing-fields" };

  const sent = sent_();
  const sentIds = sent.getDataRange().getValues().slice(1).map((r) => String(r[0]));
  if (sentIds.indexOf(id) !== -1) return { ok: true, skipped: "already-sent" };

  const rows = subscribers_().getDataRange().getValues().slice(1);
  const active = rows.filter((r) => r[2] === "active" && r[0]);
  const base = ScriptApp.getService().getUrl();
  const from = body.fromName || "Olamide Irojah";

  active.forEach((r) => {
    const unsub = base + "?action=unsubscribe&token=" + encodeURIComponent(r[3]);
    const first = String(r[4] || "").trim().split(/\s+/)[0];
    const hi = first ? "Hi " + first + "," : "Hi,";
    const html =
      '<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#1f1d1a;line-height:1.6">' +
      '<p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b665c">New musing</p>' +
      '<p style="margin:0 0 8px">' + escape_(hi) + " a new musing is up.</p>" +
      '<h1 style="font-size:24px;margin:0 0 12px">' + escape_(body.title) + "</h1>" +
      (body.preview ? '<p style="margin:0 0 20px">' + escape_(body.preview) + "</p>" : "") +
      '<p><a href="' + body.url + '" style="display:inline-block;background:#1f1d1a;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none">Read it →</a></p>' +
      '<p style="font-size:12px;color:#8a8478;margin-top:32px">You are getting this because you asked to be notified about new writing from ' + escape_(from) + '. <a href="' + unsub + '" style="color:#8a8478">Unsubscribe</a></p>' +
      "</div>";
    MailApp.sendEmail({
      to: r[0],
      subject: "New musing: " + body.title,
      htmlBody: html,
      body: hi + " a new musing is up.\n\n" + body.title + "\n\n" + (body.preview || "") + "\n\nRead it: " + body.url + "\n\nUnsubscribe: " + unsub,
      name: from,
    });
  });

  sent.appendRow([id, body.title, new Date(), active.length]);
  return { ok: true, sent: active.length };
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  let message = "Nothing to do here.";
  if (p.action === "unsubscribe" && p.token) {
    const sh = subscribers_();
    const rows = sh.getDataRange().getValues();
    message = "That link has expired or was already used.";
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][3] === p.token) {
        sh.getRange(i + 1, 3).setValue("unsubscribed");
        message = "You're unsubscribed. You won't get any more emails about new musings.";
        break;
      }
    }
  }
  return HtmlService.createHtmlOutput(
    '<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#1f1d1a"><p>' +
      message +
      "</p></div>"
  );
}

function escape_(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
