# Armenian church calendar

React 19 / TypeScript / Vite browser application, with Armenian and English
content. All calendar months (1900–2200) are calculated in the browser; no
per-month HTML or React Server Component files are generated.

```sh
npm ci
npm run dev       # http://localhost:5173
npm run lint
npm run check
npm run build
npm run preview
```

`npm run build` creates `out/`: one HTML entry, bundled JS/CSS, self-hosted
fonts and twelve optimized WebP illustrations. Original PNGs stay unchanged
in `public/illustrations/`. Node.js 24 runs locally and in GitHub Actions;
the production cPanel server only serves static files.

Content is edited in `src/content/`; see [HANDOVER.md](HANDOVER.md).
Deployment and rollback: [DEPLOYMENT.md](DEPLOYMENT.md).
