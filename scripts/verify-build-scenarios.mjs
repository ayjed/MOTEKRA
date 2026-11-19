import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Real-Build Scenario Verification Suite
 * Validates actual Next.js prerendered build outputs for the 4 required scenarios:
 *
 * Scenario A — Authorized Production
 * Scenario B — Unconfigured Preview Build
 * Scenario C — Explicit Non-Indexable Staging
 * Scenario D — Incorrect Production Configuration
 */

const APPROVED_11_URLS = [
  "https://www.motekra.com/",
  "https://www.motekra.com/work",
  "https://www.motekra.com/about",
  "https://www.motekra.com/contact",
  "https://www.motekra.com/services",
  "https://www.motekra.com/services/ui-ux-design",
  "https://www.motekra.com/services/web-development",
  "https://www.motekra.com/services/mobile-app-development",
  "https://www.motekra.com/services/product-strategy",
  "https://www.motekra.com/services/brand-visual-design",
  "https://www.motekra.com/team/akinwumi-ayomiposi",
];

function runBuild(envVars) {
  // Use isolated environment based on process.env with specific overrides/deletions
  const cleanEnv = { ...process.env };
  delete cleanEnv.SITE_URL;
  delete cleanEnv.SITE_INDEXABLE;

  const env = {
    ...cleanEnv,
    ...envVars,
    NODE_ENV: envVars.NODE_ENV ?? "production",
  };

  // Clean empty values
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) delete env[k];
  }

  console.log(`\n============================================================`);
  console.log(`[BUILD] Running Next.js build with:`);
  console.log(`  SITE_URL=${env.SITE_URL ?? "<UNSET>"}`);
  console.log(`  SITE_INDEXABLE=${env.SITE_INDEXABLE ?? "<UNSET>"}`);
  console.log(`  NODE_ENV=${env.NODE_ENV}`);
  console.log(`============================================================`);

  const result = spawnSync("pnpm exec next build", {
    shell: true,
    stdio: "inherit",
    env,
  });

  if (result.status !== 0) {
    throw new Error(`Build failed with exit code ${result.status}`);
  }
}

function readOutput(relPath) {
  const fullPath = path.resolve(".next/server/app", relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, "utf8");
}

function inspectBuild() {
  const workHtml = readOutput("work.html");
  const servicesHtml = readOutput("services.html");
  const uiUxHtml = readOutput("services/ui-ux-design.html");
  const aboutHtml = readOutput("about.html");
  const founderHtml = readOutput("team/akinwumi-ayomiposi.html");
  const sitemapXml = readOutput("sitemap.xml.body");

  const sitemapLocs = sitemapXml ? (sitemapXml.match(/<loc>([^<]+)<\/loc>/g) || []).map(s => s.replace(/<\/?loc>/g, "")) : [];

  return {
    workHtml,
    servicesHtml,
    uiUxHtml,
    aboutHtml,
    founderHtml,
    sitemapXml,
    sitemapLocs,
  };
}

export async function verifyScenarioA() {
  console.log("\n▶ Testing Scenario A: Authorized Production");
  runBuild({
    SITE_URL: "https://www.motekra.com",
    SITE_INDEXABLE: "true",
    NODE_ENV: "production",
  });

  const out = inspectBuild();

  // 1. Sitemap must have exactly the 11 approved URLs
  if (out.sitemapLocs.length !== 11) {
    throw new Error(`Scenario A FAILED: Expected 11 sitemap URLs, got ${out.sitemapLocs.length}`);
  }
  for (const url of APPROVED_11_URLS) {
    if (!out.sitemapLocs.includes(url)) {
      throw new Error(`Scenario A FAILED: Missing sitemap URL ${url}`);
    }
  }

  // 2. Canonical tags must be present and correct
  if (!out.workHtml.includes('<link rel="canonical" href="https://www.motekra.com/work"/>')) {
    throw new Error(`Scenario A FAILED: Missing canonical in work.html`);
  }
  if (!out.servicesHtml.includes('<link rel="canonical" href="https://www.motekra.com/services"/>')) {
    throw new Error(`Scenario A FAILED: Missing canonical in services.html`);
  }
  if (!out.uiUxHtml.includes('<link rel="canonical" href="https://www.motekra.com/services/ui-ux-design"/>')) {
    throw new Error(`Scenario A FAILED: Missing canonical in ui-ux-design.html`);
  }
  if (!out.aboutHtml.includes('<link rel="canonical" href="https://www.motekra.com/about"/>')) {
    throw new Error(`Scenario A FAILED: Missing canonical in about.html`);
  }
  if (!out.founderHtml.includes('<link rel="canonical" href="https://www.motekra.com/team/akinwumi-ayomiposi"/>')) {
    throw new Error(`Scenario A FAILED: Missing canonical in founder.html`);
  }

  // 3. Robots meta must be index, follow
  if (!out.workHtml.includes('<meta name="robots" content="index, follow"/>')) {
    throw new Error(`Scenario A FAILED: work.html does not have index, follow`);
  }

  // 4. Structured data schemas present
  if (!out.uiUxHtml.includes('"@type":"Service"') || !out.uiUxHtml.includes('"@type":"BreadcrumbList"')) {
    throw new Error(`Scenario A FAILED: Missing Service/BreadcrumbList schema in ui-ux-design.html`);
  }
  if (!out.aboutHtml.includes('"@type":"Organization"') || !out.aboutHtml.includes('"@type":"Person"')) {
    throw new Error(`Scenario A FAILED: Missing Organization/Person schema in about.html`);
  }

  console.log("✔ Scenario A Passed: 11 sitemap URLs, canonical links, indexable robots, and active schemas verified.");
}

