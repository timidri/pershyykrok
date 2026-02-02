import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  // Redirect root to default locale (no "Redirecting..." page; handled by host)
  redirects: {
    '/': '/ua',
  },
});