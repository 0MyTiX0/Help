"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  firstname: z
    .string()
    .min(2, "Le prénom doit faire au moins 2 caractères")
    .optional()
    .or(z.literal("")),
  lastname: z
    .string()
    .min(2, "Le nom de famille doit faire au moins 2 caractères")
    .optional()
    .or(z.literal("")),
  birthdate: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email("L'email doit être valide"),
  password: z
    .string()
    .min(12, "Le mot de passe doit faire au moins 12 caractères")
    .refine(
      (value) => /[A-Z]/.test(value),
      "Le mot de passe doit contenir au moins une majuscule",
    )
    .refine(
      (value) => /[a-z]/.test(value),
      "Le mot de passe doit contenir au moins une minuscule",
    )
    .refine(
      (value) => /\d/.test(value),
      "Le mot de passe doit contenir au moins un chiffre",
    )
    .refine(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      "Le mot de passe doit contenir au moins un caractère spécial",
    ),
  situation: z.string().optional(),
  acceptTerms: z
    .boolean()
    .refine((value) => value, "Tu dois accepter les conditions"),
  acceptEmails: z.boolean().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type CategoryItem = {
  id: string;
  name: string;
  description: string | null;
};

const steps = [
  { number: "1", label: "Infos", active: true },
  { number: "2", label: "Thèmes", active: false },
  { number: "3", label: "Compte créer", active: false },
];

const situations = [
  "En recherche d'emploi",
  "En activité",
  "En formation",
  "Étudiant·e",
  "Parent aidant",
  "Autre",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-3 block text-ink">{children}</label>;
}

