import { readdir, writeFile } from "node:fs/promises";

const dir = "docs/evidence/phase-01";
const routes = ["home", "work", "services", "about", "contact"];
const rows = routes.map((route) => `<section><h2>${route}</h2><div class="pair"><figure><img src="../../../five%20frames.png" alt="Approved five-page composition"><figcaption>Approved composition reference (all five frames)</figcaption></figure><figure><a href="${route}-1440.png"><img src="${route}-1440.png" alt="${route} foundation at 1440 pixels"></a><figcaption>Phase 01 foundation, not final cinematic design</figcaption></figure></div><p>${[1440, 1024, 768, 390, 320].map((w) => `<a href="${route}-${w}.png">${w}px</a>`).join(" · ")}</p></section>`).join("");
await writeFile(`${dir}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOTEKRA Phase 01 review</title><style>body{font-family:Arial,sans-serif;color:#08152b;margin:32px;background:#edf7ff}h1{font-size:36px}section{margin:48px 0}.pair{display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start}figure{margin:0;background:white;padding:16px;border:1px solid #bed8ee;border-radius:16px}img{width:100%;height:auto}figcaption{margin-top:12px;font-size:14px}a{color:#055dbf}p{line-height:1.7}@media(max-width:700px){.pair{grid-template-columns:1fr}}</style><h1>MOTEKRA · Phase 01 review</h1><p>Responsive foundation evidence. Real mark; draft content clearly labelled. Heavy animation, approved work and portrait are later-phase requirements.</p>${rows}<h2>Fallback evidence</h2><p><a href="home-390-no-js-reduced-motion.png">No JavaScript / reduced motion</a> · <a href="home-390-no-js-navigation.png">Native navigation without JavaScript</a></p></html>`);

const results = [];
for (const route of ["/", "/work", "/services", "/about", "/contact", "/insights", "/services/ui-ux-design"]) {
  const response = await fetch(`http://127.0.0.1:3000${route}`);
  const html = await response.text();
  results.push({ route, status: response.status, title: html.match(/<title>(.*?)<\/title>/)?.[1],
    h1Count: (html.match(/<h1[ >]/g) || []).length, anchorCount: (html.match(/<a[ >]/g) || []).length,
    hasMain: html.includes('id="main-content"'), noindex: html.includes("noindex"),
    htmlBytes: Buffer.byteLength(html), contentType: response.headers.get("content-type"),
    nosniff: response.headers.get("x-content-type-options") });
  if (route === "/") await writeFile(`${dir}/home-server.html`, html);
}
await writeFile(`${dir}/route-audit.json`, JSON.stringify(results, null, 2));
const count = (await readdir(dir)).filter((name) => name.endsWith(".png")).length;
console.log(JSON.stringify({ screenshotCount: count, routes: results }, null, 2));
