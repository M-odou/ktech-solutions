import { z } from 'zod';

/** Options du parcours de devis (partagées client / serveur). */
export const GOALS = [
  'Gagner en visibilité',
  'Attirer de nouveaux clients',
  'Vendre en ligne',
  'Moderniser mon image',
  'Gagner du temps au quotidien',
  'Former mes équipes',
  'Réussir un événement',
] as const;

export const BUDGETS = [
  'Moins de 500 000 FCFA',
  '500 000 – 1 500 000 FCFA',
  '1 500 000 – 5 000 000 FCFA',
  'Plus de 5 000 000 FCFA',
  'À définir ensemble',
] as const;

export const TIMELINES = ['Urgent (moins de 2 semaines)', 'Dans le mois', 'Dans 2 à 3 mois', 'Pas de date précise'] as const;
export const CONTACT_PREFS = ['WhatsApp', 'Appel téléphonique', 'E-mail'] as const;

const phone = z
  .string()
  .trim()
  .regex(/^[0-9+ ().-]{8,20}$/, 'Indiquez un numéro valide, avec l’indicatif (ex. +221 77 000 00 00).');
const email = z.union([z.literal(''), z.string().trim().email('Vérifiez l’adresse, par exemple nom@domaine.com.')]);
const name = z.string().trim().min(2, 'Indiquez votre nom pour que nous puissions vous répondre.').max(120);

export const quoteSchema = z
  .object({
    service: z.string().min(1, 'Choisissez un service, ou « Autre ».'),
    projectTypes: z.array(z.string().max(120)).max(10).default([]),
    description: z.string().trim().min(20, 'Décrivez votre projet en quelques phrases (20 caractères minimum).').max(4000),
    goals: z.array(z.enum(GOALS)).max(GOALS.length).default([]),
    budget: z.enum(BUDGETS, { message: 'Choisissez une fourchette de budget, ou « À définir ensemble ».' }),
    timeline: z.enum(TIMELINES, { message: 'Choisissez un délai.' }),
    name,
    phone,
    email,
    company: z.string().trim().max(160).default(''),
    contactPreference: z.enum(CONTACT_PREFS, { message: 'Choisissez comment vous préférez être contacté.' }),
    consent: z.literal('on', { message: 'Merci d’accepter que nous utilisions ces informations pour vous répondre.' }),
  })
  .refine((v) => v.contactPreference !== 'E-mail' || v.email !== '', {
    path: ['email'],
    message: 'Indiquez votre e-mail pour être contacté par e-mail.',
  });

export const trainingSchema = z.object({
  name,
  phone,
  email,
  profile: z.enum(['Particulier', 'Entrepreneur', 'Entreprise ou organisation'], { message: 'Choisissez votre profil.' }),
  domains: z.array(z.string().max(120)).max(20).default([]),
  message: z.string().trim().max(3000).default(''),
});

export const messageSchema = z.object({
  name,
  phone,
  email,
  message: z.string().trim().min(10, 'Écrivez votre message (10 caractères minimum).').max(3000),
});

export type FieldErrors = Record<string, string>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
}
