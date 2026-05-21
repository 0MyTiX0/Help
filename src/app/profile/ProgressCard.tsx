import CircularProgress from "./CircularProgress";
import type { DashboardTask } from "./types";

export default function ProgressCard({
  percent,
  done,
  total,
  nextDeadline,
}: {
  percent: number;
  done: number;
  total: number;
  nextDeadline: DashboardTask | null;
}) {
  return (
    <div className="rounded-[1.6rem] border border-rose-100 bg-surface p-6 flex flex-col items-center">
      <h3 className="text-ink mb-4">Ma progression globale</h3>

      <CircularProgress value={percent} size={200} stroke={16} />

      <p className="mt-4 text-ink/65 text-sm">
        {done} tâches complétées sur {total}
      </p>

      {nextDeadline && (
        <div className="mt-5 w-full">
          <div className="flex items-center justify-center gap-3 rounded-full border border-rose-100 bg-rose-10 px-5 py-3 text-rose-100">
            <span
              aria-hidden
              className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-surface text-sm font-bold"
            >
              !
            </span>
            <span className="font-medium text-sm">
              Il te reste à faire {nextDeadline.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
