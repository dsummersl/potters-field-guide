import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// Set SITE_URL and SITE_BASE in your environment or deployment provider.
// In the SST flow these are injected automatically; for GitHub Pages set them
// as Actions secrets/vars (see README).
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.SITE_BASE || '/',
  output: 'static',
  // Preact powers the Storybook-documented component library. Tailwind is wired
  // through postcss.config.cjs so the exact same pipeline styles both Astro
  // pages and Storybook stories — no drift between the two surfaces.
  integrations: [preact()],
});
