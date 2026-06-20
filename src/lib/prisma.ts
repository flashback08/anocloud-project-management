import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 1. Initialize the native pg Pool connection using your environment string
const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL 
});

// 2. Wrap it inside the Prisma 7 adapter layer
const adapter = new PrismaPg(pool);

// 3. Construct the client with the required adapter configuration
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, // Provides the engine framework Prisma 7 expects
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;