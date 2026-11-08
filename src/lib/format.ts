import { PROJECT_CATEGORIES } from '@/config/site';

const CAT_LABEL: Record<string, string> = Object.fromEntries(PROJECT_CATEGORIES.map((c) => [c.key, c.label]));
export const categoryLabel = (key: string) => CAT_LABEL[key] ?? key;

/** « 2026-03 » → « mars 2026 ». */
export function formatMonth(value: string) {
  const [y, m] = value.split('-').map(Number);
  if (!y || !m) return value;
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(Date.UTC(y, m - 1, 1));
}

/** Date SQLite (UTC) → « 8 nov. 2026, 14:05 » (fuseau de Dakar). */
export function formatDateTime(sqlite: string) {
  const d = new Date(sqlite.replace(' ', 'T') + 'Z');
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Dakar' }).format(d);
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} Ko`;
  return `${(n / 1024 / 1024).toFixed(1)} Mo`;
}

export function slugify(input: string) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const whatsappUrl = (number: string, text?: string) =>
  number ? `https://wa.me/${number.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null;

/** URL publique d'un fichier du stockage `media/`. */
export const mediaUrl = (relative: string) => `/media/${relative}`;

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

/** Texte → lignes non vides (champs « un élément par ligne »). */
export const toLines = (s: string) => s.split('\n').map((l) => l.trim()).filter(Boolean);
