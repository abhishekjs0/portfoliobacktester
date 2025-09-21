import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

import type { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let prisma: PrismaClient | undefined = globalForPrisma.prisma;

if (!prisma) {
  const prismaModule = await import("@prisma/client").catch((error: unknown) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "Prisma Client could not be initialized. Continuing without a database connection.",
        error,
      );
    }
    return undefined;
  });

  if (prismaModule) {
    try {
      prisma = new prismaModule.PrismaClient();

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
}

export { prisma };
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
>>>>>>> origin/main
