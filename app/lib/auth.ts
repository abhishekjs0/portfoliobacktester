import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
export async function buildAuthOptions(): Promise<NextAuthOptions> {
  const [{ PrismaAdapter }, { prisma }] = await Promise.all([
    import("@next-auth/prisma-adapter"),
    import("./prisma"),
  ]);

  return {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: "database",
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
      async session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          session.user.plan = user.plan as string;
        }
        return session;
      },
    },
  };
}
