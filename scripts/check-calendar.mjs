import assert from "node:assert/strict";
import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { MemoryRouter } from "react-router";

const server = await createServer({ server: { middlewareMode: true }, appType: "custom", ssr: { external: ["react", "react-dom", "react-router"] } });
try {
  const { App } = await server.ssrLoadModule("/src/App.tsx");
  const render = (url) => renderToString(createElement(MemoryRouter, { initialEntries: [url] }, createElement(App)));
  const hy = render("/hy/2027/01");
  const en = render("/en/2027/01");
  assert.match(hy, /2027-01-06/);
  assert.match(hy, /Սուրբ Ծնունդ/);
  assert.match(en, /Holy Nativity/);
  assert.match(en, /January/);
  for (const url of ["/hy/1900/01", "/en/2200/12", "/hy/2028/02"]) {
    const html = render(url);
    assert.match(html, /data-date=/);
    assert.doesNotMatch(html, /Page not found/);
  }
  assert.match(render("/hy/2028/02"), /2028-02-29/);
  assert.match(render("/en/feasts/christmas"), /Holy Nativity and Theophany/);
  assert.match(render("/en/2027/13"), /Page not found/);
  assert.match(render("/en/feasts/missing"), /Page not found/);
  const filtered = render("/en/2027/01?hide=tabernacle&day=2027-01-06");
  assert.equal((filtered.match(/href="\/en\/feasts\/christmas"/g) ?? []).length, 1);
  assert.ok((en.match(/href="\/en\/feasts\/christmas"/g) ?? []).length > 1);
  assert.match(filtered, /\/hy\/2027\/01\?hide=tabernacle&amp;day=2027-01-06/);
  console.log("Calendar checks passed: HY/EN, boundary years, leap day, feast routes, invalid URLs, filters and language query preservation.");
} finally { await server.close(); }
