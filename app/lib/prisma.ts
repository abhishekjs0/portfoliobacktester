import type { PrismaClient } from "@prisma/client";

type PrismaModule = typeof import("@prisma/client");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaClient: PrismaClient | undefined = globalForPrisma.prisma;

const createPrismaClient = (): PrismaClient | undefined => {
  if (prismaClient) return prismaClient;

  try {
    const { PrismaClient }: PrismaModule = require("@prisma/client");
    prismaClient = new PrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaClient;
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Failed to initialize Prisma Client. Continuing without a database connection.",
        error,
      );
    }
    prismaClient = undefined;
  }

  return prismaClient;
};

export const getPrismaClient = (): PrismaClient | undefined => createPrismaClient();

export const prisma = createPrismaClient();
