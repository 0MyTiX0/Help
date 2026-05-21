import Image from "next/image";
import type { DashboardTodoList } from "./types";

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
  santé: "bg-amber-10",
  logement: "bg-rose-20",
  banque: "bg-amber-20",
  "permis et véhicules": "bg-amber-20",
  "aides financières": "bg-amber-20",
  famille: "bg-rose-10",
  administratif: "bg-rose-10",
};

function iconFor(name?: string | null): { svg: string | null; bg: string } {
  const key = name?.trim().toLowerCase() ?? "";
  const filename = CATEGORY_SVG[key];
  return {
    svg: filename ? `/images/${filename}.svg` : null,
    bg: BG[key] ?? "bg-amber-10",
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
        <div className="flex items-center justify-between text-sm text-ink/65 mb-2">
          <span>Progression globale</span>
        </div>
        <div className="relative w-full rounded-full bg-rose-10 h-2">
          <div
            className="absolute left-0 top-0 h-2 rounded-full bg-rose-100"
            style={{ width: `${globalPercent}%` }}
          />
          <span
            className="absolute -top-5 text-xs text-ink/60"
            style={{ left: `calc(${globalPercent}% - 16px)` }}
          >
            {globalPercent}%
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {todoLists.length === 0 && (
          <p className="text-ink/65 text-sm">
            Aucune démarche pour l'instant. Lance un quizz pour en générer.
          </p>
        )}
        {todoLists.map((list) => {
          const total = list.tasks.length;
          const done = list.tasks.filter((t) => t.is_completed).length;
          const pct = total === 0 ? 0 : Math.round((done / total) * 100);
          const icon = iconFor(list.category?.name);

          return (
            <article
              key={list.id}
              className="flex items-center gap-4 rounded-[1.2rem] border border-amber-20 bg-surface p-4 hover:border-amber-100 transition"
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
                <div className="mt-2 relative w-full rounded-full bg-amber-10 h-2">
                  <div
                    className="absolute left-0 top-0 h-2 rounded-full bg-amber-100"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="text-ink/60 text-sm w-12 text-right">{pct}%</div>
              <span className="text-ink/40 text-xl" aria-hidden>
                ›
              </span>
            </article>
          );
        })}
      </div>
    </div>
  );
}
