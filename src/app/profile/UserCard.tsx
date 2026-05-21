"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import type { DashboardCategory, DashboardUser } from "./types";

type Tab = "menu" | "compte" | "preferences";

export default function UserCard({
  user,
  preferences,
}: {
  user: DashboardUser;
  preferences: DashboardCategory[];
}) {
  const [tab, setTab] = useState<Tab>("menu");

  const fullname = [user.firstname, user.lastname].filter(Boolean).join(" ");
  const initials =
    [user.firstname?.[0], user.lastname?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  const age = user.birthdate
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - new Date(user.birthdate).getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        ),
      )
    : null;

  return (
    <div className="rounded-[1.6rem] border border-amber-20 bg-surface p-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-rose-20 text-rose-100 font-bold flex items-center justify-center">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-ink truncate">
            {fullname || user.firstname || "Utilisateur"}
          </div>
          <div className="text-ink/65 text-sm truncate">
            {age !== null ? `${age} ans` : "Âge inconnu"}
            {user.status ? ` · ${user.status}` : ""}
          </div>
        </div>
      </div>

      {tab === "menu" && (
        <ul className="mt-6 divide-y divide-amber-10 text-ink/85">
          <li>
            <button
              type="button"
              onClick={() => setTab("compte")}
              className="w-full flex items-center justify-between py-3 hover:text-rose-100 transition"
            >
              <span>Compte</span>
              <span className="text-ink/50" aria-hidden>
                ›
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setTab("preferences")}
              className="w-full flex items-center justify-between py-3 hover:text-rose-100 transition"
            >
              <span>Préférences</span>
              <span className="text-ink/50" aria-hidden>
                ›
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center justify-between py-3 text-rose-100"
            >
              <span>Se déconnecter</span>
              <span aria-hidden>›</span>
            </button>
          </li>
        </ul>
      )}

      {tab === "compte" && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setTab("menu")}
            className="text-sm text-ink/60 hover:text-ink mb-3"
          >
            ‹ Retour
          </button>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div>
              <label className="text-sm text-ink/70">Prénom</label>
              <input
                name="firstname"
                defaultValue={user.firstname || ""}
                className="mt-1 w-full rounded-lg border border-amber-20 px-3 py-2 focus:outline-none focus:border-amber-100"
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Nom</label>
              <input
                name="lastname"
                defaultValue={user.lastname || ""}
                className="mt-1 w-full rounded-lg border border-amber-20 px-3 py-2 focus:outline-none focus:border-amber-100"
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Date de naissance</label>
              <input
                type="date"
                name="birthdate"
                defaultValue={
                  user.birthdate
                    ? new Date(user.birthdate).toISOString().slice(0, 10)
                    : ""
                }
                className="mt-1 w-full rounded-lg border border-amber-20 px-3 py-2 focus:outline-none focus:border-amber-100"
              />
            </div>
            <div>
              <label className="text-sm text-ink/70">Statut</label>
              <input
                name="status"
                defaultValue={user.status || ""}
                className="mt-1 w-full rounded-lg border border-amber-20 px-3 py-2 focus:outline-none focus:border-amber-100"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-amber-100 text-surface py-2 font-medium"
            >
              Enregistrer
            </button>
          </form>
        </div>
      )}

      {tab === "preferences" && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setTab("menu")}
            className="text-sm text-ink/60 hover:text-ink mb-3"
          >
            ‹ Retour
          </button>
          <p className="text-sm text-ink/65 mb-3">Catégories favorites</p>
          {preferences.length === 0 ? (
            <p className="text-ink/55 text-sm">
              Aucune préférence enregistrée pour le moment.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {preferences.map((c) => (
                <li
                  key={c.id}
                  className="rounded-full border border-amber-100 bg-amber-10 px-3 py-1 text-sm text-ink"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
