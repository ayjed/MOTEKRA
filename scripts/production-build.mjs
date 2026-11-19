import { spawnSync } from "node:child_process";
import fs from "node:fs";

/**
 * Production Build Workflow for MOTEKRA
 *
 * Explicitly supplies approved production SEO environment variables
 * (from wrangler.jsonc, the single source of truth for Cloudflare deployment)
 * before Next.js prerendering begins.
 *
 * Unlike arbitrary builds (which fail closed without these variables),
 * this workflow is explicitly invoked only for production targets:
 * - `pnpm build:worker`
 * - `pnpm deploy:worker`
 * - `pnpm build:production` (for standalone Next.js production builds)
 */

export function getProductionVariables() {
  const raw = fs.readFileSync(new URL("../wrangler.jsonc", import.meta.url), "utf8");
  const clean = raw
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  const config = JSON.parse(clean);
  const vars = config.vars || {};

  return {
    SITE_URL: vars.SITE_URL || "https://www.motekra.com",
    SITE_INDEXABLE: vars.SITE_INDEXABLE || "true",
  };
}

export function buildProductionEnv(overrides = {}) {
  const prodVars = getProductionVariables();
  return {
    ...process.env,
    SITE_URL: overrides.SITE_URL !== undefined ? overrides.SITE_URL : (process.env.SITE_URL ?? prodVars.SITE_URL),
    SITE_INDEXABLE: overrides.SITE_INDEXABLE !== undefined ? overrides.SITE_INDEXABLE : (process.env.SITE_INDEXABLE ?? prodVars.SITE_INDEXABLE),
    NODE_ENV: overrides.NODE_ENV !== undefined ? overrides.NODE_ENV : (process.env.NODE_ENV || "production"),
  };
}

export function executeCommand(cmdString, customEnv) {
  const env = customEnv || buildProductionEnv();
  console.log(`[production-build] Running with production SEO configuration:`);
  console.log(`  SITE_URL=${env.SITE_URL}`);
  console.log(`  SITE_INDEXABLE=${env.SITE_INDEXABLE}`);
  console.log(`  NODE_ENV=${env.NODE_ENV}`);

  const result = spawnSync(cmdString, {
    shell: true,
    stdio: "inherit",
    env,
  });

  if (result.error) {
    console.error(`[production-build] Execution error:`, result.error);
    process.exit(1);
  }

  return result.status ?? 0;
}

const isDirectCli = process.argv[1] && (
  process.argv[1].endsWith("production-build.mjs") ||
  process.argv[1].endsWith("production-build")
);

if (isDirectCli) {
  const userArgs = process.argv.slice(2);
  const cmd = userArgs.length > 0 ? userArgs.join(" ") : "opennextjs-cloudflare build";
  const code = executeCommand(cmd);
  process.exit(code);
}
