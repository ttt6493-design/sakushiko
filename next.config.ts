import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'picsum.photos' },
      { hostname: 'pics.dmm.co.jp' },
      { hostname: 'pics.dmm.com' },
    ],
  },
};

export default nextConfig;
