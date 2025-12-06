// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.fpnh5-2.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "scontent.fpnh5-1.fna.fbcdn.net",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
    ],
  },
  eslint: {
    // ignore ESLint errors during production build (optional)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // allow build even if TS errors exist (optional)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
