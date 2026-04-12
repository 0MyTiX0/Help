# Help - Next.js + Prisma + Auth

Application Next.js (App Router) avec authentification par identifiants, Prisma ORM et PostgreSQL distant via tunnel SSH.

## Prérequis

- Node.js 20+
- npm
- Accès SSH au serveur VPS

## Installation

```bash
npm install
```

## Variables d'environnement

Créer ou vérifier le fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://help_admin:...@localhost:5432/help_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="..."
```

`DATABASE_URL` pointe vers `localhost:5432` car la connexion passe par un tunnel SSH local.

## Tunnel SSH (obligatoire en dev)

Lancer dans un terminal dédié :

```bash
npm run ssh-tunnel
```

Script utilisé (`package.json`) :

```bash
ssh -L 5432:localhost:5432 root@192.162.71.191 -N
```

### Vérifier que le tunnel fonctionne

Dans un autre terminal PowerShell :

```powershell
Test-NetConnection localhost -Port 5432
```

Attendu : `TcpTestSucceeded : True`.

## Prisma (v7)

Le projet utilise Prisma 7 avec configuration explicite dans `prisma.config.ts`.

Fichier de config :

- charge `.env` via `import "dotenv/config"`
- expose `datasource.url` via `env("DATABASE_URL")`

Le client Prisma est généré avec `driverAdapters` dans `prisma/schema.prisma` et instancié avec l'adapter PostgreSQL dans `src/lib/prisma.ts` (`@prisma/adapter-pg` + `pg`).

### Commandes utiles

```bash
npx prisma generate
npx prisma db pull
npx prisma studio
```

## Authentification

### Pages

- `GET /auth/login`
- `GET /auth/register`

### API

- `POST /api/auth/register` : création utilisateur + hash mot de passe (`bcrypt`)
- `GET/POST /api/auth/[...nextauth]` : NextAuth Credentials provider

### Flux

1. Inscription via `/auth/register`
2. Redirection vers `/auth/login?registered=true`
3. Connexion Credentials
4. Redirection vers `/profile`

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

## Build / Start

```bash
npm run build
npm run start
```

## Dépannage rapide

- `The datasource.url property is required...` : vérifier `prisma.config.ts` et `dotenv`.
- `Using engine type "client" requires either "adapter"...` : vérifier l'instanciation dans `src/lib/prisma.ts` (adapter PrismaPg requis).
- Échec `db pull` avec tunnel actif : vérifier identifiants DB, droits utilisateur PostgreSQL et disponibilité du port distant.
