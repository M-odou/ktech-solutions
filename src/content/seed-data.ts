/**
 * Contenu initial chargé dans la base par `npm run db:seed`.
 * Ensuite, tout se modifie depuis le back-office (/admin).
 */
import type { Pair, Reference } from '@/server/db/schema';

type ServiceSeed = {
  slug: string; icon: string; title: string; shortTitle: string; summary: string;
  tags: string[]; needs: string[]; offers: string[]; benefits: Pair[]; steps: string[];
};

export const SERVICES: ServiceSeed[] = [
  {
    slug: 'formation', icon: 'formation', title: 'Formation et coaching numérique', shortTitle: 'Formation et coaching',
    summary: 'Des parcours concrets pour maîtriser les métiers du numérique et renforcer les compétences de vos équipes.',
    tags: ['Marketing digital', 'UI/UX Design', 'Développement web & mobile', 'Design graphique', 'Montage vidéo'],
    needs: [
      'Vos équipes doivent monter en compétences sur des outils et métiers numériques.',
      'Vous voulez vous reconvertir ou lancer une activité dans le digital.',
      'Vous cherchez un accompagnement pratique, pas seulement théorique.',
    ],
    offers: ['Marketing digital et réseaux sociaux', 'UI/UX Design', 'Développement web et mobile', 'Design graphique', 'Montage vidéo et création de contenu', 'Coaching et renforcement des compétences'],
    benefits: [
      { title: 'Compétences immédiatement utiles', text: 'Chaque module débouche sur une réalisation concrète.' },
      { title: 'Programmes adaptés', text: 'Contenu ajusté à votre niveau, votre secteur et vos objectifs.' },
      { title: 'Suivi après la formation', text: 'Un accompagnement pour appliquer les acquis sur le terrain.' },
    ],
    steps: ['Évaluation des besoins', 'Programme sur mesure', 'Sessions pratiques', 'Suivi et évaluation'],
  },
  {
    slug: 'developpement', icon: 'dev', title: 'Développement de solutions numériques', shortTitle: 'Développement web et mobile',
    summary: 'Sites web, applications et outils métiers conçus pour simplifier vos opérations et accélérer votre croissance.',
    tags: ['Sites web', 'Applications web & mobiles', 'Solutions métiers', 'Automatisation'],
    needs: [
      'Votre présence en ligne ne reflète pas votre sérieux ni votre offre.',
      'Des tâches répétitives ou des fichiers dispersés ralentissent votre activité.',
      'Vous avez une idée d’application et cherchez un partenaire technique.',
    ],
    offers: ['Conception de sites web', 'Applications web et mobiles', 'Solutions métiers sur mesure', 'Automatisation et digitalisation des processus', 'Conseil technologique'],
    benefits: [
      { title: 'Des outils pensés pour vous', text: 'Développés à partir de vos processus réels.' },
      { title: 'Performance mobile', text: 'Des interfaces rapides, même sur des connexions limitées.' },
      { title: 'Évolutivité', text: 'Une architecture qui grandit avec votre organisation.' },
    ],
    steps: ['Cadrage fonctionnel', 'Maquettes et validation', 'Développement et tests', 'Mise en ligne et maintenance'],
  },
  {
    slug: 'design', icon: 'design', title: 'Conception graphique et identité visuelle', shortTitle: 'Identité visuelle',
    summary: 'Des identités de marque cohérentes et des visuels qui inspirent confiance au premier regard.',
    tags: ['Logos', 'Branding', 'Supports de communication', 'Design UI/UX'],
    needs: [
      'Votre image ne correspond plus à votre niveau d’exigence.',
      'Vos supports manquent de cohérence d’un canal à l’autre.',
      'Vous lancez une marque et partez de zéro.',
    ],
    offers: ['Création de logos', 'Branding et identité de marque', 'Supports de communication', 'Design UI/UX', 'Création de contenus visuels'],
    benefits: [
      { title: 'Une marque reconnaissable', text: 'Une identité claire, déclinable partout.' },
      { title: 'Crédibilité renforcée', text: 'Une image professionnelle qui rassure vos interlocuteurs.' },
      { title: 'Guide d’utilisation', text: 'Des règles simples pour rester cohérent dans le temps.' },
    ],
    steps: ['Immersion dans votre marque', 'Pistes créatives', 'Affinage', 'Livraison et charte'],
  },
  {
    slug: 'impression', icon: 'print', title: 'Impression numérique', shortTitle: 'Impression numérique',
    summary: 'Des supports imprimés soignés, du fichier à la livraison, pour toutes vos communications.',
    tags: ['Flyers & affiches', 'Cartes de visite', 'Brochures', 'Supports publicitaires'],
    needs: [
      'Vous avez besoin de supports imprimés de qualité dans des délais courts.',
      'Vous préparez un salon, un lancement ou un événement.',
      'Vous voulez un interlocuteur unique pour la création et l’impression.',
    ],
    offers: ['Flyers et affiches', 'Cartes de visite', 'Brochures et dépliants', 'Supports publicitaires', 'Supports de communication événementielle'],
    benefits: [
      { title: 'Création et impression réunies', text: 'Un seul interlocuteur, du design au produit fini.' },
      { title: 'Qualité contrôlée', text: 'Vérification des fichiers et des couleurs avant impression.' },
      { title: 'Délais maîtrisés', text: 'Un calendrier clair, adapté à vos échéances.' },
    ],
    steps: ['Brief et devis', 'Création ou vérification du fichier', 'Bon à tirer', 'Impression et livraison'],
  },
  {
    slug: 'evenementiel', icon: 'event', title: 'Accompagnement événementiel', shortTitle: 'Événementiel',
    summary: 'Un appui technique, numérique et créatif pour des événements réussis, avant, pendant et après.',
    tags: ['Technique & numérique', 'Communication', 'Supports visuels', 'Couverture & contenus'],
    needs: [
      'Vous organisez une conférence, un lancement, une formation ou un salon.',
      'Vous avez besoin d’une communication cohérente autour de l’événement.',
      'Vous voulez valoriser l’événement avec des contenus de qualité.',
    ],
    offers: ['Accompagnement technique et numérique', 'Communication événementielle', 'Création de supports visuels', 'Couverture et production de contenus'],
    benefits: [
      { title: 'Sérénité le jour J', text: 'Une équipe qui anticipe les aspects techniques.' },
      { title: 'Visibilité prolongée', text: 'Des contenus réutilisables après l’événement.' },
      { title: 'Cohérence de marque', text: 'Des supports alignés avec votre identité.' },
    ],
    steps: ['Cadrage de l’événement', 'Plan de communication', 'Production des supports', 'Couverture et bilan'],
  },
];

