import { spawnSync } from "node:child_process";
import fs from "node:fs";

/**
 * Production Build Workflow for MOTEKRA
 *
 * Explicitly validates and supplies approved production SEO environment variables
 * (from wrangler.jsonc, the single source of truth for Cloudflare deployment)
 * before Next.js prerendering begins.
 *
 * Both production values must be explicitly defined and validated:
 * - No silent indexable fallback substitution.
 * - Missing or invalid configuration fails the build with a descriptive error.
 * - Staging origin overrides without an explicit indexing decision default to non-indexable ("false").
 */

export function parseWranglerVars(rawConfigText) {
  const clean = rawConfigText
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n");
  const config = JSON.parse(clean);
  return config.vars || {};
}

export function validateProductionVars(vars) {
  const siteUrl = vars?.SITE_URL;
  if (!siteUrl || typeof siteUrl !== "string" || !siteUrl.trim()) {
    throw new Error(
      "[production-build] Invalid production configuration: 'SITE_URL' is missing or empty in wrangler.jsonc. It must be a valid, explicit HTTPS origin."
    );
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(siteUrl);
  } catch {
    throw new Error(
      `[production-build] Invalid production configuration: 'SITE_URL' (${siteUrl}) is not a valid URL.`
    );
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error(
      `[production-build] Invalid production configuration: 'SITE_URL' must use HTTPS protocol, received: '${parsedUrl.protocol}'`
    );
  }

  const siteIndexable = vars?.SITE_INDEXABLE;
  if (siteIndexable === undefined || siteIndexable === null || siteIndexable === "") {
    throw new Error(
      "[production-build] Invalid production configuration: 'SITE_INDEXABLE' is missing in wrangler.jsonc. It must be explicitly set to 'true' or 'false'."
    );
  }

  if (siteIndexable !== "true" && siteIndexable !== "false") {
    throw new Error(
      `[production-build] Invalid production configuration: 'SITE_INDEXABLE' must be 'true' or 'false', received: '${siteIndexable}'.`
    );
  }

  return {
    SITE_URL: siteUrl.replace(/\/+$/, ""),
    SITE_INDEXABLE: siteIndexable,
  };
}

export function getProductionVariables(configPath) {
  const fileUrl = configPath
    ? (typeof configPath === "string" ? new URL(`file://${configPath.replace(/\\/g, "/")}`) : configPath)
    : new URL("../wrangler.jsonc", import.meta.url);

  const raw = fs.readFileSync(fileUrl, "utf8");
  const vars = parseWranglerVars(raw);
  return validateProductionVars(vars);
}

export function buildProductionEnv(overrides = {}, configPath) {
  const prodVars = getProductionVariables(configPath);

  // Check if caller is overriding SITE_URL or SITE_INDEXABLE
  const callerUrlRaw = overrides.SITE_URL !== undefined ? overrides.SITE_URL : process.env.SITE_URL;
  const callerUrl = callerUrlRaw?.trim() ? callerUrlRaw.trim().replace(/\/+$/, "") : undefined;

  const callerIndexableRaw = overrides.SITE_INDEXABLE !== undefined ? overrides.SITE_INDEXABLE : process.env.SITE_INDEXABLE;
  const callerIndexable = callerIndexableRaw?.trim() ? callerIndexableRaw.trim() : undefined;

  const effectiveUrl = callerUrl || prodVars.SITE_URL;
  let effectiveIndexable;

  if (callerUrl && callerUrl !== prodVars.SITE_URL) {
    // Origin is overridden (e.g. to a staging or preview URL):
    // Prevent partial staging override from inheriting SITE_INDEXABLE=true from production.
    // If an explicit indexing decision is provided, honor it; otherwise fail safe by defaulting to "false".
    effectiveIndexable = callerIndexable !== undefined ? callerIndexable : "false";
  } else {
    // Target matches authorized production origin:
    effectiveIndexable = callerIndexable !== undefined ? callerIndexable : prodVars.SITE_INDEXABLE;
  }

  return {
    ...process.env,
    SITE_URL: effectiveUrl,
    SITE_INDEXABLE: effectiveIndexable,
    NODE_ENV: overrides.NODE_ENV !== undefined ? overrides.NODE_ENV : (process.env.NODE_ENV || "production"),
  };
}

export function executeCommand(cmdString, customEnv) {
  let env;
  try {
    env = customEnv || buildProductionEnv();
  } catch (err) {
    console.error(`\n❌ [production-build] Configuration validation failed:`);
    console.error(`   ${err.message}\n`);
    process.exit(1);
  }

  console.log(`[production-build] Running with validated production SEO configuration:`);
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
