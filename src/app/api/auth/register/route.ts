import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { checkRateLimit } from "../../../../lib/rate-limit";

const registerSchema = z.object({
  firstname: z
    .string()
    .min(2, "Le prénom doit faire au moins 2 caractères")
    .optional()
    .or(z.literal("")),
  lastname: z
    .string()
    .min(2, "Le nom de famille doit faire au moins 2 caractères")
    .optional()
    .or(z.literal("")),
  birthdate: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("L'email doit être valide"),
  password: z
    .string()
    .min(12, "Le mot de passe doit faire au moins 12 caractères")
    .refine(
      (value) => /[A-Z]/.test(value),
      "Le mot de passe doit contenir au moins une majuscule",
    )
    .refine(
      (value) => /[a-z]/.test(value),
      "Le mot de passe doit contenir au moins une minuscule",
    )
    .refine(
      (value) => /\d/.test(value),
      "Le mot de passe doit contenir au moins un chiffre",
    )
    .refine(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      "Le mot de passe doit contenir au moins un caractère spécial",
    ),
});

export async function POST(request: Request) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "unknown";

    const limit = checkRateLimit(`register:${clientIp}`, 5, 15 * 60 * 1000);

    if (!limit.allowed) {
      return NextResponse.json(
        { message: "Trop de tentatives. Réessaie plus tard." },
        { status: 429 },
      );
    }

    const body = await request.json();

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password, firstname, lastname, birthdate } = validation.data;

    const existingUser = await prisma.users.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        email: email,
        password_hash: hashedPassword,
        firstname: firstname || null,
        lastname: lastname || null,
        birthdate: birthdate ? new Date(birthdate) : null,
      },
    });

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", userId: newUser.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
