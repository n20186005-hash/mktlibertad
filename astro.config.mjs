import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const configuredSite = process.env.SITE_URL?.trim();
const site = configuredSite || 'https://mktlibertad.com';

export default defineConfig({
  site,
  output: 'static',
  integrations: [...(site ? [sitemap()] : [])],
  vite: {
    plugins: [tailwindcss()]
  }
});
