"use client";
import { useSession, signOut } from "next-auth/react";

export function ConnectionButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button
        type="button"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{
          backgroundColor: "var(--color-amber-100)",
          boxShadow: "0 8px 20px var(--color-amber-20)",
        }}
        aria-label="Chargement du compte"
      >
        <span className="h-4 w-4 animate-pulse rounded-full bg-surface/80" />
      </button>
    );
  }

  if (!session) {
    return (
      <button
        type="button"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform duration-200 hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--color-amber-100)",
          boxShadow: "0 8px 20px var(--color-amber-20)",
        }}
        aria-label="Connexion"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-amber-100)",
        boxShadow: "0 8px 20px var(--color-amber-20)",
      }}
      aria-label={`Déconnexion de ${session.user?.name ?? "votre compte"}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h10v-2h6v-2h-6v-2h-2Z" />
      </svg>
    </button>
  );
}
