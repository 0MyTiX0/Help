import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);

    return NextResponse.json(
      { message: "Impossible de charger les catégories" },
      { status: 500 },
    );
  }
}
