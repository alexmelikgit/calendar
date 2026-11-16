# oratsuyts.bardzunk.am on cPanel

Production is a static React SPA. Node.js runs in GitHub Actions only.
Apache must allow `.htaccess` and mod_rewrite. Direct month and feast URLs
are internally rewritten to index.html; the browser handles navigation.

## Destination

- Domain: https://oratsuyts.bardzunk.am
- Separate document root: /home1/bardzunk/oratsuyts.bardzunk.am
- Dedicated jailed FTP account: oratsuyts-deploy@oratsuyts.bardzunk.am
- Verified explicit FTPS server: rs003.webhostbox.net, port 21
- FTP_REMOTE_DIR: / (relative to the jailed account)

Never deploy to bardzunk.am's WordPress root. Keep TLS verification enabled.
The FTP server certificate covers rs003.webhostbox.net; bardzunk.am and
ftp.bardzunk.am do not match that certificate.

## GitHub Actions

Repository: alexmelikgit/calendar. Main pushes and pull requests run install,
lint, calendar checks and production build, then retain a calendar-static
artifact for seven days. Only main deploys, and only if repository variable
DEPLOY_ENABLED is true. A newer run cancels an older run to prevent overlapping
uploads. Repository secrets are FTP_HOST, FTP_USER, FTP_PASSWORD and
FTP_REMOTE_DIR. Never put credentials in source files.

Only out/ is uploaded: about two dozen files instead of 36,000. Original
PNGs are resized to at most 1600 pixels wide and converted to WebP during
the build. Assets arrive before index.html, and .htaccess is uploaded last.
Interrupted FTPS connections retry automatically. Remote files are never
deleted; files left from an older Next.js export are bypassed by the SPA
rewrite rules and can be cleaned up separately.

## Verify

- Root selects Armenian and the current month using Asia/Yerevan time.
- /2027/01?day=2027-01-06 redirects in the browser to the Armenian month.
- /hy/2027/01 and /en/2027/01 load directly and after refresh.
- Month navigation, browser Back/Forward, picker, filters, day dialogs,
  feast pages, language switch, illustrations and fonts work.
- Invalid routes show the in-app not-found screen (HTTP 200 SPA fallback).
- Calendar years are 1900–2200; feasts appear only on dates present in
  src/content/feasts.ts. This migration does not invent missing-year events.

For local development use npm run dev, and npm run build then npm run preview
for production assets. Apache-specific rewrites must be checked on Apache.

## Rollback

Set DEPLOY_ENABLED=false to pause uploads. Revert the faulty commit, let the
checks pass, re-enable deployment and run main again. The preceding artifact
can also be uploaded manually to the same dedicated document root.
