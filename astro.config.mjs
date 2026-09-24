import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.chrishawk.net',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  image: {
    layout: 'constrained',
  },
  // Keep the old Squarespace URLs working.
  redirects: {
    '/projects': '/work',
    '/resume': '/about',
  },
});
