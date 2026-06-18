import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Property photos are hosted on Unsplash; next/image rejects unconfigured
    // remote hosts. Restrict to the exact host used by the seed data.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
