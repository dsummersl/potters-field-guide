import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Set SITE_URL and SITE_BASE in your environment or GitHub Actions secrets/vars.
// Example for GitHub Pages project site:
//   SITE_URL=https://yourusername.github.io
//   SITE_BASE=/your-repo-name
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.SITE_BASE || '/',
  output: 'static',
  integrations: [tailwind()],
});
