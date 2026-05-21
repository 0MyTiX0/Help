import { prisma } from "@/lib/prisma";

export type ReviewRow = {
  id: string;
  score: number | null;
  comment: string | null;
  firstname: string | null;
  lastname: string | null;
  role: string | null;
  created_at: Date | string | null;
};

const reviewSelect = {
  id: true,
  score: true,
  comment: true,
  firstname: true,
  lastname: true,
  role: true,
  created_at: true,
} as const;

export async function getReviews(limit = 10) {
  return prisma.reviews.findMany({
    select: reviewSelect,
    where: {
      comment: {
        not: null,
      },
      score: {
        not: null,
      },
    },
    orderBy: [
      {
        created_at: "desc",
      },
      {
        score: "desc",
      },
      {
        id: "desc",
      },
    ],
    take: limit,
  });
}
