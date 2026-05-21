"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function toggleTaskCompletion(
  taskId: string,
  completed: boolean,
): Promise<{ success: boolean }> {
  try {
    await prisma.todo_list_task.update({
      where: { id: taskId },
      data: { is_completed: completed },
    });
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { success: false };
  }
}


type SubcategoryScore = {
  id: string;
  points: number;
};

type ScoreMatrix = {
  subcategories?: SubcategoryScore[];
};

type QuizzStatuses = {
  global_diagnostic?: "pending" | "in_progress" | "completed";
  [key: string]: unknown;
};

type SubmitDiagnosticResult =
  | { success: true; createdTodoLists: number }
  | { success: false; error: string };

const RECOMMENDATION_THRESHOLD = 50;
const DEFAULT_TASK_OFFSET_DAYS = 7;

export async function submitDiagnostic(
  userId: string,
  selectedAnswerIds: string[],
): Promise<SubmitDiagnosticResult> {
  if (!userId) {
    return { success: false, error: "Utilisateur non identifié." };
  }
  if (!Array.isArray(selectedAnswerIds) || selectedAnswerIds.length === 0) {
    return { success: false, error: "Aucune réponse sélectionnée." };
  }

  try {
    // 1. Récupération des réponses + score_matrix
    const answers = await prisma.global_answer.findMany({
      where: { id: { in: selectedAnswerIds } },
      select: { id: true, score_matrix: true },
    });

    // 2. Calcul des scores cumulés par sous-catégorie
    const userScores: Record<string, number> = {};
    for (const answer of answers) {
      const matrix = (answer.score_matrix ?? {}) as unknown as ScoreMatrix;
      const subs = matrix.subcategories ?? [];
      for (const sub of subs) {
        if (!sub?.id || typeof sub.points !== "number") continue;
        userScores[sub.id] = (userScores[sub.id] ?? 0) + sub.points;
      }
    }

    // 3. Sauvegarde dans le profil utilisateur
    const existingProfile = await prisma.user_profile.findUnique({
      where: { user_id: userId },
      select: { quizz_statuses: true },
    });

    const currentStatuses = (existingProfile?.quizz_statuses ??
      {}) as unknown as QuizzStatuses;
    const nextStatuses: QuizzStatuses = {
      ...currentStatuses,
      global_diagnostic: "completed",
    };

    await prisma.user_profile.upsert({
      where: { user_id: userId },
      create: {
        user_id: userId,
        category_scores: userScores as Prisma.InputJsonValue,
        quizz_statuses: nextStatuses as Prisma.InputJsonValue,
      },
      update: {
        category_scores: userScores as Prisma.InputJsonValue,
        quizz_statuses: nextStatuses as Prisma.InputJsonValue,
      },
    });

    // 4. Moteur de recommandation : générer Todo_List + tâche initiale
    const triggered = Object.entries(userScores).filter(
      ([, score]) => score >= RECOMMENDATION_THRESHOLD,
    );

    let createdTodoLists = 0;

    for (const [subcategoryId] of triggered) {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: subcategoryId },
        include: { category: true },
      });

      if (!subcategory?.category) continue;
      const categoryId = subcategory.category.id;

      const existingList = await prisma.todo_list.findFirst({
        where: { user_id: userId, category_id: categoryId },
        select: { id: true },
      });

      if (existingList) continue;

      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + DEFAULT_TASK_OFFSET_DAYS);

      await prisma.todo_list.create({
        data: {
          user_id: userId,
          category_id: categoryId,
          title: `Démarches : ${subcategory.category.name}`,
          todo_list_task: {
            create: [
              {
                description: `Compléter mon dossier : ${subcategory.name}`,
                scheduled_date: scheduledDate,
                is_completed: false,
              },
            ],
          },
        },
      });

      createdTodoLists += 1;
    }

    // 5. Revalidation du cache
    revalidatePath("/profile");

    return { success: true, createdTodoLists };
  } catch (error) {
    console.error("[submitDiagnostic] error:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'enregistrement du diagnostic.",
    };
  }
}
