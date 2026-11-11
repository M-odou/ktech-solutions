/**
 * Contenus éditoriaux modifiables depuis le back-office.
 * Chaque section décrit ses champs (le formulaire d'administration est généré
 * à partir de cette définition) et fournit les valeurs par défaut.
 */
import type { Pair } from '@/server/db/schema';

export type FieldType = 'text' | 'textarea' | 'lines' | 'pairs';
export type FieldDef = { key: string; label: string; type: FieldType; help?: string };
export type SectionDef = { label: string; description: string; fields: FieldDef[] };

export type Settings = {
  company: {
    name: string; tagline: string; description: string; signature: string;
    phone: string; whatsapp: string; email: string; address: string; hours: string;
    linkedin: string; instagram: string; facebook: string; tiktok: string;
  };
  home: {
    heroTitle: string; heroHighlight: string; heroIntro: string;
    foundersLabel: string; founders: string[]; marquee: string[];
    orbitTitle: string; orbitSubtitle: string;
    methodTitle: string; methodLead: string; steps: Pair[];
    projectsTitle: string;
    ctaTitle: string; ctaHighlight: string; ctaText: string;
  };
  services: { title: string; lead: string };
  projects: { title: string; lead: string; note: string };
  formations: {
    title: string; lead: string; objectives: string[]; audience: Pair[]; methods: Pair[];
    workshops: string[]; companyTitle: string; companyText: string; companyPoints: string[];
  };
  about: {
    title: string; lead: string; storyTitle: string; story: string[]; mission: string; vision: string;
    values: Pair[]; team: Pair[]; approach: Pair[];
  };
  contact: { title: string; lead: string };
  quote: { title: string; lead: string; successText: string };
  legal: { mentions: string; privacy: string };
};

export type SectionKey = keyof Settings;

const LINES_HELP = 'Un élément par ligne.';
const PAIRS_HELP = 'Un élément par ligne, au format : Titre | Texte';

