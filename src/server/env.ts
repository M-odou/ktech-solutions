import { z } from 'zod';

/** Variables d'environnement serveur, validées au démarrage. */
const schema = z.object({
  DATABASE_URL: z.string().default('file:./storage/ktech.db'),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  STORAGE_DIR: z.string().default('./storage'),
  /** Vercel Blob : renseigné automatiquement par Vercel quand un store Blob est relié au projet. */
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET doit faire au moins 32 caractères').default(
    // Valeur de développement uniquement ; refusée en production (voir plus bas).
    'dev-only-secret-change-me-dev-only-secret',
  ),
  ADMIN_EMAIL: z.string().email().default('admin@ktechsolutions.co'),
  ADMIN_PASSWORD: z.string().min(10).optional(),
});

export const env = schema.parse(process.env);

if (process.env.NODE_ENV === 'production' && env.SESSION_SECRET.startsWith('dev-only')) {
  throw new Error('SESSION_SECRET doit être défini en production (openssl rand -base64 32).');
}

// Sur Vercel, le disque est éphémère : la base doit être en ligne (Turso) et les fichiers dans Vercel Blob.
if (process.env.VERCEL) {
  if (env.DATABASE_URL.startsWith('file:')) {
    throw new Error('Sur Vercel, DATABASE_URL doit pointer vers Turso (libsql://…), avec DATABASE_AUTH_TOKEN.');
  }
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Sur Vercel, reliez un store Vercel Blob au projet (variable BLOB_READ_WRITE_TOKEN).');
  }
}
