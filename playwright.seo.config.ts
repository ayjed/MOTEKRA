import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "seo.spec.ts",
  timeout: 90_000,
  reporter: [
    ["list"],
    ["json", { outputFile: "docs/evidence/phase-08/playwright-results.json" }],
  ],
  webServer: {
    command: "pnpm start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      SITE_URL: "https://www.motekra.com",
      SITE_INDEXABLE: "true",
    },
  },
  use: {
    ...base.use,
    viewport: { width: 1440, height: 960 },
  },
});

