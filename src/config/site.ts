/** Configuration statique du site (ce qui ne relève pas du contenu éditable). */
export { PROJECT_CATEGORIES } from '@/content/seed-data';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.ktechsolutions.co';

export const NAV = [
  { href: '/', label: 'Accueil' },
  { href: '/services/', label: 'Services' },
  { href: '/realisations/', label: 'Réalisations' },
  { href: '/formations/', label: 'Formations' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/contact/', label: 'Contact' },
] as const;

/** Un seul appel principal, partout le même. */
export const CTA = { primary: 'Demander un devis', href: '/devis/', whatsapp: 'Écrire sur WhatsApp' } as const;

export const SERVICE_ICONS = ['formation', 'dev', 'design', 'print', 'event', 'layers', 'target', 'compass', 'rocket', 'chat'] as const;