export const SECTIONS: Record<SectionKey, SectionDef> = {
  company: {
    label: 'Entreprise et coordonnées',
    description: 'Nom, slogan, coordonnées et réseaux sociaux affichés sur tout le site.',
    fields: [
      { key: 'name', label: 'Nom', type: 'text' },
      { key: 'tagline', label: 'Slogan', type: 'text' },
      { key: 'description', label: 'Description (référencement)', type: 'textarea' },
      { key: 'signature', label: 'Signature', type: 'text' },
      { key: 'phone', label: 'Téléphone (affiché)', type: 'text', help: 'Ex. +221 78 150 75 84' },
      { key: 'whatsapp', label: 'Numéro WhatsApp', type: 'text', help: 'Format international sans « + », ex. 221781507584. Vide = masqué.' },
      { key: 'email', label: 'E-mail', type: 'text', help: 'Vide = masqué.' },
      { key: 'address', label: 'Adresse', type: 'text' },
      { key: 'hours', label: 'Horaires', type: 'text' },
      { key: 'linkedin', label: 'URL LinkedIn', type: 'text' },
      { key: 'instagram', label: 'URL Instagram', type: 'text' },
      { key: 'facebook', label: 'URL Facebook', type: 'text' },
      { key: 'tiktok', label: 'URL TikTok', type: 'text' },
    ],
  },
  home: {
    label: 'Page d’accueil',
    description: 'Textes du hero, du bandeau, de la méthode et de l’appel à l’action.',
    fields: [
      { key: 'heroTitle', label: 'Titre du hero (1re ligne)', type: 'text' },
      { key: 'heroHighlight', label: 'Titre du hero (2e ligne, en dégradé)', type: 'text' },
      { key: 'heroIntro', label: 'Texte d’accroche', type: 'textarea' },
      { key: 'foundersLabel', label: 'Titre des co-fondateurs', type: 'text' },
      { key: 'founders', label: 'Co-fondateurs', type: 'lines', help: 'Un nom par ligne.' },
      { key: 'marquee', label: 'Bandeau défilant', type: 'lines', help: LINES_HELP },
      { key: 'orbitTitle', label: 'Titre de la galerie', type: 'text' },
      { key: 'orbitSubtitle', label: 'Sous-titre de la galerie', type: 'text' },
      { key: 'methodTitle', label: 'Titre « Méthode »', type: 'text' },
      { key: 'methodLead', label: 'Introduction « Méthode »', type: 'textarea' },
      { key: 'steps', label: 'Étapes de la méthode', type: 'pairs', help: PAIRS_HELP },
      { key: 'projectsTitle', label: 'Titre « Projets »', type: 'text' },
      { key: 'ctaTitle', label: 'Appel à l’action (1re ligne)', type: 'text' },
      { key: 'ctaHighlight', label: 'Appel à l’action (2e ligne)', type: 'text' },
      { key: 'ctaText', label: 'Appel à l’action (texte)', type: 'textarea' },
    ],
  },
  services: {
    label: 'Page Services',
    description: 'En-tête de la page Services.',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'lead', label: 'Introduction', type: 'textarea' },
    ],
  },
  projects: {
    label: 'Page Réalisations',
    description: 'En-tête de la page Réalisations.',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'lead', label: 'Introduction', type: 'textarea' },
      { key: 'note', label: 'Note sous l’en-tête', type: 'textarea', help: 'Vide = masquée.' },
    ],
  },
  formations: {
    label: 'Page Formations',
    description: 'Textes de la page Formations (les formations elles-mêmes se gèrent dans « Formations »).',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'lead', label: 'Introduction', type: 'textarea' },
      { key: 'objectives', label: 'Objectifs pédagogiques', type: 'lines', help: LINES_HELP },
      { key: 'audience', label: 'Publics concernés', type: 'pairs', help: PAIRS_HELP },
      { key: 'methods', label: 'Méthodes d’apprentissage', type: 'pairs', help: PAIRS_HELP },
      { key: 'workshops', label: 'Exemples d’ateliers', type: 'lines', help: LINES_HELP },
      { key: 'companyTitle', label: 'Formation en entreprise — titre', type: 'text' },
      { key: 'companyText', label: 'Formation en entreprise — texte', type: 'textarea' },
      { key: 'companyPoints', label: 'Formation en entreprise — points', type: 'lines', help: LINES_HELP },
    ],
  },
  about: {
    label: 'Page À propos',
    description: 'Histoire, mission, vision, valeurs, équipe et approche.',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'lead', label: 'Introduction', type: 'textarea' },
      { key: 'storyTitle', label: 'Titre « Notre histoire »', type: 'text' },
      { key: 'story', label: 'Notre histoire (paragraphes)', type: 'lines', help: 'Un paragraphe par ligne.' },
      { key: 'mission', label: 'Mission', type: 'textarea' },
      { key: 'vision', label: 'Vision', type: 'textarea' },
      { key: 'values', label: 'Valeurs', type: 'pairs', help: PAIRS_HELP },
      { key: 'team', label: 'Équipe (pôles)', type: 'pairs', help: PAIRS_HELP },
      { key: 'approach', label: 'Approche de travail', type: 'pairs', help: PAIRS_HELP },
    ],
  },
  contact: {
    label: 'Page Contact',
    description: 'En-tête de la page Contact.',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'lead', label: 'Introduction', type: 'textarea' },
    ],
  },
  quote: {
    label: 'Demande de devis',
    description: 'Textes du parcours de demande de devis.',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'lead', label: 'Introduction', type: 'textarea' },
      { key: 'successText', label: 'Message de confirmation', type: 'textarea' },
    ],
  },
  legal: {
    label: 'Pages légales',
    description: 'Lignes commençant par « ## » = titres, « - » = listes, ligne vide = nouveau paragraphe.',
    fields: [
      { key: 'mentions', label: 'Mentions légales', type: 'textarea' },
      { key: 'privacy', label: 'Politique de confidentialité', type: 'textarea' },
    ],
  },
};

