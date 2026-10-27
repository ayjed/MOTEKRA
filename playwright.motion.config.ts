import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

export default defineConfig({
  ...base,
  testMatch: "motion.spec.ts",
  timeout: 60_000,
  reporter: [["list"], ["json", { outputFile: process.env.MOTION_REPORT ?? "docs/evidence/phase-02/playwright-results.json" }]],
  use: { ...base.use, viewport: { width: 1440, height: 960 }, launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } },
});
