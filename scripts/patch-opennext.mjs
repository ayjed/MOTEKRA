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

// 3. Patch copyTracedFiles.js for Windows filesystem compatibility (prevent broken relative symlinks)
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
  patchFile(copyTracedFile, `Windows absolute junction resolution in ${copyTracedFile}`, (code) => {
    let updated = code;

    // Ensure rmSync is imported
    if (!updated.includes("rmSync,")) {
      updated = updated.replace(
        /readlinkSync,\s*statSync,/,
        "readlinkSync, rmSync, statSync,"
      );
    }

    const targetSectionRegex = /if\s*\(symlink\)\s*\{[\s\S]*?else\s*\{\s*\/\/\s*Adding this inside a try-catch/;
    const replacement = `if (symlink) {
            if (process.platform === "win32") {
                const absSource = path.isAbsolute(symlink) ? symlink : path.resolve(path.dirname(from), symlink);
                const absDest = absSource.replace(standaloneDir, outputDir);
                const target = existsSync(absDest) ? absDest : absSource;
                let isDir = false;
                try {
                    isDir = statSync(target).isDirectory();
                } catch {}
                try {
                    rmSync(to, { force: true, recursive: true });
                } catch {}
                if (isDir) {
                    try {
                        symlinkSync(target, to, "junction");
                    } catch {
                        try {
                            cpSync(target, to, { recursive: true, dereference: true });
                        } catch (err) {
                            if (err.code !== "EEXIST") throw err;
                        }
                    }
                } else {
                    try {
                        copyFileSync(target, to);
                    } catch (err) {
                        if (err.code !== "EEXIST") throw err;
                    }
                }
            } else {
                try {
                    symlinkSync(symlink, to);
                }
                catch (e) {
                    if (e.code !== "EEXIST") {
                        throw e;
                    }
                }
            }
        }
        else {
            // Adding this inside a try-catch`;

    return updated.replace(targetSectionRegex, replacement);
  });
}
