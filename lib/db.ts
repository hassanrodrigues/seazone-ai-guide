import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

// Prisma 7 requires a driver adapter at runtime. PrismaPg uses node-postgres
// (TCP), which works both against a local Postgres and against Neon in
// production — no separate serverless driver needed for this scope.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Reuse a single PrismaClient across hot reloads in development. Next.js dev
// re-evaluates modules on every change, which would otherwise open a new pool
// of DB connections each time and exhaust the database. In production the
// module is evaluated once, so the global cache is a no-op there.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
