import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
