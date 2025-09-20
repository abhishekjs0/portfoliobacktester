import type { PrismaClient } from "@prisma/client";

type PrismaModule = typeof import("@prisma/client");

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let prisma: PrismaClient | undefined = globalForPrisma.prisma;

if (!prisma) {
  try {
    const { PrismaClient }: PrismaModule = require("@prisma/client");
    prisma = new PrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prisma;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Prisma Client could not be initialized. Continuing without a database connection.",
        error,
      );
    }
    prisma = undefined;
  }
}

export { prisma };
