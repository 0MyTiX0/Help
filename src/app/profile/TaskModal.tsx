"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { DashboardTask } from "./types";

type TaskAction = {
  label: string;
  href: string;
  external: boolean;
};

function resolveAction(description: string): TaskAction {
  const d = description.toLowerCase();

  if (d.includes("questionnaire") || d.includes("diagnostic")) {
    return {
      label: "Faire le questionnaire",
      href: "/diagnostic",
      external: false,
    };
  }
  if (
    d.includes("impôt") ||
    d.includes("impot") ||
    d.includes("déclaration de revenus")
  ) {
    return {
      label: "Faire la démarche",
      href: "https://www.impots.gouv.fr/accueil",
      external: true,
    };
  }
  if (
    d.includes("caf") ||
    d.includes("apl") ||
    d.includes("aide au logement")
  ) {
    return {
      label: "Aller sur la CAF",
      href: "https://www.caf.fr/",
      external: true,
    };
  }
  if (d.includes("ameli") || d.includes("sécu") || d.includes("santé")) {
    return {
      label: "Aller sur Ameli",
      href: "https://www.ameli.fr/",
      external: true,
    };
  }
  if (d.includes("permis")) {
    return {
      label: "Faire la démarche",
      href: "https://permisdeconduire.ants.gouv.fr/",
      external: true,
    };
  }
  if (d.includes("vote") || d.includes("électoral")) {
    return {
      label: "Faire la démarche",
      href: "https://www.service-public.fr/particuliers/vosdroits/N47",
      external: true,
    };
  }
  if (d.includes("pôle emploi") || d.includes("france travail")) {
    return {
      label: "Aller sur France Travail",
      href: "https://www.francetravail.fr/",
      external: true,
    };
  }

  return {
    label: "Voir la démarche",
    href: "https://www.service-public.fr/",
    external: true,
  };
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function TaskModal({
  task,
  categoryName,
  onClose,
}: {
  task: DashboardTask;
  categoryName?: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const action = resolveAction(task.description);
  const dateLabel = formatDate(task.scheduled_date);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-md rounded-[1.5rem] bg-surface p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink/60 transition hover:bg-rose-10"
        >
          ✕
        </button>

        {dateLabel && (
          <span className="inline-flex rounded-full bg-rose-10 px-4 py-1.5 text-rose-100 font-semibold text-sm">
            {dateLabel}
          </span>
        )}

        <h3 id="task-modal-title" className="mt-4 text-ink">
          {categoryName || task.description}
        </h3>

        <p className="mt-3 text-ink/80">{task.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-10 px-4 py-3 text-ink transition hover:brightness-95"
          >
            <span aria-hidden>📘</span>
            <span>Guide help.</span>
          </Link>

          {action.external ? (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-10 px-4 py-3 text-ink transition hover:brightness-95"
            >
              <span aria-hidden>↗</span>
              <span>{action.label}</span>
            </a>
          ) : (
            <Link
              href={action.href}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-10 px-4 py-3 text-ink transition hover:brightness-95"
            >
              <span aria-hidden>→</span>
              <span>{action.label}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