export const PROJECT_CATEGORIES = [
  { key: 'dev', label: 'Développement' },
  { key: 'graphique', label: 'Design graphique' },
  { key: 'uiux', label: 'UI/UX Design' },
  { key: 'formation', label: 'Formation' },
  { key: 'evenementiel', label: 'Événementiel' },
] as const;

export type ProjectSeed = {
  slug: string; title: string; client: string; sector: string; location: string; date: string; duration: string;
  categories: string[]; summary: string; context: string; needs: string; expectations: string;
  solution: string; deliverables: string; results: string; references: Reference[]; featured: boolean;
  /** Thème des illustrations générées pour la galerie. */
  art: 'web' | 'brand' | 'mobile' | 'training' | 'event';
};

/**
 * Projets types illustrant les prestations : à remplacer par les études de cas
 * réelles (avec l'accord des clients) depuis le back-office.
 */
export const PROJECTS: ProjectSeed[] = [
  {
    slug: 'plateforme-gestion-pme-logistique', title: 'Plateforme de gestion pour une PME logistique',
    client: 'PME du secteur logistique', sector: 'Transport et logistique', location: 'Dakar', date: '2026-03', duration: '4 mois',
    categories: ['dev', 'uiux'], art: 'web', featured: true,
    summary: 'Une application web pour centraliser commandes et livraisons, suivie en temps réel par toutes les équipes.',
    context: 'L’entreprise gérait ses commandes et ses livraisons sur des tableurs partagés, avec des erreurs de saisie et peu de visibilité sur l’avancement.',
    needs: 'Centraliser les informations, suivre chaque livraison et donner à chaque équipe l’accès aux données qui la concernent.',
    expectations: 'Un outil simple à prendre en main, utilisable sur mobile par les livreurs, et un tableau de bord clair pour la direction.',
    solution: 'Une application web responsive avec tableau de bord, suivi des statuts en temps réel et accès par rôle.',
    deliverables: 'Maquettes UI/UX, application web, formation des utilisateurs, documentation.',
    results: 'Suivi des opérations centralisé et partagé entre les équipes.',
    references: [],
  },
  {
    slug: 'parcours-marketing-digital-entrepreneurs', title: 'Parcours marketing digital pour entrepreneurs',
    client: 'Programme d’accompagnement d’entrepreneurs', sector: 'Entrepreneuriat', location: 'Dakar', date: '2025-11', duration: '6 semaines',
    categories: ['formation'], art: 'training', featured: true,
    summary: 'Un parcours d’ateliers pratiques pour donner aux entrepreneurs les bases d’une communication en ligne efficace.',
    context: 'Un programme d’accompagnement souhaitait renforcer la visibilité en ligne des entrepreneurs qu’il suit.',
    needs: 'Former des porteurs de projets aux fondamentaux du marketing digital, avec des cas concrets issus de leurs activités.',
    expectations: 'Que chaque participant reparte avec un plan d’action opérationnel et des contenus prêts à publier.',
    solution: 'Un parcours pratique en ateliers, avec un plan d’action individuel construit au fil des séances.',
    deliverables: 'Programme, supports pédagogiques, ateliers, évaluation finale.',
    results: 'Chaque participant repart avec un plan de communication opérationnel.',
    references: [],
  },
  {
    slug: 'communication-forum-professionnel', title: 'Communication d’un forum professionnel',
    client: 'Organisateur de forum entreprises–talents', sector: 'Événementiel', location: 'Dakar', date: '2025-09', duration: '2 mois',
    categories: ['evenementiel', 'graphique'], art: 'event', featured: true,
    summary: 'Identité d’événement, supports imprimés et couverture pour un forum réunissant entreprises et jeunes talents.',
    context: 'Un forum réunissant entreprises et jeunes talents, avec une forte attente de visibilité avant et pendant l’événement.',
    needs: 'Créer une identité d’événement et piloter la communication sur tous les supports.',
    expectations: 'Des supports cohérents, livrés à temps, et des contenus réutilisables après l’événement.',
    solution: 'Identité de l’événement, supports imprimés, visuels réseaux sociaux et couverture le jour J.',
    deliverables: 'Affiches, kakémonos, badges, visuels sociaux, contenus vidéo.',
    results: '',
    references: [],
  },
  {
    slug: 'identite-visuelle-cabinet-conseil', title: 'Identité visuelle d’un cabinet de conseil',
    client: 'Cabinet de conseil', sector: 'Conseil', location: 'Dakar', date: '2025-06', duration: '6 semaines',
    categories: ['graphique'], art: 'brand', featured: false,
    summary: 'Une identité sobre et affirmée pour accompagner la croissance d’un cabinet auprès de grands comptes.',
    context: 'Un cabinet en croissance souhaitait une image plus affirmée auprès de grands comptes.',
    needs: 'Créer une identité crédible, sobre et déclinable sur tous les supports.',
    expectations: 'Une charte simple à appliquer en interne et des modèles prêts à l’emploi.',
    solution: 'Logo, palette, typographies et système graphique accompagnés d’une charte.',
    deliverables: 'Logo, charte graphique, papeterie, modèles de présentation.',
    results: '',
    references: [],
  },
  {
    slug: 'application-mobile-prise-rendez-vous', title: 'Application mobile de prise de rendez-vous',
    client: 'Réseau de centres de services', sector: 'Services', location: 'Sénégal', date: '2025-04', duration: '3 mois',
    categories: ['uiux', 'dev'], art: 'mobile', featured: false,
    summary: 'Une application mobile légère pour réserver en ligne, sans passer par le téléphone.',
    context: 'Le réseau recevait ses rendez-vous uniquement par téléphone, avec des lignes souvent saturées.',
    needs: 'Permettre la réservation en ligne, simplement, depuis un smartphone.',
    expectations: 'Un parcours de réservation en moins d’une minute et des rappels automatiques.',
    solution: 'Parcours utilisateur testé, interface mobile légère et notifications de rappel.',
    deliverables: 'Recherche utilisateur, prototype, application mobile.',
    results: '',
    references: [],
  },
  {
    slug: 'site-institutionnel-organisation', title: 'Site institutionnel d’une organisation',
    client: 'Organisation associative', sector: 'Associatif', location: 'Dakar', date: '2025-02', duration: '2 mois',
    categories: ['dev'], art: 'web', featured: false,
    summary: 'Un site rapide et facile à mettre à jour pour présenter les programmes d’une organisation.',
    context: 'L’organisation avait besoin d’un site clair pour présenter ses programmes et ses actualités.',
    needs: 'Un site rapide, facile à mettre à jour par l’équipe interne.',
    expectations: 'Une mise à jour autonome des contenus et un affichage fluide sur mobile.',
    solution: 'Site responsive avec gestion de contenu et optimisation pour les connexions mobiles.',
    deliverables: 'Arborescence, maquettes, site web, formation à la mise à jour.',
    results: '',
    references: [],
  },
];

