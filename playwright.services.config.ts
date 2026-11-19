import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "services.spec.ts",
  timeout: 120_000,
  reporter: [["list"], ["json", { outputFile: "docs/evidence/phase-05/playwright-results.json" }]],
  webServer: {
    command: "pnpm start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  use: {
    ...base.use,
    viewport: { width: 1440, height: 960 },
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
  },
});
