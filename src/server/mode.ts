/**
 * Mode « vitrine » : site public sans base de données.
 * Actif sur Vercel quand DATABASE_URL n'est pas défini (ou partout avec SITE_MODE=static).
 * Le contenu vient alors de src/content/snapshot.json (npm run snapshot) et les images de public/media/ ;
 * le back-office et l'envoi des formulaires sont désactivés.
 */
export const STATIC_SITE =
  process.env.SITE_MODE === 'static' || (Boolean(process.env.VERCEL) && !process.env.DATABASE_URL);