export const COURSES = [
  { title: 'Marketing digital', description: 'Stratégie, réseaux sociaux, publicité en ligne et mesure des résultats.', level: 'Débutant à intermédiaire', mode: 'Présentiel ou en ligne' },
  { title: 'UI/UX Design', description: 'Recherche utilisateur, wireframes, design d’interface et prototypage.', level: 'Débutant à intermédiaire', mode: 'Présentiel ou en ligne' },
  { title: 'Développement web', description: 'HTML, CSS, JavaScript et frameworks modernes pour créer des sites performants.', level: 'Débutant à avancé', mode: 'Présentiel ou en ligne' },
  { title: 'Développement mobile', description: 'Conception et publication d’applications mobiles multiplateformes.', level: 'Intermédiaire', mode: 'Présentiel ou en ligne' },
  { title: 'Design graphique', description: 'Principes visuels, identité de marque et maîtrise des outils de création.', level: 'Débutant à intermédiaire', mode: 'Présentiel' },
  { title: 'Montage vidéo & contenu', description: 'Tournage, montage et formats pour les réseaux sociaux.', level: 'Débutant', mode: 'Présentiel' },
];

export const FAQS = [
  { question: 'Comment démarrer un projet avec KTech Solutions ?', answer: 'Lancez une demande de devis en ligne ou écrivez-nous sur WhatsApp. Nous commençons par un échange pour comprendre votre besoin, puis nous vous proposons une approche et un devis adaptés.' },
  { question: 'Pouvez-vous gérer à la fois la création et l’impression de mes supports ?', answer: 'Oui. Nous concevons vos supports (flyers, affiches, cartes de visite, brochures…) puis nous assurons l’impression, avec vérification des fichiers et bon à tirer avant production.' },
  { question: 'Vos formations sont-elles en présentiel ou en ligne ?', answer: 'Selon le domaine, les formations se déroulent en présentiel ou en ligne. Pour les entreprises, nous construisons des sessions en intra-entreprise ou à distance.' },
  { question: 'Proposez-vous des formations sur mesure pour les entreprises ?', answer: 'Oui. Nous partons d’un diagnostic des compétences, adaptons les contenus à votre secteur et à vos outils, et remettons un bilan à la fin du parcours.' },
  { question: 'Assurez-vous un suivi après la livraison ?', answer: 'Oui. Selon les prestations retenues, nous assurons la mise en ligne, la maintenance, la formation de vos équipes et l’évolution de vos outils.' },
];
