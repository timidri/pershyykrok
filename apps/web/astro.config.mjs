import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  // Add react() to the integrations array
  integrations: [react()],
});