export async function verifyScenarioB() {
  console.log("\n▶ Testing Scenario B: Unconfigured Preview Build");
  runBuild({
    // Neither SITE_URL nor SITE_INDEXABLE
    NODE_ENV: "production",
  });

  const out = inspectBuild();

  // 1. Sitemap must be empty (0 loc)
  if (out.sitemapLocs.length !== 0) {
    throw new Error(`Scenario B FAILED: Expected empty sitemap in preview build, got ${out.sitemapLocs.length} URLs`);
  }

  // 2. No canonical tags in HTML
  if (out.workHtml.includes('rel="canonical"') || out.servicesHtml.includes('rel="canonical"') || out.uiUxHtml.includes('rel="canonical"')) {
    throw new Error(`Scenario B FAILED: Unconfigured preview build contains canonical tag!`);
  }

  // 3. Robots must be noindex, nofollow
  if (!out.workHtml.includes('<meta name="robots" content="noindex, nofollow"/>')) {
    throw new Error(`Scenario B FAILED: work.html does not contain noindex, nofollow`);
  }

  // 4. No search-oriented JSON-LD
  if (out.uiUxHtml.includes('"@type":"Service"') || out.aboutHtml.includes('"@type":"Organization"')) {
    throw new Error(`Scenario B FAILED: Preview build emitted search-oriented JSON-LD schemas!`);
  }

  // 5. Titles and descriptions remain intact
  if (!out.workHtml.includes("<title>Our Work &amp; Design Concepts - MOTEKRA</title>")) {
    throw new Error(`Scenario B FAILED: Title was lost in preview build`);
  }

  console.log("✔ Scenario B Passed: Fail-closed unconfigured preview build (empty sitemap, no canonicals, noindex, no schemas).");
}

export async function verifyScenarioC() {
  console.log("\n▶ Testing Scenario C: Explicit Non-Indexable Staging");
  runBuild({
    SITE_URL: "https://staging.motekra.com",
    SITE_INDEXABLE: "false",
    NODE_ENV: "production",
  });

  const out = inspectBuild();

  // 1. Sitemap must be empty
  if (out.sitemapLocs.length !== 0) {
    throw new Error(`Scenario C FAILED: Expected empty sitemap for staging, got ${out.sitemapLocs.length}`);
  }

  // 2. CRITICAL: No canonical contamination (no staging canonical and no prod canonical)
  if (out.workHtml.includes('rel="canonical"') || out.servicesHtml.includes('rel="canonical"')) {
    throw new Error(`Scenario C FAILED: Staging emitted canonical tag, causing canonical contamination!`);
  }

  // 3. Robots noindex, nofollow
  if (!out.workHtml.includes('<meta name="robots" content="noindex, nofollow"/>')) {
    throw new Error(`Scenario C FAILED: Staging work.html not noindex, nofollow`);
  }

  // 4. No search-oriented schemas
  if (out.aboutHtml.includes('"@type":"Organization"')) {
    throw new Error(`Scenario C FAILED: Staging emitted Organization schema`);
  }

  console.log("✔ Scenario C Passed: Staging build with SITE_INDEXABLE=false emits no canonical tags or indexable sitemap.");
}

export async function verifyScenarioD() {
  console.log("\n▶ Testing Scenario D: Incorrect Production Configuration");
  runBuild({
    SITE_URL: "",
    SITE_INDEXABLE: "true",
    NODE_ENV: "production",
  });

  const out = inspectBuild();

  // 1. Empty sitemap
  if (out.sitemapLocs.length !== 0) {
    throw new Error(`Scenario D FAILED: Expected empty sitemap when SITE_URL is missing, got ${out.sitemapLocs.length}`);
  }

  // 2. No canonical tags
  if (out.workHtml.includes('rel="canonical"')) {
    throw new Error(`Scenario D FAILED: Emitted canonical tag despite missing origin!`);
  }

  // 3. Robots noindex
  if (!out.workHtml.includes('<meta name="robots" content="noindex, nofollow"/>')) {
    throw new Error(`Scenario D FAILED: Missing SITE_URL did not fail closed to noindex`);
  }

  console.log("✔ Scenario D Passed: Incorrect production config fails closed safely.");
}

async function runAll() {
  const scenarioArg = process.argv[2];
  if (scenarioArg === "A") {
    await verifyScenarioA();
  } else if (scenarioArg === "B") {
    await verifyScenarioB();
  } else if (scenarioArg === "C") {
    await verifyScenarioC();
  } else if (scenarioArg === "D") {
    await verifyScenarioD();
  } else {
    // Run B, C, D, then finish with A so workspace is left in authorized production build state!
    await verifyScenarioB();
    await verifyScenarioC();
    await verifyScenarioD();
    await verifyScenarioA();
    console.log("\n============================================================");
    console.log(" ALL 4 REAL-BUILD SCENARIOS (A, B, C, D) PASSED SUCCESSFULLY!");
    console.log("============================================================\n");
  }
}

runAll().catch((err) => {
  console.error("\n❌ Verification Failed:", err);
  process.exit(1);
});
