import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const directory = "docs/evidence/phase-02";
const response = await fetch("http://127.0.0.1:3000/motion-lab");
const html = await response.text();
if (response.status !== 200 || !html.includes("Motion with")) throw new Error("Enable the private lab on the local QA server first");
await writeFile(`${directory}/lab-server.html`, html);
const pictures = (await readdir(directory)).filter((name) => name.endsWith(".png")).sort();
const video = await readFile(`${directory}/motion-walkthrough.webm`);
const manifest = {
  mode: "local environment-gated lab; not deployed",
  lab: { status: response.status, noindex: html.includes("noindex"), htmlBytes: Buffer.byteLength(html) },
  screenshots: pictures,
  recording: { path: "motion-walkthrough.webm", bytes: video.length, sha256: createHash("sha256").update(video).digest("hex"), modified: (await stat(`${directory}/motion-walkthrough.webm`)).mtime.toISOString() },
};
await writeFile(`${directory}/artifact-manifest.json`, JSON.stringify(manifest, null, 2));
const images = pictures.map((name) => `<figure><a href="${name}"><img src="${name}" alt="${name.replaceAll("-", " ").replace(".png", "")}" loading="lazy"></a><figcaption>${name}</figcaption></figure>`).join("");
await writeFile(`${directory}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOTEKRA Phase 02 evidence</title><style>body{font-family:Arial,sans-serif;margin:clamp(20px,4vw,64px);background:#edf7ff;color:#08152b}h1{font-size:clamp(32px,5vw,64px);letter-spacing:-.05em}p{max-width:800px;line-height:1.7}video{width:100%;max-width:1280px;border:1px solid #a0c8e8;border-radius:16px}.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}figure{margin:0;background:white;padding:16px;border:1px solid #bad4e8;border-radius:16px}img{width:100%;height:auto;max-height:1000px;object-fit:contain;object-position:top}figcaption{margin-top:16px;font-size:13px}a{color:#0562cb}@media(max-width:700px){.gallery{grid-template-columns:1fr}}</style><h1>MOTEKRA / Motion architecture</h1><p>Phase 02 private lab review. Native scrolling, server-rendered content, optional product 3D, keyboard focus, reduced motion and graceful fallbacks. All device interfaces are concepts, not client work.</p><video controls preload="metadata" src="motion-walkthrough.webm" poster="lab-hero-1440.png"></video><p>Silent Chrome walkthrough. Software WebGL was used for automated QA; this is not a real-device FPS or Web Vitals benchmark.</p><p><a href="playwright-results.json">Motion results</a> · <a href="regression/foundation-results.json">Public page regression</a> · <a href="lab-disabled.json">Disabled-lab 404 proof</a> · <a href="lab-server.html">Served HTML</a></p><div class="gallery">${images}</div></html>`);
console.log(JSON.stringify(manifest, null, 2));
