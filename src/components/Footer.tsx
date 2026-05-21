import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f2e2ea] py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <Link
          href="/"
          aria-label="Help - Accueil"
          className="inline-flex self-start"
        >
          <Image
            src="/images/help-logo.png"
            alt="Help"
            width={110}
            height={50}
            className="h-auto w-24 select-none object-contain"
          />
        </Link>

        <p className="text-center leading-6 lg:max-w-xl">
          Mentions légales - Politique de confidentialité - CGU - Cookies -
          Accessibilité
          <br />© 2026 Help. Tous droits réservés
        </p>

        <div className="flex items-center gap-4 text-rose-100">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-bold">Nous suivre</h3>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="inline-flex h-10 w-10 items-center justify-center text-[#b12b5d]  transition-transform hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16.6 3.5c.8 1.2 1.9 2 3.4 2.2v3.1c-1.4 0-2.8-.4-4-1.1v6.4c0 3.1-2.5 5.6-5.6 5.6S4.8 17.2 4.8 14.1c0-3 2.4-5.4 5.4-5.6v3.2c-1.2.2-2.1 1.3-2.1 2.5 0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5V1.5h3.5c0 .7.2 1.4.6 2z" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center text-[#b12b5d]  transition-transform hover:-translate-y-0.5"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
                  <circle cx="12" cy="12" r="3.2" />
                  <circle
                    cx="17.3"
                    cy="6.7"
                    r="0.9"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
