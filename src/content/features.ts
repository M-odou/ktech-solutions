/**
 * Catalogue du panier : les « articles » que le visiteur ajoute à son projet, par service.
 *
 * ⚠️ Les prix sont des montants « à partir de » INDICATIFS (FCFA), à ajuster par KTech Solutions.
 * Le visiteur voit une estimation de départ ; le devis final reste établi par l'équipe.
 * Les `id` sont envoyés au serveur : ne pas les renommer une fois en ligne (les demandes reçues y font référence).
 */
import type { IconName } from '@/components/ui/Icon';

export type Feature = {
  id: string;
  icon: IconName;
  label: string;
  text: string;
  /** Prix indicatif « à partir de », en FCFA. */
  price: number;
  /** Unité affichée après le prix (ex. « par participant »). */
  unit?: string;
};

export const FEATURES: Record<string, Feature[]> = {
  developpement: [
    { id: 'dev-site-vitrine', icon: 'monitor', label: 'Site vitrine (jusqu’à 5 pages)', text: 'Présentation de votre activité, adapté au mobile.', price: 300_000 },
    { id: 'dev-app-mobile', icon: 'mobile', label: 'Application mobile Android et iOS', text: 'Une application installable sur les téléphones de vos clients.', price: 1_500_000 },
    { id: 'dev-comptes', icon: 'user', label: 'Comptes utilisateurs', text: 'Inscription, connexion, mot de passe oublié, profil.', price: 150_000 },
    { id: 'dev-paiement', icon: 'card', label: 'Paiement mobile et carte', text: 'Wave, Orange Money, Free Money, carte bancaire.', price: 250_000 },
    { id: 'dev-boutique', icon: 'bag', label: 'Boutique en ligne', text: 'Catalogue produits, panier, commandes et suivi.', price: 400_000 },
    { id: 'dev-reservation', icon: 'calendar', label: 'Prise de rendez-vous / réservation', text: 'Agenda en ligne, créneaux, confirmations automatiques.', price: 200_000 },
    { id: 'dev-admin', icon: 'layers', label: 'Tableau de bord d’administration', text: 'Gérez vos contenus, clients et commandes sans développeur.', price: 300_000 },
    { id: 'dev-notifications', icon: 'bell', label: 'Notifications SMS, e-mail ou push', text: 'Rappels, confirmations et alertes envoyés automatiquement.', price: 150_000 },
    { id: 'dev-chat', icon: 'chat', label: 'Messagerie / chat en direct', text: 'Échange en temps réel entre vos utilisateurs ou avec vous.', price: 250_000 },
    { id: 'dev-whatsapp', icon: 'whatsapp', label: 'Intégration WhatsApp', text: 'Bouton de contact et messages pré-remplis vers WhatsApp.', price: 50_000 },
    { id: 'dev-geoloc', icon: 'pin', label: 'Carte et géolocalisation', text: 'Points de vente, livraison, suivi de position.', price: 150_000 },
    { id: 'dev-multilingue', icon: 'globe', label: 'Version multilingue', text: 'Français, anglais, wolof… selon vos publics.', price: 150_000 },
    { id: 'dev-blog', icon: 'book', label: 'Blog / actualités', text: 'Publiez articles et annonces vous-même.', price: 100_000 },
    { id: 'dev-stats', icon: 'chart', label: 'Statistiques et rapports', text: 'Ventes, visites, activité : vos chiffres en un coup d’œil.', price: 200_000 },
    { id: 'dev-seo', icon: 'search', label: 'Référencement Google', text: 'Bonnes bases pour être trouvé sur Google.', price: 100_000 },
    { id: 'dev-maintenance', icon: 'shield', label: 'Hébergement et maintenance (1 an)', text: 'Nom de domaine, hébergement, mises à jour et sauvegardes.', price: 150_000 },
  ],
  design: [
    { id: 'design-logo', icon: 'pen', label: 'Création de logo', text: 'Plusieurs pistes, affinage, fichiers pour le web et l’impression.', price: 100_000 },
    { id: 'design-charte', icon: 'design', label: 'Charte graphique', text: 'Couleurs, typographies et règles d’utilisation de votre marque.', price: 200_000 },
    { id: 'design-papeterie', icon: 'mail', label: 'Papeterie (cartes, en-têtes)', text: 'Cartes de visite, papier à en-tête, signature e-mail.', price: 50_000 },
    { id: 'design-reseaux', icon: 'instagram', label: 'Kit réseaux sociaux', text: 'Photos de profil, couvertures et modèles de publications.', price: 75_000 },
    { id: 'design-uiux', icon: 'mobile', label: 'Maquettes UI/UX d’application', text: 'Écrans de votre site ou application, testables avant le développement.', price: 250_000 },
    { id: 'design-visuels', icon: 'image', label: 'Visuels publicitaires', text: 'Flyers, affiches, bannières pour vos campagnes.', price: 30_000, unit: 'par visuel' },
  ],
  impression: [
    { id: 'print-cartes', icon: 'card', label: 'Cartes de visite (100 ex.)', text: 'Impression recto verso sur papier épais.', price: 15_000 },
    { id: 'print-flyers', icon: 'file', label: 'Flyers A5 (500 ex.)', text: 'Idéal pour la distribution et les comptoirs.', price: 50_000 },
    { id: 'print-affiches', icon: 'image', label: 'Affiches A3 / A2', text: 'Pour vos vitrines, événements et points de vente.', price: 5_000, unit: 'par affiche' },
    { id: 'print-brochures', icon: 'book', label: 'Brochures et dépliants', text: 'Présentation de votre offre, pliée et agrafée.', price: 75_000 },
    { id: 'print-rollup', icon: 'megaphone', label: 'Roll-up / kakémono', text: 'Support vertical avec structure de transport.', price: 45_000 },
    { id: 'print-bache', icon: 'building', label: 'Bâche et banderole', text: 'Grand format pour façades et événements.', price: 35_000 },
    { id: 'print-textile', icon: 'shirt', label: 'Textiles et goodies personnalisés', text: 'T-shirts, casquettes, stylos, tote bags.', price: 5_000, unit: 'par article' },
  ],
  formation: [
    { id: 'form-marketing', icon: 'megaphone', label: 'Marketing digital et réseaux sociaux', text: 'Stratégie, contenus, publicité Facebook / Instagram / TikTok.', price: 75_000, unit: 'par participant' },
    { id: 'form-uiux', icon: 'design', label: 'UI/UX Design', text: 'Concevoir des interfaces simples et efficaces (Figma).', price: 100_000, unit: 'par participant' },
    { id: 'form-dev', icon: 'dev', label: 'Développement web et mobile', text: 'Bases du code jusqu’à la mise en ligne d’un projet.', price: 150_000, unit: 'par participant' },
    { id: 'form-graphisme', icon: 'pen', label: 'Design graphique', text: 'Créer logos, affiches et visuels professionnels.', price: 75_000, unit: 'par participant' },
    { id: 'form-video', icon: 'video', label: 'Montage vidéo et création de contenu', text: 'Tourner et monter des vidéos pour les réseaux.', price: 75_000, unit: 'par participant' },
    { id: 'form-coaching', icon: 'student', label: 'Coaching individuel', text: 'Accompagnement personnalisé sur votre projet numérique.', price: 50_000, unit: 'par séance' },
    { id: 'form-entreprise', icon: 'users', label: 'Formation en entreprise (intra)', text: 'Programme sur mesure pour vos équipes, dans vos locaux.', price: 300_000, unit: 'par jour' },
  ],
  marketing: [
    { id: 'mkt-strategie', icon: 'target', label: 'Stratégie digitale', text: 'Audit de votre présence, cibles, messages et plan d’action.', price: 100_000 },
    { id: 'mkt-community', icon: 'chat', label: 'Gestion des réseaux sociaux', text: 'Publications régulières et réponses aux messages et commentaires.', price: 100_000, unit: 'par mois' },
    { id: 'mkt-pub', icon: 'megaphone', label: 'Campagnes publicitaires', text: 'Facebook, Instagram, TikTok : ciblage, création et suivi (hors budget pub).', price: 75_000, unit: 'par campagne' },
    { id: 'mkt-contenus', icon: 'image', label: 'Pack de visuels', text: '10 visuels aux couleurs de votre marque pour vos publications.', price: 50_000 },
    { id: 'mkt-videos', icon: 'video', label: 'Vidéos courtes (Reels, TikTok)', text: 'Tournage et montage de vidéos qui accrochent.', price: 30_000, unit: 'par vidéo' },
    { id: 'mkt-google', icon: 'pin', label: 'Fiche Google Maps', text: 'Création ou optimisation de votre fiche Google Business.', price: 25_000 },
    { id: 'mkt-rapport', icon: 'chart', label: 'Rapport de performance', text: 'Vos chiffres expliqués simplement, avec les prochaines actions.', price: 25_000, unit: 'par mois' },
  ],
  evenementiel: [
    { id: 'event-technique', icon: 'mic', label: 'Technique et sonorisation', text: 'Son, écrans, projection, connexion internet.', price: 150_000, unit: 'par jour' },
    { id: 'event-photo', icon: 'camera', label: 'Couverture photo', text: 'Photographe sur place, photos retouchées livrées.', price: 75_000, unit: 'par jour' },
    { id: 'event-video', icon: 'video', label: 'Captation vidéo et aftermovie', text: 'Tournage et film résumé de votre événement.', price: 150_000 },
    { id: 'event-live', icon: 'live', label: 'Diffusion en direct', text: 'Live sur Facebook, YouTube ou Zoom.', price: 100_000 },
    { id: 'event-supports', icon: 'layers', label: 'Supports visuels de l’événement', text: 'Badges, kakémonos, programme, signalétique.', price: 75_000 },
    { id: 'event-communication', icon: 'chat', label: 'Communication et réseaux sociaux', text: 'Annonce, relais en direct et bilan en ligne.', price: 100_000 },
    { id: 'event-inscriptions', icon: 'ticket', label: 'Billetterie / inscriptions en ligne', text: 'Formulaire, paiement, liste des participants.', price: 100_000 },
  ],
};

