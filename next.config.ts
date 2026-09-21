import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.myntassets.com",
      },
      {
        protocol: "https",
        hostname: "assets.ajio.com",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-static.nykaa.com",
      },
    ],
  },
};

export default nextConfig;
