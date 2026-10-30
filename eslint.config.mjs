import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  {
    ignores: [
      "**/.next/**",
      "**/.open-next/**",
      "**/.wrangler/**",
      "**/node_modules/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/scratch/**",
      "scripts/**",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
]);
