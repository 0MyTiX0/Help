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
    if (!isMenuOpen || hasLoadedCategories) return;
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
      .catch((err) =>
        console.error("Erreur lors du chargement des catégories:", err),
      )
      .finally(() => {
        if (!cancelled) setIsLoadingCategories(false);
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
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-amber-100 text-white shadow-2xl"
          >
            <div className="flex justify-end px-6 pt-6">
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
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

            <nav className="flex flex-1 flex-col items-center justify-center gap-5 px-6 pb-10 text-center">
              <Link
                href="/"
                onClick={closeMenu}
                className="text-2xl font-bold tracking-tight text-white"
              >
                Accueil
              </Link>
              <Link
                href="/je-suis-une-ecole"
                onClick={closeMenu}
                className="text-2xl font-bold tracking-tight text-white"
              >
                Je suis une école
              </Link>
              <Link
                href="/profile"
                onClick={closeMenu}
                className="text-2xl font-bold tracking-tight text-white"
              >
                Profil
              </Link>

              {isLoadingCategories ? (
                <span className="text-lg text-white/80">Chargement…</span>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${slugify(category.name)}`}
                    onClick={closeMenu}
                    className="text-2xl font-bold tracking-tight text-white"
                  >
                    {category.name}
                  </Link>
                ))
              )}
            </nav>
          </aside>
        </>
      ) : null}
    </nav>
  );
}
