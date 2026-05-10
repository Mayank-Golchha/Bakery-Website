import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow Supabase storage images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
