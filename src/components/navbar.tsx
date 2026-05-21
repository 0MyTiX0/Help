"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConnectionButton } from "./ConnectionButton";
import { slugify } from "@/lib/slug";

type CategoryItem = {
  id: string;
  name: string;
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [hasLoadedCategories, setHasLoadedCategories] = useState(false);

  useEffect(() => {
    if (!isMenuOpen || hasLoadedCategories) {
      return;
    }

    let cancelled = false;
    setIsLoadingCategories(true);

    fetch("/api/categories")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!cancelled) {
          setCategories(data.categories ?? []);
          setHasLoadedCategories(true);
        }
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des catégories:", err);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingCategories(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isMenuOpen, hasLoadedCategories]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <nav className="bg-surface">
      <div className="mx-auto flex h-40 max-w-360 items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link href="/" aria-label="Help - Accueil">
          <Image
            src="/images/help-logo.png"
            alt="Help"
            width={160}
            height={72}
            priority
            className="h-auto w-38 select-none object-contain"
          />
        </Link>

        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href="/je-suis-une-ecole"
            className="hidden rounded-full px-8 py-4 uppercase tracking-[0.02em] text-white transition-transform duration-200 hover:-translate-y-0.5 md:inline-flex bg-amber-100 shadow-[0_8px_20px_rgb(255_176_71/20%)]"
          >
            <h2>Je suis une école</h2>
          </Link>

          <ConnectionButton />

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="primary-menu"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform duration-200 hover:-translate-y-0.5 bg-amber-100 shadow-[0_8px_20px_rgb(255_176_71/20%)]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <>
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          <aside
            id="primary-menu"
            role="dialog"
            aria-modal="true"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-6 sm:px-8">
              <span className="text-lg font-semibold">Menu</span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-white hover:-translate-y-0.5 transition-transform"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col gap-8 px-6 pb-10 sm:px-8">
              <section>
                <h3 className="uppercase tracking-[0.22em] text-rose-100">
                  Catégories
                </h3>
                <ul className="mt-4 flex flex-col gap-1">
                  {isLoadingCategories ? (
                    <li>Chargement…</li>
                  ) : categories.length === 0 ? (
                    <li>Aucune catégorie disponible.</li>
                  ) : (
                    categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/categories/${slugify(category.name)}`}
                          onClick={closeMenu}
                          className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-amber-10"
                        >
                          <span>{category.name}</span>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 text-rose-100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </section>

              <section>
                <h3 className="uppercase tracking-[0.22em] text-rose-100">
                  Mon compte
                </h3>
                <ul className="mt-4 flex flex-col gap-1">
                  <li>
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-amber-10"
                    >
                      <span>Mon profil</span>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-rose-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/je-suis-une-ecole"
                      onClick={closeMenu}
                      className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-amber-10"
                    >
                      <span>Je suis une école</span>
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 text-rose-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M9 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
          </aside>
        </>
      ) : null}
    </nav>
  );
}
