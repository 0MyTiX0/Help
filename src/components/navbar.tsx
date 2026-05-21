"use client";
import Image from "next/image";
import Link from "next/link";
import { ConnectionButton } from "./ConnectionButton";

export default function Navbar() {
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
            className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white transition-transform duration-200 hover:-translate-y-0.5 bg-amber-100 shadow-[0_8px_20px_rgb(255_176_71/20%)]"
            aria-label="Menu"
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
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
