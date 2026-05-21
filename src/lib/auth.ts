import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format d'email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "ton@email.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) throw new Error("Identifiants invalides");

        const { email, password } = parsed.data;
        const clientIp =
          req?.headers?.["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
          req?.headers?.["x-real-ip"]?.toString().trim() ||
          "unknown";

        const limit = checkRateLimit(`login:${clientIp}`, 10, 15 * 60 * 1000);
        if (!limit.allowed) {
          throw new Error("Trop de tentatives. Réessaie plus tard.");
        }

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user || !user.password_hash) {
          throw new Error("Email ou mot de passe incorrect");
        }

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) throw new Error("Email ou mot de passe incorrect");

        return { id: user.id, email: user.email, name: user.firstname };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
  pages: { signIn: "/auth/login" },
};
