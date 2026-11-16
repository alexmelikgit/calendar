# Handover — Տոնացույց

A monthly Armenian Apostolic Church calendar, originally built for Art-Group
LLC. Armenian is the default; English is available. Visitors can arrive from
QR codes printed on a physical calendar. Preserve these month links.

## Current architecture

This fork migrated from Next.js static export to Vite / React 19 SPA for
shared cPanel hosting. The original export generated 36,000 files for 7,224
month routes. The SPA calculates each month at runtime and ships one HTML
entry plus assets. No Next.js server, RSC payloads, or per-year build loop.

- src/main.tsx: fonts, styles, BrowserRouter, application entry.
- src/App.tsx: locale/month/feast URL selection, current Armenia month,
  unprefixed Armenian URL redirects, document language.
- src/pages/MonthPage.tsx: builds a month grid and selects its local events.
- src/pages/FeastPage.tsx: full feast text and known dates.
- src/pages/NotFound.tsx: invalid route screen.
- src/components/: original calendar layout, navigation, picker, dialogs,
  illustration, event list and filters. Links use React Router.
- src/lib/calendar.ts: date/grid calculations and URL helpers.
- src/lib/content.ts: synchronous access to local content files.
- src/content/{feasts,month-themes,categories,types}.ts: all editable content.
- src/i18n/: locale configuration, UI dictionary, date formatting.
- src/styles.css: Tailwind 4 tokens, colors, type, dialogs and animation.
- public/illustrations/: twelve original PNGs, month-01.png–month-12.png.
- scripts/prepare-assets.mjs: production WebP copies; originals unchanged.
- public/.htaccess: Apache SPA rewrites, including legacy export directories.

The original responsive layout and colors are preserved. Noto Sans Armenian
and Noto Serif Armenian fonts remain self-hosted. The picker supports
1900–2200; only feast dates explicitly supplied in content appear as events.
There is no CMS or database in this version. If adding a CMS later, adapt
content loading and its loading/error states without changing content types.

## Validation and deploy

Use Node.js 24. Run npm ci, npm run lint, npm run check and npm run build.
The calendar checks cover languages, boundary years, leap day, feast and
invalid routes, filtering, and language-switch query preservation. Browser
checks additionally cover interactions and direct-link refresh on Apache.

See README.md for local commands and DEPLOYMENT.md for the actual hostname,
destination, repository secrets, automatic FTPS deployment and rollback.
