/**
 * Prisma client singleton.
 *
 * In development Next.js hot-reloads modules, which would create a new
 * PrismaClient on every reload and exhaust the connection pool.
 * This pattern stores the client on `global` so it survives HMR.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export default db;
