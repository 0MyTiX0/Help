import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;

export async function GET(request: Request) {
  try {
    const token = await getToken({ req: request as any, secret });

    if (!token?.sub) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.users.findUnique({
      where: { id: token.sub as string },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        birthdate: true,
        user_profile: {
          select: {
            quizz_statuses: true,
            category_scores: true,
            id: true,
            user_category_preference: {
              select: { category_id: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable" },
        { status: 404 },
      );
    }

    const categoryPrefs =
      user.user_profile?.user_category_preference?.map((p) => p.category_id) ||
      [];

    const categories =
      categoryPrefs.length > 0
        ? await prisma.category.findMany({
            where: { id: { in: categoryPrefs } },
            select: { id: true, name: true },
          })
        : [];

    return NextResponse.json({ user, categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
