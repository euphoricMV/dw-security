/**
 * POST /api/contact
 * Neemt een offerteaanvraag uit het formulier op /contact aan en mailt die door.
 * Velden (zoals het formulier ze verstuurt): naam, email, telefoon, dienst, bericht.
 */
import { json, clean, isEmail, escapeHtml, sendMail, rateLimited, cors } from './shared.js';

const DIENSTEN = ['Horeca', 'Evenementen', 'Persoonsbeveiliging', 'Objectbeveiliging', 'Anders'];

export async function handleContact(request, env) {
  if (request.method === 'OPTIONS') return new Response('', { headers: cors(env) });
  if (request.method !== 'POST') return json(env, 405, { error: 'method' });

  const ip = request.headers.get('cf-connecting-ip') || 'onbekend';
  if (rateLimited(ip)) {
    return json(env, 429, { error: 'te veel aanvragen' });
  }

  let data;
  try { data = await request.json(); }
  catch { return json(env, 400, { error: 'ongeldige json' }); }

  const payload = {
    naam:     clean(data.naam, 80, true),
    email:    clean(data.email, 120, true),
    telefoon: clean(data.telefoon, 30, true),
    dienst:   clean(data.dienst, 40, true),
    bericht:  clean(data.bericht, 2000)
  };
  if (!DIENSTEN.includes(payload.dienst)) payload.dienst = 'Anders';

  if (payload.naam.length < 2 || !isEmail(payload.email)) {
    return json(env, 422, { error: 'naam of e-mail ontbreekt' });
  }

  const html = `
    <h2>Offerteaanvraag via de website</h2>
    <p><strong>Dienst:</strong> ${escapeHtml(payload.dienst)}</p>
    <p><strong>Naam:</strong> ${escapeHtml(payload.naam)}<br>
       <strong>E-mail:</strong> ${escapeHtml(payload.email)}<br>
       <strong>Telefoon:</strong> ${escapeHtml(payload.telefoon || '—')}</p>
    <p>${payload.bericht ? escapeHtml(payload.bericht).replace(/\n/g, '<br>') : '<em>Geen bericht</em>'}</p>
    <hr><p style="color:#888;font-size:12px">Verstuurd via ${escapeHtml(new URL(request.url).hostname)}</p>`;

  const result = await sendMail(env, {
    subject: `Offerteaanvraag — ${payload.dienst} — ${payload.naam}`,
    html,
    replyTo: payload.email
  });

  if (!result.ok) {
    const status = result.reason === 'not-configured' ? 501 : 502;
    return json(env, status, { error: result.reason });
  }
  return json(env, 200, { ok: true });
}
