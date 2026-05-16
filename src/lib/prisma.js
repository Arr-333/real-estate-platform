import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // optional, logs all queries
  });

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
