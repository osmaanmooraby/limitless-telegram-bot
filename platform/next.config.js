/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['d1yei2z3i6k35z.cloudfront.net', 'avatars.githubusercontent.com'],
  },
  experimental: {
    // These packages are only used server-side and should not be bundled
    serverComponentsExternalPackages: ['ccxt', '@prisma/client', 'prisma', 'bcryptjs', 'jsonwebtoken', 'crypto-js', 'ioredis', 'nodemailer'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, net: false, tls: false, crypto: false,
        stream: false, url: false, zlib: false, http: false,
        https: false, assert: false, os: false, path: false,
        'http-proxy-agent': false,
        'https-proxy-agent': false,
      }
    }
    if (isServer) {
      // For server builds, externalize ccxt to avoid bundling issues
      const existingExternals = Array.isArray(config.externals) ? config.externals : config.externals ? [config.externals] : []
      config.externals = [...existingExternals, 'ccxt']
    }
    return config
  },
}

module.exports = nextConfig
