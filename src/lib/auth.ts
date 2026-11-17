import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { db } from "@/lib/db";
import { rateLimitKey } from "@/lib/http";

const credentialsSchema = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(128) });
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email and password",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(raw, request) {
        const ip = request.headers["x-forwarded-for"]?.split(",")[0]?.trim() ?? "credentials-unknown";
        if (rateLimitKey(`login:${ip}`, 8)) return null;
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user || user.disabledAt || !user.passwordHash) return null;
        if (!(await bcrypt.compare(parsed.data.password, user.passwordHash))) return null;
        return { id: user.id, email: user.email, name: user.name ?? user.email };
      }
    }),
    ...(googleEnabled ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Linking is allowed only after the signIn callback confirms Google's verified email.
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        if (!profile.email || profile.email_verified !== true) throw new Error("A verified Google email is required.");
        return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture };
      }
    })] : [])
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email_verified !== true) return false;
      if (!user.email) return false;
      const stored = await db.user.findUnique({ where: { email: user.email.toLowerCase() }, select: { disabledAt: true } });
      return !stored?.disabledAt;
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      if (token.sub) {
        const stored = await db.user.findUnique({ where: { id: token.sub }, select: { role: true, disabledAt: true } });
        if (!stored || stored.disabledAt) {
          token.sub = undefined;
          token.role = undefined;
        } else {
          token.role = stored.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "CUSTOMER";
      }
      return session;
    }
  }
};

export async function currentUser() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) return null;
  const user = await db.user.findFirst({ where: { id, disabledAt: null }, select: { id: true, name: true, email: true, role: true } });
  return user ? { ...user, name: user.name ?? user.email } : null;
}

export async function requireRole(role: "CUSTOMER" | "ADMIN") {
  const user = await currentUser();
  if (!user || (role === "ADMIN" && user.role !== "ADMIN")) return null;
  return user;
}
