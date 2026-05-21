# Help

Plateforme Next.js (App Router) à destination des jeunes et des écoles : diagnostic personnalisé, parcours par catégories, profil utilisateur avec todo-list, FAQ et avis. Stack Next 16 + React 19 + Prisma 7 + PostgreSQL + NextAuth (Credentials) + Tailwind v4.

## Stack technique

- **Framework** : Next.js 16 (App Router, bundler Webpack)
- **UI** : React 19, Tailwind CSS v4, Framer Motion, GSAP, Swiper, React Calendar
- **Formulaires** : React Hook Form + Zod (via `@hookform/resolvers`)
- **Auth** : NextAuth 4 (Credentials), `bcrypt` pour le hash
- **ORM** : Prisma 7 avec `driverAdapters` (`@prisma/adapter-pg` + `pg`)
- **Base de données** : PostgreSQL distant accessible via tunnel SSH

## Prérequis

- Node.js 20+
- npm
- Accès SSH au serveur VPS hébergeant PostgreSQL

## Installation

```bash
npm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://help_admin:<password>@localhost:5432/help_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<secret-aléatoire>"
```

`DATABASE_URL` pointe sur `localhost:5432` car la connexion passe par un tunnel SSH local (voir section suivante).

## Tunnel SSH (obligatoire en dev)

Lancer dans un terminal dédié :

```bash
npm run ssh-tunnel
```

Équivaut à :

```bash
ssh -L 5432:localhost:5432 root@192.162.71.191 -N
```

Vérifier que le tunnel répond (PowerShell) :

```powershell
Test-NetConnection localhost -Port 5432
```

Attendu : `TcpTestSucceeded : True`.

## Lancement en développement

Terminal 1 :

```bash
npm run ssh-tunnel
```

Terminal 2 :

```bash
npm run dev
```

Application : http://localhost:3000

## Scripts npm

| Script               | Description                                   |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Démarre Next.js en mode dev (Webpack)         |
| `npm run build`      | Build de production                           |
| `npm run start`      | Lance le serveur Next en mode production      |
| `npm run ssh-tunnel` | Ouvre le tunnel SSH vers PostgreSQL           |
| `npm test`           | Exécute la suite de tests Vitest (run unique) |
| `npm run test:watch` | Lance Vitest en mode watch                    |

## Prisma

Configuration explicite dans [prisma.config.ts](prisma.config.ts) :

- charge `.env` via `import "dotenv/config"`
- expose `datasource.url` via `env("DATABASE_URL")`

Le client est instancié avec l'adapter PostgreSQL dans [src/lib/prisma.ts](src/lib/prisma.ts) (`PrismaPg` + pool `pg`).

Commandes utiles :

```bash
npx prisma generate         # régénère le client après modif du schéma
npx prisma db pull          # introspecte la base distante
npx prisma studio           # UI d'exploration
npm exec prisma db seed     # seed via prisma/seed.ts (ts-node)
```

### Modèles principaux

Définis dans [prisma/schema.prisma](prisma/schema.prisma) :

- `users`, `user_profile`, `user_category_preference`
- `category`, `subcategory`, `resource`
- `category_question`, `category_answer`
- `global_question`, `global_answer`
- `todo_list`, `todo_list_task`
- `faq`, `faq_category`, `reviews`

## Authentification

### Pages

- [src/app/auth/login/page.tsx](src/app/auth/login/page.tsx) — connexion
- [src/app/auth/register/page.tsx](src/app/auth/register/page.tsx) — inscription

### API

- `POST /api/auth/register` — création utilisateur + hash `bcrypt`
- `GET/POST /api/auth/[...nextauth]` — NextAuth Credentials provider
- Configuration : [src/lib/auth.ts](src/lib/auth.ts)

### Flux

1. Inscription via `/auth/register`
2. Redirection vers `/auth/login?registered=true`
3. Connexion Credentials
4. Redirection vers `/profile`

Le middleware [src/middleware.ts](src/middleware.ts) protège les routes nécessitant une session.

## Routes applicatives

