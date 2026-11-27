import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep dev overlays out of screenshots and recordings.
  devIndicators: false,
  // Don't write tool-instruction files into the project folder.
  agentRules: false,
  // A stray lockfile higher up the disk must not become the workspace root.
  turbopack: { root: path.resolve(".") },
  // Local captures and QA hit the dev server on 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [128, 256, 384],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
