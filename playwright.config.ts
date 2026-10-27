import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/smoke",
  testMatch: "foundation.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  reporter: [["list"], ["json", { outputFile: `${process.env.EVIDENCE_DIR ?? "docs/evidence/phase-01"}/foundation-results.json` }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000",
    channel: "chrome",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
