import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DiagnosticForm from "@/components/diagnostic/DiagnosticForm";

export const dynamic = "force-dynamic";

export default async function DiagnosticPage() {
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

  const rawQuestions = await prisma.global_question.findMany({
    include: { global_answer: true },
    orderBy: { question_text: "asc" },
  });

  const questions = rawQuestions.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    answers: q.global_answer.map((a) => ({
      id: a.id,
      answer_text: a.answer_text,
    })),
  }));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-3">
        <h1>Mon diagnostic</h1>
        <p>
          Réponds à ces quelques questions pour qu&apos;on personnalise tes
          démarches et tes recommandations.
        </p>
      </header>

      <DiagnosticForm userId={userId} questions={questions} />
    </main>
  );
}
