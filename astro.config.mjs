import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import config from './src/config.js';

export default defineConfig({
  site: config.business.url,
  trailingSlash: 'never',
  // contact.html on disk, served by Cloudflare as /contact
  build: { format: 'file' },
  // whitespace between inline elements (buttons, links) is visible; keep it
  compressHTML: false,
  // site script as /_astro/*.js (not inlined): cacheable, CSP-friendly, deploy hash check
  vite: { build: { assetsInlineLimit: 0 } },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404') })]
});
