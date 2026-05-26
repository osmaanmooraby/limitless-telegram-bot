import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // If no DATABASE_URL is configured, return a no-op proxy so API routes
  // can fall through to their mock-data fallback without crashing.
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost:5432')) {
    return null as unknown as PrismaClient
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma: PrismaClient =
  global._prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma
}
