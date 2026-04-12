"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  birthdate: z.string().optional().or(z.literal("")),
  email: z.email("L'email doit être valide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Une erreur est survenue");
      }

      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setServerError(err.message);
    }
  };

  return (
    <div>
      <div>
        <h2>Créer un compte Help</h2>

        {serverError && <div>{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <label>Prénom (optionnel)</label>
              <input type="text" {...register("firstname")} />
              {errors.firstname && <p>{errors.firstname.message}</p>}
            </div>

            <div>
              <label>Nom (optionnel)</label>
              <input type="text" {...register("lastname")} />
              {errors.lastname && <p>{errors.lastname.message}</p>}
            </div>
          </div>

          <div>
            <label>Date de naissance (optionnel)</label>
            <input type="date" {...register("birthdate")} />
          </div>

          <hr />

          <div>
            <label>Email *</label>
            <input type="email" {...register("email")} />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <div>
            <label>Mot de passe *</label>
            <input type="password" {...register("password")} />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
