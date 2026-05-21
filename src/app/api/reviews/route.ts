import { NextResponse } from "next/server";
import { z } from "zod";
import { getReviews } from "@/lib/reviews";

const reviewQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(10).default(10),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parsedQuery = reviewQuerySchema.safeParse({
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsedQuery.success) {
      return NextResponse.json(
        { message: parsedQuery.error.issues[0].message },
        { status: 400 },
      );
    }

    const reviews = await getReviews(parsedQuery.data.limit);

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Erreur lors du chargement des reviews:", error);

    return NextResponse.json(
      { message: "Impossible de charger les reviews" },
      { status: 500 },
    );
  }
}
