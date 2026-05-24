/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external crypto news sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.cointelegraph.com' },
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // Needed so the prisma client doesn't get bundled into edge runtimes
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

module.exports = nextConfig;
