import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { buildAuthOptions } from "../../../../lib/auth";

async function getAuthHandler() {
  const options: NextAuthOptions = await buildAuthOptions();
  return NextAuth(options);
}

const handler = async (
  ...args: Parameters<ReturnType<typeof NextAuth>>
) => {
  const authHandler = await getAuthHandler();
  return authHandler(...args);
};

export { handler as GET, handler as POST };
