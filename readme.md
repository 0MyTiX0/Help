# Projet React en TypeScript (Next.js) avec Prisma

Projet Next.js + React + TypeScript avec une base de données PostgreSQL hébergée sur VPS et gérée par Prisma.

## Prerequis

- Node.js 20 ou plus recent
- npm
- Accès SSH au VPS (clés SSH configurées)

## Installation

```bash
npm install
```

## Configuration de la base de données

### Tunnel SSH vers le VPS

Comme le port PostgreSQL est bloqué sur le VPS, un tunnel SSH est nécessaire pour se connecter en local.

**Avant de lancer l'application, démarrez le tunnel SSH dans un terminal dédié :**

```bash
npm run ssh-tunnel
```

Cette commande :

- Établit une connexion SSH sécurisée vers le VPS (root@192.162.71.191)
- Redirige le port local 5432 vers le serveur PostgreSQL distant
- Reste active en arrière-plan (utilise `-N` pour n'exécuter aucune commande distante)

Le tunnel doit rester ouvert tant que vous travaillez en développement.

### Variables d'environnement

Le fichier `.env` contient la chaîne de connexion à la base de données :

```
DATABASE_URL="postgresql://help_admin:...@localhost:5432/help_db?schema=public"
```

Cette URL utilise `localhost:5432` car le tunnel SSH redirige vers le serveur distant.

### Prisma

Prisma est utilisé pour la gestion du schéma et des migrations.

**Générer le Prisma Client :**

```bash
npx prisma generate
```

**Exécuter les migrations :**

```bash
npx prisma migrate dev
```

**Consulter les données (Prisma Studio) :**

```bash
npx prisma studio
```

## Lancer en developpement

**Terminal 1 - Démarrez le tunnel SSH :**

```bash
npm run ssh-tunnel
```

**Terminal 2 - Lancez l'application :**

```bash
npm run dev
```

Puis ouvrez http://localhost:3000

## Build de production

```bash
npm run build
```

## Lancer en production

```bash
npm run start
```

## Dépendances principales

- **Next.js** : framework React
- **Prisma** : ORM PostgreSQL
- **TypeScript** : typage statique
- **PostgreSQL** : base de données (sur VPS)
