import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

import ProgressCard from "./ProgressCard";
import StepsList from "./StepsList";
import UserCard from "./UserCard";
import Calendar from "./Calendar";
import type { DashboardData, DashboardTask } from "./types";

export const dynamic = "force-dynamic";

function computeAge(birthdate: Date | null): number | null {
  if (!birthdate) return null;
  const diff = Date.now() - birthdate.getTime();
  return Math.max(0, Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000)));
}

async function loadDashboard(userId: string): Promise<DashboardData> {
  const [user, todoListsRaw, prefRows] = await Promise.all([
    prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        birthdate: true,
        status: true,
      },
    }),
    prisma.todo_list.findMany({
      where: { user_id: userId },
      include: {
        category: { select: { id: true, name: true } },
        todo_list_task: {
          select: {
            id: true,
            description: true,
            is_completed: true,
            scheduled_date: true,
          },
          orderBy: { scheduled_date: "asc" },
        },
      },
      orderBy: { created_at: "asc" },
    }),
    prisma.user_category_preference.findMany({
      where: { user_profile: { user_id: userId } },
      include: { category: { select: { id: true, name: true } } },
    }),
  ]);

  if (!user) {
    throw new Error("Utilisateur introuvable");
  }

  const todoLists = todoListsRaw.map((l) => ({
    id: l.id,
    title: l.title,
    category: l.category,
    tasks: l.todo_list_task.map((t) => ({
      id: t.id,
      description: t.description,
      is_completed: !!t.is_completed,
      scheduled_date: t.scheduled_date ? t.scheduled_date.toISOString() : null,
    })),
  }));

  const allTasks: DashboardTask[] = todoLists.flatMap((l) => l.tasks);
  const total = allTasks.length;
  const done = allTasks.filter((t) => t.is_completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const now = Date.now();
  const pending = allTasks.filter(
    (t) => !t.is_completed && t.scheduled_date !== null,
  );
  const future = pending
    .filter((t) => new Date(t.scheduled_date!).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.scheduled_date!).getTime() -
        new Date(b.scheduled_date!).getTime(),
    );
  const past = pending
    .filter((t) => new Date(t.scheduled_date!).getTime() < now)
    .sort(
      (a, b) =>
        new Date(b.scheduled_date!).getTime() -
        new Date(a.scheduled_date!).getTime(),
    );
  const nextDeadline = future[0] || past[0] || null;

  const preferences = prefRows
    .map((r) => r.category)
    .filter((c): c is { id: string; name: string } => !!c);

  return {
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate ? user.birthdate.toISOString() : null,
      status: user.status,
    },
    todoLists,
    preferences,
    globalProgress: { done, total, percent },
    nextDeadline,
  };
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const userId =
    (session.user as { id?: string }).id ||
    (
      await prisma.users.findUnique({
        where: { email: session.user.email ?? "" },
        select: { id: true },
      })
    )?.id;

  if (!userId) redirect("/auth/login");

  const data = await loadDashboard(userId);

  const age = computeAge(
    data.user.birthdate ? new Date(data.user.birthdate) : null,
  );
  const userLabel = [
    data.user.firstname,
    age !== null ? `${age} ans` : null,
    data.user.status,
  ]
    .filter(Boolean)
    .join(", ");

  const taskDates = Array.from(
    new Set(
      data.todoLists
        .flatMap((l) => l.tasks)
        .map((t) => t.scheduled_date)
        .filter((d): d is string => !!d)
        .map((iso) => {
          const d = new Date(iso);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }),
    ),
  );

  const remaining = data.globalProgress.total - data.globalProgress.done;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10">
      <header className="mb-8">
        <h1>Bonjour {data.user.firstname || ""},</h1>
        <p className="mt-1 text-ink/70">prête à avancer aujourd'hui ?</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <ProgressCard
            percent={data.globalProgress.percent}
            done={data.globalProgress.done}
            total={data.globalProgress.total}
            nextDeadline={data.nextDeadline}
          />

          <UserCard user={data.user} preferences={data.preferences} />
        </div>

        <div className="flex flex-col gap-6">
          <StepsList
            todoLists={data.todoLists}
            globalPercent={data.globalProgress.percent}
            userLabel={userLabel}
            remaining={remaining}
          />

          <Calendar taskDates={taskDates} />
        </div>
      </div>
    </main>
  );
}
