import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export async function buildAuthOptions(): Promise<NextAuthOptions> {
  return {
    adapter: PrismaAdapter(prisma),
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID || "",
        clientSecret: process.env.GITHUB_SECRET || "",
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: "/login",
    },
    callbacks: {
      // Ensure user has access to pages based on their role/plan
      async session({ session, user }) {
        if (session?.user) {
          // Add user's plan info to the session
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email! },
            select: { plan: true },
          });
          session.user.plan = dbUser?.plan || "free";
        }
        return session;
      },
    },
  };
}

// Helper to check if a route requires authentication
export function isProtectedRoute(pathname: string): boolean {
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/features",
    "/pricing",
    "/roadmap",
    "/feedback",
  ];
  
  return !publicRoutes.includes(pathname);
}
