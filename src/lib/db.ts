import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is not set. Database operations will fail.");
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Optimize connection pool for production
if (process.env.NODE_ENV === "production") {
  // Prisma automatically manages connection pooling
  // Connection pooling is handled by the database provider (Neon, Supabase, etc.)
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

