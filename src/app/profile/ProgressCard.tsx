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
    <div className="rounded-tr-[20px] rounded-bl-[20px] border border-rose-100 bg-surface p-6 flex flex-col items-center">
      <h3 className="text-ink mb-4">Ma progression globale</h3>

      <CircularProgress value={percent} size={200} stroke={16} />

      <p className="mt-4 text-ink/65 text-sm">
        {done} tâches complétées sur {total}
      </p>

      {nextDeadline && (
        <div className="mt-5 w-full">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-full border border-rose-100 bg-surface px-5 py-3 hover:bg-rose-10 transition"
          >
            <svg
              aria-hidden
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-rose-100"
            >
              <path
                d="M12 3 L22 20 H2 Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                fill="none"
              />
              <line
                x1="12"
                y1="10"
                x2="12"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17.5" r="1" fill="currentColor" />
            </svg>
            <span className="font-medium text-sm text-rose-100">
              Il te reste à faire {nextDeadline.description}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
