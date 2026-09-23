# D&W Security website

Astro (static output) deployed to Cloudflare Workers with static assets. Migrated from a single-file HTML template (`../D&W-Security.html`); the body markup of every page is token-identical to that template and the layout is pixel-identical at 1280/390 px.

## Commands
- `npm run dev`: local dev server
- `npm run build`: build to `dist/`
- `npx astro preview`: serve `dist/` with clean URLs and the 404 page
- `npx wrangler deploy --dry-run`: build and validate the Worker and assets. The real deploy runs via Cloudflare Workers Builds on every push to `main`.
- `wrangler dev` does not run on macOS 12 (workerd needs 13.5+). Test `worker/` in Node by importing `worker/index.js` and passing a fake `ASSETS`.

## Architecture
- `src/config.js`: the one settings file. It holds business, contact, legal (KvK, license), social links, `services` (slug, name with `&shy;`, intro, images), `clients` (logo strip) and `endpoints.contact`.
- `src/data/nav.js`: menu, `servicePath`, `tel`/`mailto`, and the `&shy;` helpers (`plain` for text, `attrText` for alt attributes). `src/data/schema.js` builds the LocalBusiness JSON-LD, which is rendered on the homepage only.
- `src/layouts/Base.astro` holds the head (title, meta, canonical, OG), Header, `<main>` and Footer. Its `current` prop marks the active menu link with class `on`.
- `src/layouts/Service.astro` is the service page kind. It renders the top section from `config.services` + `bullets`, then the page's own content in the slot, then `OtherServices`.
- Pages: `/`, `/diensten`, `/diensten/{horeca,evenementen,persoonsbeveiliging,objectbeveiliging}`, `/over-ons`, `/vacatures`, `/contact`, `404`.
- `src/scripts/main.js` runs the burger menu and the quote form. The form POSTs JSON to `config.endpoints.contact` when that is set. Otherwise, or on any error, it falls back to a prefilled `mailto:`.
- `worker/`: `/api/contact` sends mail via Resend (`RESEND_API_KEY`, `MAIL_TO`, `MAIL_FROM` secrets) and returns 501 when those are not configured. Only `/api/*` runs the Worker (`run_worker_first`).
- `public/_headers` holds the CSP and cache headers. `public/_redirects` holds 301s from the old WordPress URLs (`/index.php/...`).
- The homepage has a tiny inline script that redirects legacy one-page links (`/#horeca`) to the real pages.

## JS/CSS contracts
- `.burger`, `.menu` (`.open`), `.quote` form with fields `naam`, `email`, `telefoon`, `dienst`, `bericht`, and the `.ok` status element. The Worker expects the same field names.
- `.logo-track` holds the client list twice (the second copy is `aria-hidden`). The CSS animation scrolls -50%.

## Constraints
- Keep `compressHTML: false`, because whitespace between inline buttons is visible.
- `{` and `}` in page markup are Astro expressions; escape them as `{'{'}`.
- Props holding `&shy;` or `&amp;` markup use `set:html`.
- Images in `public/assets/img` are cached immutable for 1 year. Give a replaced image a new file name.
- Self-hosted fonts are in `public/assets/fonts` with `@font-face` at the top of `site.css`. Nothing loads from third-party origins; keep the CSP at `'self'`.
