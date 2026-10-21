# Mercado Libertad visitor guide

Independent Spanish and English visitor guide with Spanish legal pages. It does not represent the market or traders and does not sell tickets or take reservations.

## Build

Use the pinned Node and pnpm versions in package.json. Run `pnpm install --frozen-lockfile`, `pnpm check` and `pnpm build`. Cloudflare builds from source; generated dist remains ignored and untracked, as in the baseline. `pnpm exec wrangler deploy --dry-run` validates the Worker bundle without publishing.

The Worker project is `mktlibertad`, identified from the repository’s official Cloudflare build check. ASSETS serves generated files; the Worker handles HTTPS/apex redirects and true noindex 404 responses. No absolute-URL _redirects rules are required.

## Editorial scope

Sources checked 20 October 2026 are linked in the guide. Municipal inauguration and INBAL work dates are attributed separately. A published general schedule does not establish every trader’s hours, entrance availability or facilities. Transport details must be checked with SITEUR. Photographs are dated and individually credited; source and licence records are in PHOTO-CREDITS.md.

Google Analytics is optional and off by default. Consent uses strict booleans; a failed permanent refusal is backed by a tab-session veto where storage works. If both stores fail, the message states that only the current page is protected. No account, booking, contact form or email submission exists. Maps are external links.