- `/` — accueil (sections home : `CategoryWheel`, `HowItWorks`, `KeyFigures`, `PromiseSection`, `ReviewsSection`, `FaqSection`, `IAmSchoolSection`)
- `/diagnostic` — questionnaire de diagnostic ([DiagnosticForm](src/components/diagnostic/DiagnosticForm.tsx) + server action [src/app/actions/diagnostic.ts](src/app/actions/diagnostic.ts))
- `/categories/[slug]` — page catégorie avec carrousel de sous-catégories
- `/je-suis-une-ecole` — landing dédiée aux écoles
- `/profile` — espace utilisateur (Calendar, ProgressCard, StepsList, TaskModal, UserCard)
- `/auth/login`, `/auth/register`

## API REST

- `GET /api/categories` — liste des catégories
- `GET/POST /api/reviews` — avis utilisateurs
- `GET/PUT /api/user/profile` — profil de l'utilisateur connecté
- `GET/POST/PUT/DELETE /api/user/todos` — todo-list utilisateur
- `POST /api/auth/register`
- `GET/POST /api/auth/[...nextauth]`

## Tests

Suite unitaire propulsée par **Vitest** (config : [vitest.config.ts](vitest.config.ts), alias `@/*` aligné sur `tsconfig.json`).

```bash
npm test            # run unique
npm run test:watch  # mode watch
```

Tests existants (dans `src/lib/__tests__/`) :

- [src/lib/**tests**/slug.test.ts](src/lib/__tests__/slug.test.ts) — couvre `slugify` (accents, casse, caractères spéciaux, `&` → `et`, entrées vides).
- [src/lib/**tests**/rate-limit.test.ts](src/lib/__tests__/rate-limit.test.ts) — couvre `checkRateLimit` (décrément du quota, blocage au-delà de la limite, réinitialisation après la fenêtre via `vi.useFakeTimers`).

Convention : placer chaque nouveau test sous `src/**/__tests__/*.test.ts(x)` (pattern pris en compte par la config Vitest).

Rate limiting basique disponible via [src/lib/rate-limit.ts](src/lib/rate-limit.ts).

## Structure du projet

```
prisma/                schema + seed
public/                icônes et images statiques
src/
  middleware.ts        protection de routes
  app/
    layout.tsx         layout racine
    page.tsx           accueil
    globals.css        styles Tailwind
    actions/           server actions
    api/               routes API (auth, categories, reviews, user)
    auth/              pages login / register
    categories/[slug]/ page catégorie dynamique
    diagnostic/        page diagnostic
    je-suis-une-ecole/ landing écoles
    profile/           espace utilisateur
  components/
    navbar.tsx, Footer.tsx, ConnectionButton.tsx
    categories/        SubcategoryCarousel
    diagnostic/        DiagnosticForm
    home/              sections de la home
    providers/         AuthProvider (SessionProvider)
  lib/                 auth, prisma, slug, reviews, rate-limit, profileColors
```

## Conventions UI

- Utiliser le token `surface` (#FFFDFF) plutôt que `white` pour les fonds clairs.
- Préserver les variantes `amber` et `rose` du thème Tailwind.
- Remplacer les `bg-white` / `bg-slate-50` historiques par `bg-surface`.

## Build / Production

```bash
npm run build
npm run start
```

Le tunnel SSH doit également être actif en production locale si la base n'est pas exposée directement.

## Dépannage

- **`The datasource.url property is required...`** : vérifier [prisma.config.ts](prisma.config.ts) et la présence de `dotenv`.
- **`Using engine type "client" requires either "adapter"...`** : vérifier l'instanciation dans [src/lib/prisma.ts](src/lib/prisma.ts) (adapter `PrismaPg` requis avec Prisma 7 + `driverAdapters`).
- **Échec `prisma db pull` malgré tunnel actif** : vérifier identifiants DB, droits PostgreSQL et que `Test-NetConnection localhost -Port 5432` répond `True`.
- **Erreur NextAuth `NO_SECRET`** : définir `NEXTAUTH_SECRET` dans `.env`.
- **Port 5432 déjà utilisé** : un PostgreSQL local est probablement actif ; le stopper ou rediriger le tunnel sur un autre port local et adapter `DATABASE_URL`.
