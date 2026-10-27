import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const dir = 'docs/evidence/phase-03';
const files = await readdir(dir);
const images = files.filter((name) => /\.png$/.test(name) && !/^home-(390|320|no-js-390)\.png$/.test(name));
const videos = files.filter((name) => /\.webm$/.test(name));
const summaries = [];
for (const name of files.filter((name) => /\.report\.json$/.test(name))) {
  const report = JSON.parse(await readFile(`${dir}/${name}`, 'utf8'));
  summaries.push({ file: name, date: report.fetchTime, mode: report.configSettings.formFactor, scores: Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, value.score])), metrics: Object.fromEntries(['first-contentful-paint','largest-contentful-paint','speed-index','total-blocking-time','cumulative-layout-shift','interactive','total-byte-weight'].filter((key) => report.audits[key]).map((key) => [key, { value: report.audits[key].numericValue, display: report.audits[key].displayValue }])), failedAudits: Object.entries(report.audits).filter(([,audit]) => audit.score !== null && audit.score < 1).map(([id,audit]) => ({id, title:audit.title, score:audit.score, display:audit.displayValue})), warnings: report.runWarnings });
}
await writeFile(`${dir}/performance-summary.json`, JSON.stringify(summaries, null, 2));
const manifest = [];
for (const name of files.filter((name) => /\.(png|webm|txt|json|html)$/.test(name) && name !== 'artifact-manifest.json' && name !== 'index.html')) {
  const data = await readFile(`${dir}/${name}`);
  manifest.push({file:name, bytes:data.length, sha256:createHash('sha256').update(data).digest('hex')});
}
await writeFile(`${dir}/artifact-manifest.json`, JSON.stringify(manifest, null, 2));
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MOTEKRA — Phase 03 evidence</title><style>body{font:16px Arial,sans-serif;max-width:1440px;margin:auto;padding:32px;background:#f4faff;color:#08152b}a{color:#0562cb}video{display:block;width:100%;max-height:85vh;background:#08152b;margin-bottom:40px}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}figure{margin:0;padding:16px;background:white;border:1px solid #c6e4f8;border-radius:16px}img{width:100%;height:400px;object-fit:contain;object-position:top}figcaption{padding:16px 0;overflow-wrap:anywhere}h2{margin-top:48px}</style><h1>MOTEKRA / Phase 03</h1><p>Local production evidence · 2026-10-25. Exact supplied mark. Owner-confirmed founder identity. Candidate projects remain drafts; original portrait and contact destination await confirmation.</p><p>Viewport captures below are the primary visual review; very tall full-page captures are supplemental. Automated audits do not certify WCAG or real-user performance.</p><p><a href="README.md">Validation and limitations</a> · <a href="home-server.html">Production HTML</a> · <a href="html-audit.json">Heading audit</a> · <a href="internal-links.json">Internal links</a> · <a href="playwright-results.json">Browser checks</a> · <a href="performance-summary.json">Performance summary</a></p>${files.filter((name)=>/\.report\.html$/.test(name)).map((name)=>`<p><a href="${name}">${name}</a></p>`).join('')}<h2>Recorded walkthroughs</h2>${videos.map((name)=>`<h3>${name}</h3><video controls preload="metadata" poster="${name.includes('mobile')?'hero-390.png':'hero-1440.png'}"><source src="${name}" type="video/webm"></video>`).join('')}<h2>Desktop, mobile, process and fallback captures</h2><section>${images.map((name)=>`<figure><a href="${name}"><img src="${name}" alt="MOTEKRA evidence: ${name}" loading="lazy"></a><figcaption>${name}</figcaption></figure>`).join('')}</section></html>`;
await writeFile(`${dir}/index.html`, html);
console.log(JSON.stringify({ images:images.length, videos:videos.length, performance:summaries }, null, 2));
