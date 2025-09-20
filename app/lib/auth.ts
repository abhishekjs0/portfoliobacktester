import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: prisma ? PrismaAdapter(prisma) : undefined,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: prisma ? "database" : "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST ?? "",
        port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER ?? "",
          pass: process.env.EMAIL_SERVER_PASSWORD ?? "",
        },
      },
      from: process.env.EMAIL_FROM ?? "no-reply@example.com",
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user) {
        const idFromToken = typeof token?.sub === "string" ? token.sub : undefined;
        session.user.id = user?.id ?? idFromToken ?? session.user.id;

        const planFromUser =
          user && typeof (user as Record<string, unknown>).plan === "string"
            ? (user as { plan: string }).plan
            : undefined;
        const planFromToken =
          token && typeof (token as Record<string, unknown>).plan === "string"
            ? (token as { plan: string }).plan
            : undefined;

        const plan = planFromUser ?? planFromToken;
        session.user.plan = plan ?? undefined;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        if (typeof (user as Record<string, unknown>).plan === "string") {
          token.plan = (user as { plan: string }).plan;
        }
      }
      return token;
    },
  },
};
