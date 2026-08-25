# Guía Mercado Libertad Guadalajara

Sitio informativo independiente y sin fines de lucro dedicado al Mercado Libertad / San Juan de Dios de Guadalajara, Jalisco.

## Stack

- Astro 7 + TypeScript 6 (TypeScript 7 no se usa porque `@astrojs/check` todavía requiere la API programática disponible en TypeScript 6.x).
- Tailwind CSS 4 mediante `@tailwindcss/vite`.
- pnpm fijado mediante `packageManager`.
- Cloudflare Workers Static Assets mediante Wrangler, sin base de datos, login ni CMS.

## Desarrollo

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

## Dominio / `site`

No se incluye ningún dominio ficticio. El único punto de configuración del dominio es el campo `site` de `astro.config.mjs`, alimentado por `SITE_URL`.

```bash
SITE_URL=https://tu-dominio-real.mx pnpm build
```

Sin `SITE_URL`, el sitio sigue construyendo correctamente: no se genera sitemap y las etiquetas que requieren URL absoluta se omiten o degradan a rutas relativas.

## Cloudflare Workers Static Assets

`wrangler.jsonc` vive únicamente en la raíz y apunta a `./dist`. No se copia a `dist/`, por lo que no existe el riesgo de resolver `dist/client/dist/client` por rutas relativas duplicadas. El proyecto no usa el mecanismo de Pages ni un `dist/client/wrangler.json` generado.

```bash
pnpm build
pnpm deploy
```

También funciona con un `npx wrangler deploy` ejecutado desde la raíz porque `assets.directory` está presente en `wrangler.jsonc`; el despliegue no depende de un argumento `--assets` oculto en scripts.

## Fuentes principales

- Turismo Guadalajara / Gobierno de Guadalajara.
- Instituto Nacional de Bellas Artes y Literatura (INBAL).
- Grupo Aeroportuario del Pacífico.
- Google Maps para ubicación y valoración agregada.
- Wikimedia Commons para fotografías reales con licencias abiertas.
