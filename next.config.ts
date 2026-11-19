import type { NextConfig } from "next";
import fs from "node:fs";

// Populate production SEO configuration from existing Cloudflare settings (wrangler.jsonc) if unconfigured
if (process.env.SITE_INDEXABLE === undefined && process.env.SITE_URL === undefined) {
  try {
    const raw = fs.readFileSync(new URL("./wrangler.jsonc", import.meta.url), "utf8");
    const clean = raw
      .split(/\r?\n/)
      .filter((line) => !line.trim().startsWith("//"))
      .join("\n");
    const wranglerConfig = JSON.parse(clean);
    if (wranglerConfig.vars) {
      if (process.env.SITE_URL === undefined && wranglerConfig.vars.SITE_URL) {
        process.env.SITE_URL = wranglerConfig.vars.SITE_URL;
      }
      if (process.env.SITE_INDEXABLE === undefined && wranglerConfig.vars.SITE_INDEXABLE) {
        process.env.SITE_INDEXABLE = wranglerConfig.vars.SITE_INDEXABLE;
      }
    }
  } catch {
    // Ignore if file read fails
  }
}

const nextConfig: NextConfig = {
  env: {
    ...(process.env.SITE_URL ? { SITE_URL: process.env.SITE_URL } : {}),
    ...(process.env.SITE_INDEXABLE ? { SITE_INDEXABLE: process.env.SITE_INDEXABLE } : {}),
  },
  // CI/CD Automated Deployment Trigger: Phase 56 verification test
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["@react-three/drei"] },
  // Local assets are prepared in the repo; avoid a runtime image-optimizer service.
  images: { unoptimized: true },
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "motekra.com",
          },
        ],
        destination: "https://www.motekra.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }];
  },
};
export default nextConfig;
