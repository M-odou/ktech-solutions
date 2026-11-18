/**
 * Catalogue du panier : les « articles » que le visiteur ajoute à son projet, par service.
 *
 * ⚠️ Les prix sont des montants « à partir de » INDICATIFS (FCFA), à ajuster par KTech Solutions.
 * Le visiteur voit une estimation de départ ; le devis final reste établi par l'équipe.
 * Les `id` sont envoyés au serveur : ne pas les renommer une fois en ligne (les demandes reçues y font référence).
 */
export type Feature = {
  id: string;
  label: string;
  text: string;
  /** Prix indicatif « à partir de », en FCFA. */
  price: number;
  /** Unité affichée après le prix (ex. « par participant »). */
  unit?: string;
};

export const FEATURES: Record<string, Feature[]> = {
  developpement: [
    { id: 'dev-site-vitrine', label: 'Site vitrine (jusqu’à 5 pages)', text: 'Présentation de votre activité, adapté au mobile.', price: 300_000 },
    { id: 'dev-app-mobile', label: 'Application mobile Android et iOS', text: 'Une application installable sur les téléphones de vos clients.', price: 1_500_000 },
    { id: 'dev-comptes', label: 'Comptes utilisateurs', text: 'Inscription, connexion, mot de passe oublié, profil.', price: 150_000 },
    { id: 'dev-paiement', label: 'Paiement mobile et carte', text: 'Wave, Orange Money, Free Money, carte bancaire.', price: 250_000 },
    { id: 'dev-boutique', label: 'Boutique en ligne', text: 'Catalogue produits, panier, commandes et suivi.', price: 400_000 },
    { id: 'dev-reservation', label: 'Prise de rendez-vous / réservation', text: 'Agenda en ligne, créneaux, confirmations automatiques.', price: 200_000 },
    { id: 'dev-admin', label: 'Tableau de bord d’administration', text: 'Gérez vos contenus, clients et commandes sans développeur.', price: 300_000 },
    { id: 'dev-notifications', label: 'Notifications SMS, e-mail ou push', text: 'Rappels, confirmations et alertes envoyés automatiquement.', price: 150_000 },
    { id: 'dev-chat', label: 'Messagerie / chat en direct', text: 'Échange en temps réel entre vos utilisateurs ou avec vous.', price: 250_000 },
    { id: 'dev-whatsapp', label: 'Intégration WhatsApp', text: 'Bouton de contact et messages pré-remplis vers WhatsApp.', price: 50_000 },
    { id: 'dev-geoloc', label: 'Carte et géolocalisation', text: 'Points de vente, livraison, suivi de position.', price: 150_000 },
    { id: 'dev-multilingue', label: 'Version multilingue', text: 'Français, anglais, wolof… selon vos publics.', price: 150_000 },
    { id: 'dev-blog', label: 'Blog / actualités', text: 'Publiez articles et annonces vous-même.', price: 100_000 },
    { id: 'dev-stats', label: 'Statistiques et rapports', text: 'Ventes, visites, activité : vos chiffres en un coup d’œil.', price: 200_000 },
    { id: 'dev-seo', label: 'Référencement Google', text: 'Bonnes bases pour être trouvé sur Google.', price: 100_000 },
    { id: 'dev-maintenance', label: 'Hébergement et maintenance (1 an)', text: 'Nom de domaine, hébergement, mises à jour et sauvegardes.', price: 150_000 },
  ],
  design: [
    { id: 'design-logo', label: 'Création de logo', text: 'Plusieurs pistes, affinage, fichiers pour le web et l’impression.', price: 100_000 },
    { id: 'design-charte', label: 'Charte graphique', text: 'Couleurs, typographies et règles d’utilisation de votre marque.', price: 200_000 },
    { id: 'design-papeterie', label: 'Papeterie (cartes, en-têtes)', text: 'Cartes de visite, papier à en-tête, signature e-mail.', price: 50_000 },
    { id: 'design-reseaux', label: 'Kit réseaux sociaux', text: 'Photos de profil, couvertures et modèles de publications.', price: 75_000 },
    { id: 'design-uiux', label: 'Maquettes UI/UX d’application', text: 'Écrans de votre site ou application, testables avant le développement.', price: 250_000 },
    { id: 'design-visuels', label: 'Visuels publicitaires', text: 'Flyers, affiches, bannières pour vos campagnes.', price: 30_000, unit: 'par visuel' },
  ],
  impression: [
    { id: 'print-cartes', label: 'Cartes de visite (100 ex.)', text: 'Impression recto verso sur papier épais.', price: 15_000 },
    { id: 'print-flyers', label: 'Flyers A5 (500 ex.)', text: 'Idéal pour la distribution et les comptoirs.', price: 50_000 },
    { id: 'print-affiches', label: 'Affiches A3 / A2', text: 'Pour vos vitrines, événements et points de vente.', price: 5_000, unit: 'par affiche' },
    { id: 'print-brochures', label: 'Brochures et dépliants', text: 'Présentation de votre offre, pliée et agrafée.', price: 75_000 },
    { id: 'print-rollup', label: 'Roll-up / kakémono', text: 'Support vertical avec structure de transport.', price: 45_000 },
    { id: 'print-bache', label: 'Bâche et banderole', text: 'Grand format pour façades et événements.', price: 35_000 },
    { id: 'print-textile', label: 'Textiles et goodies personnalisés', text: 'T-shirts, casquettes, stylos, tote bags.', price: 5_000, unit: 'par article' },
  ],
  formation: [
    { id: 'form-marketing', label: 'Marketing digital et réseaux sociaux', text: 'Stratégie, contenus, publicité Facebook / Instagram / TikTok.', price: 75_000, unit: 'par participant' },
    { id: 'form-uiux', label: 'UI/UX Design', text: 'Concevoir des interfaces simples et efficaces (Figma).', price: 100_000, unit: 'par participant' },
    { id: 'form-dev', label: 'Développement web et mobile', text: 'Bases du code jusqu’à la mise en ligne d’un projet.', price: 150_000, unit: 'par participant' },
    { id: 'form-graphisme', label: 'Design graphique', text: 'Créer logos, affiches et visuels professionnels.', price: 75_000, unit: 'par participant' },
    { id: 'form-video', label: 'Montage vidéo et création de contenu', text: 'Tourner et monter des vidéos pour les réseaux.', price: 75_000, unit: 'par participant' },
    { id: 'form-coaching', label: 'Coaching individuel', text: 'Accompagnement personnalisé sur votre projet numérique.', price: 50_000, unit: 'par séance' },
    { id: 'form-entreprise', label: 'Formation en entreprise (intra)', text: 'Programme sur mesure pour vos équipes, dans vos locaux.', price: 300_000, unit: 'par jour' },
  ],
  evenementiel: [
    { id: 'event-technique', label: 'Technique et sonorisation', text: 'Son, écrans, projection, connexion internet.', price: 150_000, unit: 'par jour' },
    { id: 'event-photo', label: 'Couverture photo', text: 'Photographe sur place, photos retouchées livrées.', price: 75_000, unit: 'par jour' },
    { id: 'event-video', label: 'Captation vidéo et aftermovie', text: 'Tournage et film résumé de votre événement.', price: 150_000 },
    { id: 'event-live', label: 'Diffusion en direct', text: 'Live sur Facebook, YouTube ou Zoom.', price: 100_000 },
    { id: 'event-supports', label: 'Supports visuels de l’événement', text: 'Badges, kakémonos, programme, signalétique.', price: 75_000 },
    { id: 'event-communication', label: 'Communication et réseaux sociaux', text: 'Annonce, relais en direct et bilan en ligne.', price: 100_000 },
    { id: 'event-inscriptions', label: 'Billetterie / inscriptions en ligne', text: 'Formulaire, paiement, liste des participants.', price: 100_000 },
  ],
};

export type CartLine = Feature & { service: string };

const BY_ID: Record<string, CartLine> = Object.fromEntries(
  Object.entries(FEATURES).flatMap(([service, list]) => list.map((f) => [f.id, { ...f, service }])),
);

/** Articles connus, dans l'ordre du panier ; les identifiants inconnus sont ignorés. */
export const resolveCart = (ids: readonly string[]): CartLine[] => ids.map((id) => BY_ID[id]).filter((x): x is CartLine => Boolean(x));

export const cartTotal = (lines: readonly CartLine[]) => lines.reduce((sum, l) => sum + l.price, 0);

export const formatPrice = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n).replace(/ | /g, ' ')} FCFA`;

export const priceLabel = (f: Feature) => `dès ${formatPrice(f.price)}${f.unit ? ` ${f.unit}` : ''}`;

/** Service le plus représenté dans le panier (pour pré-remplir le devis). */
export function mainService(lines: readonly CartLine[]): string | undefined {
  const counts = new Map<string, number>();
  for (const l of lines) counts.set(l.service, (counts.get(l.service) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}
