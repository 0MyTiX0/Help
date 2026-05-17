"use client";
import { useSession, signOut } from "next-auth/react";

export function ConnectionButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Chargement...</p>;
  if (!session) return <p>Non connecté</p>;

  return (
    <div>
      Bonjour {session.user?.name} !
      <button onClick={() => signOut()}>Déconnexion</button>
    </div>
  );
}
