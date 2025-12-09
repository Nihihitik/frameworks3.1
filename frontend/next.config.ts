import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "images2.imgbox.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
};

export default nextConfig;