// Dans chaque rayon : un article pour prendre le service sans savoir encore quels livrables choisir.
for (const [service, list] of Object.entries(FEATURES)) {
  list.unshift({ id: `${service}-conseil`, icon: 'compass', label: 'Je veux ce service, conseillez-moi', text: 'Pas encore sûr de ce qu’il vous faut ? Ajoutez ce service, nous vous guidons.', price: 0 });
}

export type CartLine = Feature & { service: string };

const BY_ID: Record<string, CartLine> = Object.fromEntries(
  Object.entries(FEATURES).flatMap(([service, list]) => list.map((f) => [f.id, { ...f, service }])),
);

/** Articles connus, dans l'ordre du panier ; les identifiants inconnus sont ignorés. */
export const resolveCart = (ids: readonly string[]): CartLine[] => ids.map((id) => BY_ID[id]).filter((x): x is CartLine => Boolean(x));

export const cartTotal = (lines: readonly CartLine[]) => lines.reduce((sum, l) => sum + l.price, 0);

export const formatPrice = (n: number) => `${new Intl.NumberFormat('fr-FR').format(n).replace(/ | /g, ' ')} FCFA`;

export const priceLabel = (f: Feature) => (f.price ? `dès ${formatPrice(f.price)}${f.unit ? ` ${f.unit}` : ''}` : 'Sur devis');

/** Service le plus représenté dans le panier (pour pré-remplir le devis). */
export function mainService(lines: readonly CartLine[]): string | undefined {
  const counts = new Map<string, number>();
  for (const l of lines) counts.set(l.service, (counts.get(l.service) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}
