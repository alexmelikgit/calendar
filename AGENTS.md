# Calendar development

This fork is a Vite / React browser application deployed to cPanel. It was
migrated from Next.js; do not reintroduce per-month static exports or a
Node.js production server.

- Preserve Armenian/English content, month/feast URLs, query filters and the
  complete 1900–2200 date-picker range.
- Edit content in src/content and keep the UI separate from content access.
- Run npm run lint, npm run check and npm run build before deployment.
- Public PNG illustrations are originals. Build-time WebP conversion only
  modifies out/, never public/.
- Only out/ is uploaded through verified FTPS to the dedicated subdomain.
