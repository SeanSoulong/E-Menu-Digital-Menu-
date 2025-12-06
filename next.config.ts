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
  typescript: {
    // allow build even if TS errors exist (optional)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
