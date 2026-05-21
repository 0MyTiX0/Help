"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import type { DashboardTodoList, DashboardTask } from "./types";
import TaskModal from "./TaskModal";
import { toggleTaskCompletion } from "@/app/actions/diagnostic";

const CATEGORY_SVG: Record<string, string> = {
  "politique & citoyenneté": "Politique & citoyenneté",
  entreprise: "Entreprise",
  handicap: "Handicap",
  santé: "Santé",
  logement: "Logement",
  banque: "Banque",
  "permis et véhicules": "Permis et véhicules",
  "aides financières": "Aides financières",
  famille: "Famille",
  administratif: "Administratif",
};

const BG: Record<string, string> = {
  "politique & citoyenneté": "bg-rose-10",
  entreprise: "bg-amber-10",
  handicap: "bg-rose-20",
  santé: "bg-emerald-100/20",
  logement: "bg-rose-20",
  banque: "bg-amber-20",
  "permis et véhicules": "bg-amber-20",
  "aides financières": "bg-amber-20",
  famille: "bg-rose-10",
  administratif: "bg-indigo-100/20",
};

const BAR_TRACK: Record<string, string> = {
  "politique & citoyenneté": "bg-rose-10",
  entreprise: "bg-amber-10",
  handicap: "bg-rose-10",
  santé: "bg-emerald-100/15",
  logement: "bg-rose-10",
  banque: "bg-amber-10",
  "permis et véhicules": "bg-amber-10",
  "aides financières": "bg-amber-10",
  famille: "bg-rose-10",
  administratif: "bg-indigo-100/15",
};

const BAR_FILL: Record<string, string> = {
  "politique & citoyenneté": "bg-rose-100",
  entreprise: "bg-amber-100",
  handicap: "bg-rose-80",
  santé: "bg-emerald-500",
  logement: "bg-rose-60",
  banque: "bg-amber-100",
  "permis et véhicules": "bg-amber-100",
  "aides financières": "bg-amber-100",
  famille: "bg-rose-100",
  administratif: "bg-indigo-400",
};

function iconFor(name?: string | null): {
  svg: string | null;
  bg: string;
  track: string;
  fill: string;
} {
  const key = name?.trim().toLowerCase() ?? "";
  const filename = CATEGORY_SVG[key];
  return {
    svg: filename ? `/icons/${filename}.svg` : null,
    bg: BG[key] ?? "bg-amber-10",
    track: BAR_TRACK[key] ?? "bg-amber-10",
    fill: BAR_FILL[key] ?? "bg-amber-100",
  };
}

export default function StepsList({
  todoLists,
  globalPercent,
  userLabel,
  remaining,
}: {
  todoLists: DashboardTodoList[];
  globalPercent: number;
  userLabel: string;
  remaining: number;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<{
    task: DashboardTask;
    categoryName: string | null;
  } | null>(null);
  // optimistic local completion state: taskId -> true/false
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();

  const isCompleted = (task: DashboardTask) =>
    completedMap[task.id] ?? task.is_completed;

  const handleToggle = (task: DashboardTask) => {
    const next = !isCompleted(task);
    setCompletedMap((prev) => ({ ...prev, [task.id]: next }));
    startTransition(async () => {
      const result = await toggleTaskCompletion(task.id, next);
      if (!result.success) {
        // rollback on failure
        setCompletedMap((prev) => ({ ...prev, [task.id]: !next }));
      }
    });
  };

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-ink">Mes démarches à faire</h3>
          <p className="text-ink/65 text-sm">
            Basé sur ton profil · {userLabel}
          </p>
        </div>
        <div className="text-ink/65 text-sm">{remaining} restantes</div>
      </div>

      <div className="mt-6">
        <div className="relative w-full rounded-full bg-rose-10 h-2">
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-rose-100"
            style={{ width: `${globalPercent}%` }}
          />
          <span className="absolute -top-5 right-0 text-xs text-ink/60">
            {globalPercent}%
          </span>
          <span className="absolute -top-5 left-0 text-xs text-ink/60">
            Progression globale
          </span>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {todoLists.length === 0 && (
          <p className="text-ink/65 text-sm">
            Aucune démarche pour l'instant. Lance un quizz pour en générer.
          </p>
        )}
        {todoLists.map((list) => {
          const pendingTasks = list.tasks.filter((t) => !isCompleted(t));
          const total = list.tasks.length;
          const done = total - pendingTasks.length;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          const icon = iconFor(list.category?.name);
          const isOpen = openId === list.id;

          // Hide entire list if all tasks are done
          if (total > 0 && pendingTasks.length === 0) return null;

          return (
            <article
              key={list.id}
              className="rounded-[1.2rem] border border-black/10 bg-surface hover:border-black/20 transition shadow-sm"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : list.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                <div
                  className={`h-12 w-12 shrink-0 rounded-full ${icon.bg} flex items-center justify-center`}
                  aria-hidden
                >
                  {icon.svg ? (
                    <Image src={icon.svg} alt="" width={28} height={28} />
                  ) : (
                    <span className="text-xl">📌</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-ink truncate">
                      {list.category?.name || list.title || "Sans catégorie"}
                    </span>
                    <span className="text-ink/55 text-sm">
                      {done}/{total}
                    </span>
                  </div>
                  <div
                    className={`mt-2 relative w-full rounded-full ${icon.track} h-2`}
                  >
                    <div
                      className={`absolute left-0 top-0 h-2 rounded-full ${icon.fill}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="text-ink/60 text-sm w-12 text-right">
                  {pct}%
                </div>
                <span
                  className={`text-ink/60 text-3xl leading-none transition-transform ${isOpen ? "rotate-90" : ""}`}
                  aria-hidden
                >
                  ›
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-black/10 px-4 py-3">
                  {pendingTasks.length === 0 ? (
                    <p className="text-sm text-ink/55">
                      Toutes les tâches sont complétées 🎉
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {pendingTasks.map((task) => (
                        <li key={task.id} className="flex items-start gap-3 text-sm">
                          {/* Coche : toggle completion */}
                          <button
                            type="button"
                            onClick={() => handleToggle(task)}
                            aria-label="Marquer comme fait"
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                              isCompleted(task)
                                ? `${icon.fill} border-transparent text-surface`
                                : "border-ink/30 bg-surface hover:border-rose-100"
                            }`}
                          >
                            {isCompleted(task) ? "✓" : ""}
                          </button>

                          {/* Description : ouvre la modal */}
                          <button
                            type="button"
                            onClick={() =>
                              setActiveTask({
                                task,
                                categoryName:
                                  list.category?.name || list.title || null,
                              })
                            }
                            className="flex-1 min-w-0 text-left rounded-lg px-1 py-0.5 transition hover:bg-rose-10"
                          >
                            <p className="text-ink/85">{task.description}</p>
                            {task.scheduled_date && (
                              <p className="text-xs text-ink/50 mt-0.5">
                                {new Date(task.scheduled_date).toLocaleDateString(
                                  "fr-FR",
                                  {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>

      {activeTask && (
        <TaskModal
          task={activeTask.task}
          categoryName={activeTask.categoryName}
          onClose={() => setActiveTask(null)}
        />
      )}
    </div>
  );
}
