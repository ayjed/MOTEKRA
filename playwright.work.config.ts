import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({ ...base, testMatch: "work.spec.ts", timeout: 90_000,
  reporter: [["list"], ["json", { outputFile: "docs/evidence/phase-07/work-static-results.json" }]],
  use: { ...base.use, viewport: { width: 1440, height: 960 } },
});
