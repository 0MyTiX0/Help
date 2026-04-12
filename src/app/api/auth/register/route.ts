import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

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
  birthdate: z.string().optional().or(z.literal("")),
  email: z.email("L'email doit être valide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

export async function POST(request: Request) {
  try {
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
