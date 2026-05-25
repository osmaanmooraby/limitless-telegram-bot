/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/limitless-telegram-bot',
  assetPrefix: '/limitless-telegram-bot',
  images: {
    unoptimized: true,
  },
}
module.exports = nextConfig
