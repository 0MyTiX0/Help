"use client";

import { useMemo, useState } from "react";

const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const WEEK_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function Calendar({ taskDates }: { taskDates: string[] }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const taskSet = useMemo(() => new Set(taskDates), [taskDates]);

  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const arr: { date: Date; current: boolean }[] = [];

    for (let i = startWeekday - 1; i >= 0; i--) {
      arr.push({
        date: new Date(year, month - 1, daysInPrev - i),
        current: false,
      });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push({ date: new Date(year, month, d), current: true });
    }
    while (arr.length < 42) {
      const last = arr[arr.length - 1].date;
      const next = new Date(last);
      next.setDate(last.getDate() + 1);
      arr.push({ date: next, current: false });
    }
    return arr;
  }, [month, year]);

  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  const isoLocal = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const goPrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const goNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div className="rounded-[1.6rem] border border-amber-20 bg-amber-10 p-5">
      <div className="flex items-center justify-end gap-3 mb-3 text-ink/70 text-sm">
        <button
          type="button"
          onClick={goPrev}
          className="px-2 py-0.5 rounded hover:bg-amber-20"
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <span className="font-medium">
          {year} <span className="text-ink/40">▾</span>
        </span>
        <span className="font-medium">
          {MONTHS[month]} <span className="text-ink/40">▾</span>
        </span>
        <button
          type="button"
          onClick={goNext}
          className="px-2 py-0.5 rounded hover:bg-amber-20"
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {WEEK_LABELS.map((d) => (
          <div key={d} className="text-xs text-ink/55 font-medium pb-1">
            {d}
          </div>
        ))}

        {cells.map(({ date, current }, idx) => {
          const has = taskSet.has(isoLocal(date));
          const todayMark = current && isToday(date);
          return (
            <div
              key={idx}
              className="relative flex flex-col items-center justify-center text-sm py-1"
            >
              <span
                className={[
                  "inline-flex h-7 w-7 items-center justify-center rounded-md",
                  current ? "text-ink" : "text-ink/30",
                  todayMark
                    ? "border border-rose-100 text-rose-100 font-medium"
                    : "",
                ].join(" ")}
              >
                {date.getDate()}
              </span>
              {has && (
                <span
                  className="mt-0.5 block h-1 w-1 rounded-full bg-rose-100"
                  aria-label="Démarche prévue"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