function StepCircle({ step, active }: { step: string; active: boolean }) {
  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-[0.95rem]"
      style={{
        backgroundColor: active ? "var(--color-rose-100)" : "transparent",
        borderColor: "var(--color-rose-100)",
        color: active ? "white" : "var(--color-rose-100)",
      }}
    >
      {step}
    </span>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptEmails: false,
      acceptTerms: false,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch("/api/categories");

        if (!response.ok) {
          throw new Error("Impossible de charger les catégories");
        }

        const payload = (await response.json()) as {
          categories: CategoryItem[];
        };
        setCategories(payload.categories);
      } catch (error) {
        console.error("Impossible de charger les catégories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const selectedCategories = useMemo(
    () =>
      categories.filter((category) =>
        selectedCategoryIds.includes(category.id),
      ),
    [categories, selectedCategoryIds],
  );

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  const goToStepTwo = async () => {
    const isStepOneValid = await trigger([
      "firstname",
      "lastname",
      "email",
      "password",
      "acceptTerms",
    ]);

    if (isStepOneValid) {
      setCurrentStep(2);
    }
  };

  const goToStepThree = () => {
    setCurrentStep(3);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
          birthdate: data.birthdate || "",
          situation: data.situation || "",
          selectedCategories: selectedCategoryIds,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error("Erreur lors de l'inscription:", responseData);
        return;
      }

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err);
    }
  };

  return (
    <main className="min-h-[calc(100vh-10rem)] bg-rose-20 lg:grid lg:grid-cols-[44%_56%]">
      <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="max-w-xl">
          <p className="mb-5 uppercase tracking-[0.18em] text-rose-100">
            Crée ton compte !
          </p>
          <h1 className="max-w-lg leading-[1.05] text-ink">
            Ne rate plus jamais une aide à laquelle tu as droit.
          </h1>
          <p className="mt-6 max-w-136 leading-7 text-ink/85">
            Avec ton compte Help, tu ne repars plus de zéro à chaque visite. On
            retient où tu en es, on te rappelle les délais qui approchent, et on
            t'accompagne étape par étape, que tu montes un dossier MDPH, que tu
            cherches une aide logement ou que tu prépares ta première élection.
            Pas de jargon. Pas de cases à cocher sans comprendre. Juste un guide
            qui s'adapte à ta situation, à ton rythme.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-surface px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex justify-end text-ink/80">
            <span>
              Déjà membre ?{" "}
              <Link
                href="/auth/login"
                className="underline decoration-ink underline-offset-4 transition hover:text-rose-100"
              >
                Se connecter →
              </Link>
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-ink">Crée ton compte gratuitement</h2>
            <p className="mt-3 text-ink/80">
              Rejoins des milliers de jeunes adultes qui reprennent le contrôle.
            </p>
          </div>

          <ol className="mt-10 flex items-center justify-center gap-3 text-ink/80">
            {steps.map((step, index) => (
              <li key={step.number} className="flex items-center gap-3">
                <StepCircle
                  step={step.number}
                  active={currentStep >= Number(step.number)}
                />
                <span>{step.label}</span>
                {index < steps.length - 1 && (
                  <span className="hidden h-px w-20 bg-ink/85 sm:block" />
                )}
              </li>
            ))}
          </ol>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6">
            {currentStep === 1 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Prénom</FieldLabel>
                    <input
                      type="text"
                      placeholder="Camille"
                      {...register("firstname")}
                      className="w-full rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 text-[1rem] text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
                    />
                    {errors.firstname && (
                      <p className="mt-2 text-rose-100">
                        {errors.firstname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel>Nom</FieldLabel>
                    <input
                      type="text"
                      placeholder="Martin"
                      {...register("lastname")}
                      className="w-full rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 text-[1rem] text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
                    />
                    {errors.lastname && (
                      <p className="mt-2 text-rose-100">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <FieldLabel>Date de naissance</FieldLabel>
                  <input
                    type="date"
                    {...register("birthdate")}
                    className="w-full rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 text-[1rem] text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
                  />
                  {errors.birthdate && (
                    <p className="mt-2 text-rose-100">
                      {errors.birthdate.message}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel>Adresse e-mail</FieldLabel>
                  <input
                    type="email"
                    placeholder="Camille@email.com"
                    {...register("email")}
                    className="w-full rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 text-[1rem] text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
                  />
                  {errors.email && (
                    <p className="mt-2 text-rose-100">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <FieldLabel>Mot de passe</FieldLabel>
                  <input
                    type="password"
                    placeholder="12 caractères minimum"
                    {...register("password")}
                    className="w-full rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 text-[1rem] text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
                  />
                  {errors.password && (
                    <p className="mt-2 text-rose-100">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel>Ta situation</FieldLabel>
                  <div className="relative">
                    <select
                      {...register("situation")}
                      className="w-full appearance-none rounded-[1.2rem] border border-amber-100 bg-amber-10 px-4 py-4 pr-12 text-ink outline-none transition focus:border-rose-100 focus:bg-surface"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Sélectionne
                      </option>
                      {situations.map((situation) => (
                        <option key={situation} value={situation}>
                          {situation}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-ink">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-1 text-ink/90">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-rose-100 text-rose-100 accent-rose-100"
                      {...register("acceptTerms")}
                    />
                    <span>
                      J'accepte les{" "}
                      <a
                        href="#"
                        className="underline decoration-ink underline-offset-4"
                      >
                        Conditions Générales d'Utilisation
                      </a>{" "}
                      et la{" "}
                      <a
                        href="#"
                        className="underline decoration-ink underline-offset-4"
                      >
                        Politique de confidentialité
                      </a>{" "}
                      de Help.
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-rose-100">
                      {errors.acceptTerms.message}
                    </p>
                  )}

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-rose-100 text-rose-100 accent-rose-100"
                      {...register("acceptEmails")}
                    />
                    <span>
                      Je veux recevoir les actu Help, et les nouvelles
                      ressources par e-mail.
                    </span>
                  </label>
                </div>

                <div className="pt-4 text-center">
                  <button
                    type="button"
                    onClick={goToStepTwo}
                    className="inline-flex min-w-40 items-center justify-center rounded-full px-8 py-4 text-white shadow-[0_10px_24px_var(--color-amber-20)] transition-transform duration-200 hover:-translate-y-0.5"
                    style={{ backgroundColor: "var(--color-amber-100)" }}
                  >
                    Continuer
                  </button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="text-center">
                  <h3 className="text-ink">Quels sujets t'intéressent ?</h3>
                  <p className="mt-2 text-ink/65">
                    (tu peux en choisir 0, 1 ou plusieurs)
                  </p>
                </div>

                {categoriesLoading ? (
                  <div className="rounded-full bg-rose-10 px-6 py-10 text-center text-ink/80">
                    Chargement des catégories...
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => {
                      const isSelected = selectedCategoryIds.includes(
                        category.id,
                      );

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className="rounded-full border-2 px-6 py-3 transition duration-200 hover:-translate-y-0.5"
                          style={{
                            backgroundColor: isSelected
                              ? "var(--color-rose-20)"
                              : "var(--color-rose-10)",
                            borderColor: isSelected
                              ? "var(--color-rose-100)"
                              : "var(--color-rose-20)",
                            color: isSelected
                              ? "var(--color-rose-100)"
                              : "var(--color-ink)",
                          }}
                        >
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="pt-8 text-center">
                  <button
                    type="button"
                    onClick={goToStepThree}
                    className="inline-flex min-w-40 items-center justify-center rounded-full px-8 py-4 text-white shadow-[0_10px_24px_var(--color-amber-20)] transition-transform duration-200 hover:-translate-y-0.5"
                    style={{ backgroundColor: "var(--color-amber-100)" }}
                  >
                    Continuer
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="text-center">
                  <h3 className="text-ink">Compte créer</h3>
                  <p className="mt-3 text-ink/80">
                    Vérifie tes informations avant de finaliser la création du
                    compte.
                  </p>
                </div>

                <div className="space-y-4 rounded-[1.6rem] border border-amber-100 bg-amber-10 p-6 text-ink">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-ink/65">Prénom</p>
                      <p className="mt-1">{watchedValues.firstname || "-"}</p>
                    </div>
                    <div>
                      <p className="text-ink/65">Nom</p>
                      <p className="mt-1">{watchedValues.lastname || "-"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-ink/65">Adresse e-mail</p>
                    <p className="mt-1">{watchedValues.email || "-"}</p>
                  </div>

                  <div>
                    <p className="text-ink/65">Date de naissance</p>
                    <p className="mt-1">
                      {watchedValues.birthdate
                        ? new Date(watchedValues.birthdate).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink/65">Ta situation</p>
                    <p className="mt-1">
                      {watchedValues.situation || "Sélectionne"}
                    </p>
                  </div>

                  <div>
                    <p className="text-ink/65">Thèmes sélectionnés</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((category) => (
                          <span
                            key={category.id}
                            className="rounded-full border border-rose-100 bg-rose-10 px-4 py-2 text-rose-100"
                          >
                            {category.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-ink/65">
                          Aucune catégorie sélectionnée
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="rounded-full border border-rose-100 px-6 py-3 text-rose-100 transition hover:bg-rose-10"
                  >
                    Retour
                  </button>

                  <button
                    type="submit"
                    className="inline-flex min-w-40 items-center justify-center rounded-full px-8 py-4 text-white shadow-[0_10px_24px_var(--color-amber-20)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                    style={{ backgroundColor: "var(--color-amber-100)" }}
                  >
                    {isSubmitting ? "Création en cours..." : "Créer mon compte"}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
