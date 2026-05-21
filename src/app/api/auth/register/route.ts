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
  situation: z.string().optional().or(z.literal("")),
  selectedCategories: z.array(z.string().uuid()).optional().default([]),
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

    const {
      email,
      password,
      firstname,
      lastname,
      birthdate,
      situation,
      selectedCategories,
    } = validation.data;

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

    const categoryRecords =
      selectedCategories.length > 0
        ? await prisma.category.findMany({
            where: { id: { in: selectedCategories } },
            select: { id: true, name: true },
          })
        : [];

    const categoryScoreMap = categoryRecords.reduce<Record<string, number>>(
      (scores, category) => {
        scores[category.id] = 1;
        return scores;
      },
      {},
    );

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          email,
          password_hash: hashedPassword,
          firstname: firstname || null,
          lastname: lastname || null,
          birthdate: birthdate ? new Date(birthdate) : null,
          status: situation || null,
        },
      });
      const profile = await tx.user_profile.create({
        data: {
          user_id: user.id,
          category_scores: categoryScoreMap,
          quizz_statuses: {
            situation: situation || null,
            onboardingStep: 3,
          },
        },
      });

      if (categoryRecords.length > 0) {
        await (tx as any).user_category_preference.createMany({
          data: categoryRecords.map((category) => ({
            user_profile_id: profile.id,
            category_id: category.id,
          })),
        });

        for (const category of categoryRecords) {
          const todoList = await tx.todo_list.create({
            data: {
              user_id: user.id,
              category_id: category.id,
              title: `Diagnostic : ${category.name}`,
            },
          });

          await tx.todo_list_task.create({
            data: {
              todo_list_id: todoList.id,
              description:
                "Faire le questionnaire rapide pour débloquer les aides",
              scheduled_date: null,
              is_completed: false,
            },
          });
        }
      }

      return user;
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
