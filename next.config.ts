import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { optimizePackageImports: ["@react-three/drei"] },
  // Local assets are prepared in the repo; avoid a runtime image-optimizer service.
  images: { unoptimized: true },
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
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
