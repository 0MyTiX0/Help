"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitDiagnostic } from "@/app/actions/diagnostic";

type Answer = {
  id: string;
  answer_text: string;
};

type Question = {
  id: string;
  question_text: string;
  answers: Answer[];
};

type DiagnosticFormProps = {
  userId: string;
  questions: Question[];
};

export default function DiagnosticForm({
  userId,
  questions,
}: DiagnosticFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Map { questionId: answerId } — une seule réponse sélectionnée par question
  const [answersByQuestion, setAnswersByQuestion] = useState<
    Record<string, string>
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedAnswers = useMemo(
    () => Object.values(answersByQuestion),
    [answersByQuestion],
  );

  const selectAnswer = (questionId: string, answerId: string) => {
    setAnswersByQuestion((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = () => {
    setErrorMessage(null);

    if (selectedAnswers.length < questions.length) {
      setErrorMessage("Réponds à toutes les questions avant de valider.");
      return;
    }

    startTransition(async () => {
      const result = await submitDiagnostic(userId, selectedAnswers);
      if (result.success) {
        router.push("/profile");
        router.refresh();
      } else {
        setErrorMessage(result.error);
      }
    });
  };

  if (questions.length === 0) {
    return (
      <p>Aucune question disponible pour le moment. Reviens plus tard !</p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-8"
    >
      {questions.map((question) => (
        <fieldset key={question.id} className="flex flex-col gap-3">
          <legend>
            <h3>{question.question_text}</h3>
          </legend>
          <div className="flex flex-col gap-2">
            {question.answers.map((answer) => {
              const isChecked = answersByQuestion[question.id] === answer.id;
              return (
                <label
                  key={answer.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                    isChecked
                      ? "border-rose-100 bg-rose-10"
                      : "border-rose-20 bg-surface hover:bg-rose-10"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={answer.id}
                    checked={isChecked}
                    onChange={() => selectAnswer(question.id, answer.id)}
                    className="accent-rose-100"
                  />
                  <p>{answer.answer_text}</p>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {errorMessage && <p className="text-rose-100">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex self-start rounded-full bg-amber-100 px-6 py-3 text-white shadow-[0_10px_24px_rgba(255,176,71,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <h3>{isPending ? "Envoi en cours…" : "Valider mon diagnostic →"}</h3>
      </button>
    </form>
  );
}
