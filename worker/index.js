/**
 * Cloudflare Worker. Alleen /api/* komt hier binnen (run_worker_first in
 * wrangler.jsonc); al het andere serveert Cloudflare direct als statisch bestand.
 */
import { json } from './shared.js';
import { handleContact } from './contact.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    if (pathname.startsWith('/api/')) return json(env, 404, { error: 'niet gevonden' });
    return env.ASSETS.fetch(request);
  }
};
