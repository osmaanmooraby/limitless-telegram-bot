/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['d1yei2z3i6k35z.cloudfront.net', 'avatars.githubusercontent.com'],
  },
  experimental: {
    // Server-only packages — not bundled into the client or Edge runtime
    serverComponentsExternalPackages: [
      'ccxt',
      '@prisma/client',
      'prisma',
      'bcryptjs',
      'jsonwebtoken',
      'crypto-js',
      'ioredis',
      'nodemailer',
      'technicalindicators',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Browser build — stub out Node.js built-ins that have no browser equivalent
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        'http-proxy-agent': false,
        'https-proxy-agent': false,
        'node-gyp-build': false,
      }
    }

    if (isServer) {
      // Server build — keep ccxt and heavy deps as external so Vercel doesn't
      // try to bundle them (they use native bindings / dynamic require)
      const existing = Array.isArray(config.externals)
        ? config.externals
        : config.externals
        ? [config.externals]
        : []
      config.externals = [
        ...existing,
        'ccxt',
        'ioredis',
        'nodemailer',
        'technicalindicators',
      ]
    }

    return config
  },
}

module.exports = nextConfig
