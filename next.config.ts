import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "scontent.fpnh5-2.fna.fbcdn.net", // adjust per CDN
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
};

export default nextConfig;
