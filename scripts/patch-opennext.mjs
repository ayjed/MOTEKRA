import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function patchFile(filePath, description, transform) {
  if (!fs.existsSync(filePath)) {
    console.log(`[patch-opennext] Skipped (not found): ${filePath}`);
    return;
  }
  const content = fs.readFileSync(filePath, "utf8");
  const newContent = transform(content);
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log(`[patch-opennext] Applied patch: ${description}`);
  } else {
    console.log(`[patch-opennext] Already up to date: ${description}`);
  }
}

// 1. Patch next-server.js (workerd dynamic require of middleware-manifest.json fix)
const nextServerFile = path.join(
  rootDir,
  "node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/next-server.js"
);
patchFile(nextServerFile, "middlewareManifestRule in next-server.js", (code) => {
  if (code.includes("middlewareManifestRule")) return code;

  let updated = code.replace(
    /contents = patchCode\(contents, disableNodeMiddlewareRule\);/,
    `contents = patchCode(contents, disableNodeMiddlewareRule);\n                contents = patchCode(contents, middlewareManifestRule);`
  );

  const ruleDef = `
export const middlewareManifestRule = \`
rule:
  pattern:
    selector: method_definition
    context: "class { getMiddlewareManifest(\$\$\$PARAMS) { \$\$\$_ } }"
fix: |-
  getMiddlewareManifest(\$\$\$PARAMS) {
    return { version: 3, middleware: {}, sortedMiddleware: [], functions: {} };
  }
\`;
`;

  return updated + "\n" + ruleDef;
});

// 2. Patch bundle-server.js (ignore native sharp binary on platforms where it's not needed)
const bundleServerFile = path.join(
  rootDir,
  "node_modules/@opennextjs/cloudflare/dist/cli/build/bundle-server.js"
);
patchFile(bundleServerFile, "ignore-sharp plugin in bundle-server.js", (code) => {
  if (code.includes("ignore-sharp")) return code;

  return code.replace(
    /plugins:\s*\[/,
    `plugins: [
            {
                name: "ignore-sharp",
                setup(b) {
                    b.onResolve({ filter: /(sharp|\\.node$|@img)/ }, () => ({
                        path: path.join(buildOpts.outputDir, "cloudflare-templates/shims/empty.js"),
                    }));
                },
            },`
  );
});

// 3. Patch copyTracedFiles.js for Windows symlink EPERM fallback
function findFiles(dir, matchName, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.includes(".cache")) {
      findFiles(full, matchName, results);
    } else if (entry.name === matchName) {
      results.push(full);
    }
  }
  return results;
}

const copyTracedFilesMatches = findFiles(
  path.join(rootDir, "node_modules"),
  "copyTracedFiles.js"
);

for (const copyTracedFile of copyTracedFilesMatches) {
  patchFile(copyTracedFile, `EPERM fallback in ${copyTracedFile}`, (code) => {
    if (code.includes("junction")) return code;

    return code.replace(
      /try\s*\{\s*symlinkSync\(([^)]+)\);\s*\}\s*catch\s*\(([^)]+)\)\s*\{/g,
      `try {
                symlinkSync($1);
            }
            catch ($2) {
                if ($2.code === "EPERM") {
                    try {
                        symlinkSync(symlink, to, "junction");
                    }
                    catch {
                        try {
                            cpSync(from, to, { recursive: true, dereference: true });
                        }
                        catch (err) {
                            if (err.code !== "EEXIST") throw err;
                        }
                    }
                }`
    );
  });
}

