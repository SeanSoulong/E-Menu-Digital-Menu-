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
  // Add these for better dynamic rendering
  experimental: {
    // Enable dynamic rendering for client components
    dynamicIO: true,
    // Disable static optimization for pages that need fresh data
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Generate unique build IDs to avoid cache issues
  generateBuildId: async () => {
    // You can also use a timestamp to ensure unique builds
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
