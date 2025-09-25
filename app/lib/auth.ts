import type { NextAuthOptions } from "next-auth";

export async function buildAuthOptions(): Promise<NextAuthOptions> {
  return {
    providers: [], // Add providers like GitHub, Google, etc. as needed
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
  };
}
