import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient();
  } catch (error) {
    console.warn("Prisma client could not be initialized. Did you run `prisma generate`?", error);
    const modelProxy = new Proxy(
      {},
      {
        get() {
          return async () => undefined;
        },
      }
    );

    return new Proxy(
      {},
      {
        get(_target, prop: string | symbol) {
          if (typeof prop === "string" && prop.startsWith("$")) {
            return async () => undefined;
          }
          return modelProxy;
        },
      }
    ) as PrismaClient;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
