import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
  // Redirect root to default locale (no "Redirecting..." page; handled by host)
  redirects: {
    '/': '/ua',
  },
});
