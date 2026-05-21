"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<any>(null);
  const [todoLists, setTodoLists] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [CalendarComp, setCalendarComp] = useState<any>(null);

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
    // try to import react-calendar dynamically
    (async () => {
      try {
        // use eval to avoid TS compile-time module resolution
        // eslint-disable-next-line no-eval
        const mod = await eval('import("react-calendar")');
        setCalendarComp(() => mod.default || mod);
      } catch (err) {
        // not installed — CalendarComp stays null
      }
    })();
  }, []);

  const flatTasks = useMemo(() => todoLists.flatMap((l) => l.tasks || []), [todoLists]);
  const completedCount = flatTasks.filter((t) => t.is_completed).length;
  const totalCount = flatTasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <main className="main">
      <section className="card">
        <h1>Profile</h1>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-6">
              <h2 className="text-ink">Progression</h2>
              <p className="mt-2 text-ink/80">Basée sur l'avancement de tes tâches</p>

              <div className="mt-4 w-full rounded-full bg-amber-10" style={{ height: 16 }}>
                <div
                  className="rounded-full bg-rose-100"
                  style={{ width: `${progress}%`, height: 16 }}
                />
              </div>
              <p className="mt-2">{progress}% complété ({completedCount}/{totalCount})</p>
            </div>

            <div className="mb-6">
              <h3 className="text-ink">Démarches à faire</h3>
              {todoLists.length === 0 ? (
                <p className="mt-3 text-ink/65">Aucune tâche pour le moment</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {todoLists.map((list) => (
                    <div key={list.id} className="rounded-[1.2rem] border border-amber-100 bg-amber-10 p-4">
                      <p className="font-medium">{list.category?.name || list.title}</p>
                      <ul className="mt-2 space-y-2">
                        {list.tasks.map((task: any) => (
                          <li key={task.id} className="flex items-start justify-between">
                            <span className={task.is_completed ? "text-ink/65 line-through" : "text-ink"}>
                              {task.description}
                            </span>
                            <span className="ml-4 text-ink/65">{task.scheduled_date ? new Date(task.scheduled_date).toLocaleDateString() : ""}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-ink">Compte</h3>
              <div className="mt-3 rounded-[1.2rem] border border-amber-100 bg-amber-10 p-4">
                <p className="text-ink/65">Nom</p>
                <p className="mt-1">{session?.user?.name || (profile?.user?.firstname ? `${profile.user.firstname} ${profile.user.lastname || ''}` : "-")}</p>

                <p className="mt-3 text-ink/65">Adresse e-mail</p>
                <p className="mt-1">{session?.user?.email || profile?.user?.email || "-"}</p>

                <p className="mt-3 text-ink/65">Date de naissance</p>
                <p className="mt-1">{profile?.user?.birthdate ? new Date(profile.user.birthdate).toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', year: 'numeric' }) : "-"}</p>
              </div>
            </div>
          </div>

          <aside>
            <div className="mb-6">
              <h3 className="text-ink">Calendrier</h3>
              <div className="mt-3 rounded-[1.2rem] border border-amber-100 bg-amber-10 p-3">
                {CalendarComp ? (
                  <CalendarComp value={selectedDate || new Date()} onChange={(d: Date) => setSelectedDate(d)} />
                ) : (
                  <div className="text-ink/65">Calendrier (installer `react-calendar` pour l'affichage)</div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-ink">Préférences</h3>
              <div className="mt-3 rounded-[1.2rem] border border-amber-100 bg-amber-10 p-4">
                {profile?.categories?.length > 0 ? (
                  <ul className="space-y-2">
                    {profile.categories.map((c: any) => (
                      <li key={c.id} className="text-ink">{c.name}</li>
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
                <p className="text-ink/65">Aucune notification pour l'instant</p>
              </div>
            </div>
          </aside>

          <div className="col-span-full mt-6">
            {session && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
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