export const DEFAULT_SETTINGS: Settings = {
  company: {
    name: 'KTech Solutions',
    tagline: 'Votre partenaire numérique pour un avenir prospère',
    description:
      'KTech Solutions accompagne entreprises, entrepreneurs et talents au Sénégal : formation numérique, développement web et mobile, identité visuelle, impression et accompagnement événementiel.',
    signature: 'Former les talents, concevoir des solutions et connecter les opportunités.',
    phone: '+221 78 150 75 84',
    whatsapp: '221781507584',
    email: '',
    address: 'Rufisque, Dakar — Sénégal',
    hours: 'Du lundi au vendredi, 9h – 18h',
    linkedin: '', instagram: '', facebook: '', tiktok: '',
  },
  home: {
    heroTitle: 'Former les talents,',
    heroHighlight: 'concevoir les solutions.',
    heroIntro: 'Formation, solutions digitales et créativité, réunies dans une seule équipe.',
    foundersLabel: 'Co-fondateurs',
    founders: ['Samba Bery Kane', 'Moussa Tamba', 'Cheikh Saliou Talla', 'Modou Gningue Gueye'],
    marquee: ['Marketing digital', 'UI/UX Design', 'Sites web', 'Applications mobiles', 'Identité visuelle', 'Impression numérique', 'Événementiel', 'Coaching'],
    orbitTitle: 'Des idées qui prennent forme',
    orbitSubtitle: 'Sites · Applications · Identités · Formations · Événements',
    methodTitle: 'Une démarche claire, de l’écoute à l’accompagnement.',
    methodLead: 'Nous ne livrons pas seulement des projets. Nous transmettons les compétences pour que vous restiez autonomes.',
    steps: [
      { title: 'Comprendre votre besoin', text: 'Écoute, diagnostic et clarification de vos objectifs.' },
      { title: 'Concevoir la meilleure approche', text: 'Une solution adaptée à votre contexte et à votre budget.' },
      { title: 'Développer et mettre en œuvre', text: 'Production, tests et livraison dans les délais convenus.' },
      { title: 'Accompagner et faire évoluer', text: 'Formation, suivi et améliorations continues.' },
    ],
    projectsTitle: 'Ce que nous construisons pour nos clients.',
    ctaTitle: 'Une idée, un projet,',
    ctaHighlight: 'un défi numérique ?',
    ctaText: 'Décrivez votre besoin en quelques minutes : nous revenons vers vous rapidement avec une proposition.',
  },
  services: {
    title: 'Cinq expertises pour réussir votre transformation numérique.',
    lead: 'Formation, développement, design, impression et événementiel : choisissez un pôle ou combinez-les. Chaque prestation est adaptée à votre contexte.',
  },
  projects: {
    title: 'Des projets concrets, des résultats visibles.',
    lead: 'Développement, design, formation, événementiel : découvrez comment nous accompagnons nos clients.',
    note: 'Les projets présentés illustrent nos types de missions. Des études de cas détaillées sont publiées avec l’accord de nos clients.',
  },
  formations: {
    title: 'Développez les compétences numériques qui comptent.',
    lead: 'Des formations pratiques en marketing digital, design, développement et création de contenu, pour les particuliers comme pour les équipes.',
    objectives: [
      'Maîtriser les outils et méthodes professionnels du domaine choisi.',
      'Réaliser un projet concret, présentable à un client ou un employeur.',
      'Gagner en autonomie et en confiance dans sa pratique.',
      'Savoir apprendre en continu dans un secteur qui évolue vite.',
    ],
    audience: [
      { title: 'Étudiants et jeunes diplômés', text: 'Pour acquérir des compétences recherchées et construire un portfolio.' },
      { title: 'Entrepreneurs', text: 'Pour gérer soi-même sa communication et sa présence en ligne.' },
      { title: 'Professionnels en reconversion', text: 'Pour se former à un nouveau métier du numérique.' },
      { title: 'Entreprises et organisations', text: 'Pour renforcer les compétences des équipes.' },
    ],
    methods: [
      { title: 'Apprentissage par la pratique', text: 'L’essentiel du temps est consacré à des exercices et projets réels.' },
      { title: 'Petits groupes', text: 'Des effectifs réduits pour un suivi individuel de chaque participant.' },
      { title: 'Coaching et retours', text: 'Des retours réguliers d’un formateur expert pour progresser vite.' },
    ],
    workshops: [
      'Créer sa première campagne sur les réseaux sociaux',
      'Du wireframe au prototype cliquable',
      'Construire et publier un site web',
      'Concevoir un logo et sa déclinaison',
      'Monter une vidéo courte pour les réseaux',
      'Automatiser une tâche répétitive',
    ],
    companyTitle: 'Un programme conçu pour vos équipes.',
    companyText: 'Nous construisons avec vous un parcours adapté à vos outils, vos enjeux et votre planning, dans vos locaux ou à distance.',
    companyPoints: [
      'Diagnostic des compétences avant la formation',
      'Contenus adaptés à votre secteur et vos cas réels',
      'Sessions en intra-entreprise ou à distance',
      'Évaluation et bilan remis à l’organisation',
    ],
  },
  about: {
    title: 'Des talents au service de la transformation numérique.',
    lead: 'KTech Solutions réunit ingénieurs, professionnels du numérique et coachs-formateurs autour d’une conviction : le numérique doit créer des opportunités pour tous.',
    storyTitle: 'Né d’un constat : les compétences numériques ouvrent des portes.',
    story: [
      'KTech Solutions est née de la rencontre entre des ingénieurs, des créatifs et des formateurs qui partageaient une même observation : beaucoup d’organisations et de talents ont des idées fortes, mais manquent d’outils, de compétences ou d’accompagnement pour les concrétiser.',
      'Nous avons donc réuni sous un même toit la formation, le développement de solutions, le design, l’impression et l’accompagnement événementiel, pour offrir un partenaire unique, capable de suivre un projet de l’idée à sa réussite.',
    ],
    mission: 'Rendre les compétences et les solutions numériques accessibles, valoriser les talents locaux et accompagner les organisations dans leur développement.',
    vision: 'Devenir un acteur de référence de l’innovation et de la transformation numérique en Afrique.',
    values: [
      { title: 'Innovation', text: 'Chercher en permanence de meilleures façons de faire.' },
      { title: 'Excellence', text: 'Viser un haut niveau de qualité dans chaque livrable.' },
      { title: 'Collaboration', text: 'Construire avec nos clients, jamais à leur place.' },
      { title: 'Transmission', text: 'Partager nos savoirs pour rendre chacun autonome.' },
      { title: 'Engagement', text: 'Tenir nos promesses, du premier échange au suivi.' },
      { title: 'Créativité', text: 'Oser des idées qui distinguent nos clients.' },
    ],
    team: [
      { title: 'Ingénierie & développement', text: 'Ingénieurs et développeurs web et mobile.' },
      { title: 'Design & créativité', text: 'Designers UI/UX, graphistes et créateurs de contenu.' },
      { title: 'Formation & coaching', text: 'Coachs-formateurs issus du terrain.' },
      { title: 'Conseil & accompagnement', text: 'Chefs de projet et consultants en transformation digitale.' },
    ],
    approach: [
      { title: 'Écouter', text: 'Comprendre votre contexte, vos contraintes et vos ambitions.' },
      { title: 'Co-construire', text: 'Imaginer la solution avec vous, étape par étape.' },
      { title: 'Réaliser', text: 'Produire avec rigueur, en toute transparence.' },
      { title: 'Transmettre', text: 'Vous rendre autonomes et rester disponibles.' },
    ],
  },
  contact: {
    title: 'Parlons de votre projet.',
    lead: 'Une question, une idée, un besoin ? Écrivez-nous, appelez-nous ou lancez directement votre demande de devis.',
  },
  quote: {
    title: 'Votre demande de devis, en quelques minutes.',
    lead: 'Répondez à quelques questions simples : nous préparons une proposition adaptée à votre besoin, à votre budget et à vos délais.',
    successText: 'Notre équipe étudie votre demande et revient vers vous rapidement, par le moyen de contact que vous avez choisi.',
  },
  legal: {
    mentions: `## Éditeur du site
KTech Solutions — Rufisque, Dakar (Sénégal). Téléphone : +221 78 150 75 84.

Les informations d’immatriculation (NINEA, RCCM) sont communiquées sur simple demande.

## Hébergement
Le site est hébergé par un prestataire professionnel dont les coordonnées sont communiquées sur simple demande.

## Propriété intellectuelle
Le logo, l’identité visuelle, les textes et les illustrations de ce site sont la propriété de KTech Solutions. Toute reproduction sans autorisation écrite préalable est interdite.`,
    privacy: `## Données collectées
Lorsque vous utilisez nos formulaires, nous recueillons uniquement les informations que vous saisissez :
- vos nom et prénom, votre téléphone et, si vous le souhaitez, votre e-mail et votre entreprise ;
- la description de votre besoin et les documents que vous choisissez de joindre.

## Utilisation
Ces informations servent exclusivement à répondre à votre demande, à établir un devis ou une proposition de formation. Elles ne sont ni vendues ni cédées.

## Durée de conservation
Vos données sont conservées le temps nécessaire au traitement de votre demande et au suivi de la relation commerciale.

## Vos droits
Conformément à la loi sénégalaise n° 2008-12 sur la protection des données à caractère personnel, vous pouvez demander l’accès, la rectification ou la suppression de vos données en nous contactant.

## Cookies
Ce site n’utilise ni cookie publicitaire ni outil de suivi. Un cookie technique mémorise uniquement votre session d’administration et votre préférence d’affichage (clair ou sombre).`,
  },
};
