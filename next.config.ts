import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // experimental: {
  //   ppr: true,
  // },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "inwesol.com",
      },
    ],
  },
};

export default nextConfig;
