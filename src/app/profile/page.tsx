"use client";

import { signOut, useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <main className="main">
      <section className="card">
        <h1>Profile</h1>

        {session && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="inline-flex items-center rounded-full px-6 py-3 text-white"
              style={{ backgroundColor: "var(--color-amber-100)" }}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
