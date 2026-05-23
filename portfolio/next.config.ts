import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  output: "export",
  trailingSlash: true,
  basePath: "/limitless-telegram-bot",
  assetPrefix: "/limitless-telegram-bot",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
