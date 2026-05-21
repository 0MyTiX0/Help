"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("L'email doit être valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState("");

  const isRegistered = searchParams.get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setServerError("Email ou mot de passe incorrect");
    } else {
      router.refresh();
      router.push("/profile");
    }
  };

  return (
    <main className="min-h-[calc(100vh-10rem)] bg-rose-20 lg:grid lg:grid-cols-[44%_56%]">
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="max-w-xl">
          <p className="mb-5 uppercase tracking-[0.18em] text-rose-100">
            Connecte toi
          </p>
          <h1 className="max-w-lg leading-[1.05] text-ink">
            Là où tu t'étais arrêté
          </h1>
          <p className="mt-6 max-w-136 leading-7 text-ink/85">
            Ton compte Help. retient tout. Tes démarches en cours, tes
            prochaines échéances, tes ressources sauvegardées. Reconnecte-toi et
            reprends exactement là où tu en étais.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-surface px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex justify-end text-ink/80">
            <span>
              Pas encore de compte ?{" "}
              <Link
                href="/auth/register"
                className="underline decoration-ink underline-offset-4 transition hover:text-rose-100"
              >
                S'inscrire →
              </Link>
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-ink">Bon retour</h2>
            <p className="mt-3 text-ink/80">
              Avec ton compte Help, ne rate plus jamais une aide à laquelle tu
              as droit. Tout t'attend là où tu t'étais arrêté·e.
            </p>
          </div>

          {isRegistered && (
            <div className="mt-6 rounded-2xl border border-rose-20 bg-rose-10 px-4 py-3 text-ink">
              Compte créé avec succès ! Vous pouvez maintenant vous connecter.
            </div>
          )}

          {serverError && (
            <div className="mt-6 rounded-2xl border border-rose-20 bg-rose-10 px-4 py-3 text-ink">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            <div>
              <label className="mb-3 block text-ink">Adresse e-mail</label>
              <input
                type="email"
                placeholder="Camille@email.com"
                {...register("email")}
                className="w-full rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
              />
              {errors.email && (
                <p className="mt-2 text-rose-100">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-ink">Mot de passe</label>
              <input
                type="password"
                placeholder="8 caractères minimum"
                {...register("password")}
                className="w-full rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
              />
              {errors.password && (
                <p className="mt-2 text-rose-100">{errors.password.message}</p>
              )}
            </div>

            <div className="pt-1 text-ink/90">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-rose-100 text-rose-100 accent-rose-100"
                  {...register("rememberMe")}
                />
                <span>Rester connecté sur cette appareil</span>
              </label>
            </div>

            <div className="pt-14 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-w-40 items-center justify-center rounded-full px-8 py-4 text-white shadow-[0_10px_24px_var(--color-amber-20)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ backgroundColor: "var(--color-amber-100)" }}
              >
                {isSubmitting ? "Connexion en cours..." : "Continuer"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <LoginForm />
    </Suspense>
  );
}
