# KTech Solutions — site web et back-office

Site vitrine de **KTech Solutions** (formation numérique, développement web et mobile, identité visuelle,
impression, événementiel — Rufisque, Dakar) avec un back-office pour gérer tout le contenu et suivre les demandes.

**Stack :** Next.js 16 (App Router) · React 19 · TypeScript strict · Drizzle ORM + SQLite/libSQL · Zod · CSS natif à jetons.

## Démarrage

```bash
npm install
cp .env.example .env.local      # puis renseigner SESSION_SECRET (openssl rand -base64 32)
npm run db:setup                # crée la base, charge le contenu initial et le compte administrateur
npm run dev                     # http://localhost:3000 — back-office : /admin
```

`db:setup` affiche le mot de passe administrateur généré (ou utilise `ADMIN_PASSWORD`).
Pour créer un autre administrateur ou réinitialiser un mot de passe :

```bash
npm run admin:create -- prenom@ktechsolutions.co "MotDePasseSolide" "Prénom Nom"
```

| Commande | Rôle |
|---|---|
| `npm run dev` / `build` / `start` | Développement, build de production, serveur de production |
| `npm run check` | ESLint + TypeScript |
| `npm run db:generate` | Génère une migration SQL après modification de `src/server/db/schema.ts` |
| `npm run db:migrate` / `db:seed` | Applique les migrations / charge le contenu initial (idempotent) |
| `npm run db:studio` | Explorateur visuel de la base (Drizzle Studio) |

## Fonctionnalités

**Site public**
- Accueil, Services (une page par service), Réalisations (une page par projet : galerie, date, fiche projet,
  contexte, besoins, attendus, solution, livrables, résultats, références), Formations, À propos, Contact.
- **Demande de devis guidée** (`/devis`) en 6 étapes : besoin → projet → budget et délais → documents →
  coordonnées → récapitulatif modifiable. Brouillon conservé, validation à chaque étape, envoi avec progression,
  référence de suivi (ex. `DEV-2026-0007`).
- Mode clair / sombre (préférence système par défaut, choix mémorisé, sans flash au chargement).
- Accessibilité WCAG 2.2 AA vérifiée (axe-core) sur toutes les pages, dans les deux thèmes, mobile et desktop.

**Back-office** (`/admin`)
- Tableau de bord, suivi des **demandes** (statuts, notes internes, pièces jointes, réponse WhatsApp / appel / e-mail).
- Gestion des **réalisations** (galerie d'images, références…), **services**, **formations**, **questions fréquentes**.
- **Textes des pages** et coordonnées : formulaires générés depuis `src/content/settings.ts`.
- Chaque modification est publiée immédiatement (régénération des pages concernées).

## Architecture

```
src/
├─ app/
│  ├─ (site)/            pages publiques (layout : en-tête, pied de page, WhatsApp)
│  ├─ admin/             back-office : login/ + (panel)/ protégé
│  ├─ api/demandes/      réception des demandes (multipart, pièces jointes)
│  └─ media/[...path]/   diffusion des images publiques
├─ components/           ui/ (Icon, Logo, Field, Choice) · layout/ (Header, Footer…) · sections/
├─ features/             home/ · projects/ · quote/ (parcours de devis) · requests/ · admin/
├─ server/               db/ (schéma, client) · auth/ (session, DAL) · queries/ · actions/ · storage · env
├─ content/              settings.ts (textes éditables + valeurs par défaut) · seed-data.ts
├─ config/ · lib/        configuration statique · utilitaires (formatage, slug…)
└─ proxy.ts              redirection optimiste vers /admin/login
scripts/                 migrate, seed, create-admin, illustrations
drizzle/                 migrations SQL versionnées
```

Principes :
- **Serveur d'abord** : les pages lisent la base via `server/queries` (mises en cache par requête) ;
  seuls les composants interactifs sont des Client Components.
- **Sécurité** : chaque page, action et route d'administration appelle `requireAdmin()` (le proxy n'est qu'une
  vérification optimiste). Sessions JWT signées en cookie httpOnly, mots de passe hachés (scrypt), limitation des
  tentatives de connexion, champ piège anti-robots, validation Zod côté serveur, fichiers des demandes stockés hors
  du dossier public et téléchargeables uniquement par l'administration, SVG refusés à l'envoi.
- **Un seul schéma de validation** (`features/requests/schema.ts`) partagé entre le formulaire et le serveur.

## Mise en production

L'application a besoin d'un serveur Node (≥ 20.9) :

1. Variables : `SESSION_SECRET` (obligatoire), `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, `STORAGE_DIR`.
2. `npm ci && npm run db:migrate && npm run build && npm start`.
3. Conserver le dossier `storage/` (base SQLite + fichiers) sur un disque persistant et le sauvegarder.

Hébergements adaptés : VPS, Railway, Render (avec disque), o2switch (Node.js). Pour un hébergement sans disque
(Vercel…), utiliser Turso (`DATABASE_URL=libsql://…` + `DATABASE_AUTH_TOKEN`) et remplacer `server/storage.ts`
par un stockage objet (S3, Cloudflare R2).

## Charte

Couleurs relevées sur le logo et la carte de visite officiels : vert `#219B53`, sarcelle `#2A837E`, bleu `#2F69A1`,
bleu nuit `#1F3346`, dégradé vert → bleu. Typographie Poppins. Les déclinaisons accessibles (texte vert, accents
sur fond sombre et clair) sont définies en jetons dans `src/app/globals.css`.

## À compléter par KTech Solutions (depuis le back-office)

- E-mail de contact, liens des réseaux sociaux, confirmation du numéro WhatsApp.
- Vraies réalisations (photos, références, résultats) à la place des projets types.
- NINEA / RCCM et hébergeur dans les mentions légales.
