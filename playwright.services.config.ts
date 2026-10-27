import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({ ...base, testMatch: "services.spec.ts", timeout: 120_000,
  reporter: [["list"], ["json", { outputFile: "docs/evidence/phase-05/playwright-results.json" }]],
  use: { ...base.use, viewport: { width: 1440, height: 960 }, launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } },
});
