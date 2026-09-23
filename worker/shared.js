/**
 * Gedeelde logica voor de formulier-endpoints (Cloudflare Worker).
 * Verstuurt e-mail via Resend (https://resend.com) wanneer RESEND_API_KEY is gezet.
 * Andere provider? Vervang alleen sendMail() hieronder.
 */

export const cors = (env) => ({
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
});

export const json = (env, status, body) =>
  new Response(JSON.stringify(body), { status, headers: cors(env) });

/** Knipt te lange invoer af en haalt regeleindes uit één-regelvelden. */
export function clean(value, max = 500, singleLine = false) {
  let text = String(value ?? '').trim().slice(0, max);
  if (singleLine) text = text.replace(/[\r\n]+/g, ' ');
  return text;
}

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

/**
 * Verstuurt een e-mail. Ontbreken de omgevingsvariabelen, dan geeft deze functie
 * { ok: false, reason: 'not-configured' } terug — de website valt dan terug op
 * een vooringevulde e-mail bij de bezoeker.
 */
export async function sendMail(env, { subject, html, replyTo }) {
  const key  = env.RESEND_API_KEY;
  const to   = env.MAIL_TO;
  const from = env.MAIL_FROM;

  if (!key || !to || !from) return { ok: false, reason: 'not-configured' };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: to.split(',').map((address) => address.trim()),
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {})
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    return { ok: false, reason: `mail-failed ${response.status} ${detail.slice(0, 200)}` };
  }
  return { ok: true };
}

/** Heel eenvoudige snelheidsbegrenzing per IP (per instantie, best effort). */
const hits = new Map();
export function rateLimited(ip, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
}
