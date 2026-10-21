import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({site:'https://mktlibertad.com',trailingSlash:'always',output:'static',integrations:[sitemap({filter:(page)=>['https://mktlibertad.com/','https://mktlibertad.com/en/'].includes(page)})],vite:{plugins:[tailwindcss()]}});
