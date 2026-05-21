"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
function CircularProgress({
  value,
  size = 160,
}: {
  value: number;
  size?: number;
}) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="grad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="var(--color-amber-100)" />
          <stop offset="100%" stopColor="var(--color-rose-100)" />
        </linearGradient>
      </defs>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle
          r={radius}
          fill="none"
          stroke="var(--color-rose-10)"
          strokeWidth={stroke}
        />
        <circle
          r={radius}
          fill="none"
          stroke="url(#grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90)`}
        />
      </g>
    </svg>
  );
}
const Calendar = dynamic(() => import("react-calendar") as Promise<any>, {
  ssr: false,
});
export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [todoLists, setTodoLists] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          fetch("/api/user/profile"),
          fetch("/api/user/todos"),
        ]);

        if (pRes.ok) setProfile(await pRes.json());
        if (tRes.ok) {
          const data = await tRes.json();
          setTodoLists(data.todoLists || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
    // Calendar is dynamically imported via Next.js `dynamic` above
  }, []);

  const flatTasks = useMemo(
    () => todoLists.flatMap((l) => l.tasks || []),
    [todoLists],
  );
  const completedCount = flatTasks.filter((t) => t.is_completed).length;
  const totalCount = flatTasks.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <main className="main">
      <section className="card">
        <h1>Profile</h1>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-6">
              <h2 className="text-ink">Progression</h2>
              <p className="mt-2 text-ink/80">
                Basée sur l'avancement de tes tâches
              </p>

              <div className="rounded-[1.6rem] border border-rose-100 bg-surface p-6">
                <h3 className="text-ink">Ma progression globale</h3>
                <div className="mt-6 flex items-center gap-6">
                  <div>
                    <CircularProgress value={progress} size={160} />
                  </div>
                  <div>
                    <p className="text-ink text-[1.4rem] font-medium">
                      {progress}%
                    </p>
                    <p className="mt-2 text-ink/70">
                      {completedCount} tâches complétées sur {totalCount}
                    </p>
                    <div className="mt-4">
                      <button className="w-full rounded-full border border-rose-100 py-3 text-rose-100">
                        Il te reste à faire tes impôts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-ink">Mes démarches à faire</h3>
                  <p className="text-ink/65">
                    Basé sur ton profil · {profile?.user?.firstname || ""}{" "}
                    {profile?.user?.lastname
                      ? `, ${profile.user?.lastname}`
                      : ""}
                  </p>
                </div>
                <div className="text-ink/65">
                  {flatTasks.filter((t) => !t.is_completed).length} restantes
                </div>
              </div>

              <div className="mt-4">
                <div
                  className="w-full rounded-full bg-amber-10"
                  style={{ height: 12 }}
                >
                  <div
                    className="rounded-full bg-rose-100"
                    style={{ width: `${progress}%`, height: 12 }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {todoLists.map((list) => {
                  const total = (list.tasks || []).length;
                  const done = (list.tasks || []).filter(
                    (t: any) => t.is_completed,
                  ).length;
                  const pct =
                    total === 0 ? 0 : Math.round((done / total) * 100);
                  return (
                    <div
                      key={list.id}
                      className="rounded-[1.2rem] border border-amber-100 bg-surface p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-amber-10 flex items-center justify-center text-ink/80">
                          {" "}
                        </div>
                        <div>
                          <div className="font-medium text-ink">
                            {list.category?.name || list.title}
                          </div>
                          <div className="text-ink/65 text-sm">
                            {done}/{total}
                          </div>
                          <div
                            className="mt-2 w-64 rounded-full bg-amber-10"
                            style={{ height: 8 }}
                          >
                            <div
                              className="rounded-full bg-amber-100"
                              style={{ width: `${pct}%`, height: 8 }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-ink/65">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <div className="rounded-[1.6rem] border border-amber-100 bg-surface p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-full bg-rose-20 text-rose-100 font-bold">
                    {(
                      profile?.user?.firstname?.[0] ||
                      session?.user?.name?.[0] ||
                      ""
                    ).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-ink">
                      {profile?.user?.firstname
                        ? `${profile.user.firstname} ${profile.user.lastname || ""}`
                        : session?.user?.name || "-"}
                    </div>
                    <div className="text-ink/65 text-sm">
                      {profile?.user?.birthdate
                        ? `${Math.max(0, new Date().getFullYear() - new Date(profile.user.birthdate).getFullYear())} ans · Étudiante en alternance`
                        : "22 ans · Étudiante en alternance"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 divide-y divide-amber-10 text-ink/80">
                  <div className="py-3 flex items-center justify-between">
                    <div>Compte</div>
                    <div className="text-ink/60">›</div>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <div>Préférences</div>
                    <div className="text-ink/60">›</div>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <div>Notifications</div>
                    <div className="text-ink/60">›</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="mb-6">
              <h3 className="text-ink">Calendrier</h3>
              <div className="mt-3 rounded-[1.2rem] border border-amber-100 bg-surface p-3">
                {(() => {
                  const CalendarAny = Calendar as any;
                  return (
                    <CalendarAny
                      value={selectedDate || new Date()}
                      onChange={(d: Date) => setSelectedDate(d)}
                    />
                  );
                })()}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-ink">Préférences</h3>
              <div className="mt-3 rounded-[1.2rem] border border-amber-100 bg-amber-10 p-4">
                {profile?.categories?.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.categories.map((c: any) => (
                      <li key={c.id} className="text-ink">
                        {c.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-ink/65">Aucun thème sélectionné</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-ink">Notifications</h3>
              <div className="mt-3 rounded-[1.2rem] border border-amber-100 bg-amber-10 p-4">
                <p className="text-ink/65">
                  Aucune notification pour l'instant
                </p>
              </div>
            </div>
          </aside>

          <div className="col-span-full mt-6">
            {session && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center rounded-full px-6 py-3 text-white"
                style={{ backgroundColor: "var(--color-amber-100)" }}
              >
                Se déconnecter
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
