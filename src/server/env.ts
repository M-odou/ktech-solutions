import { z } from 'zod';

/** Variables d'environnement serveur, validées au démarrage. */
const schema = z.object({
  DATABASE_URL: z.string().default('file:./storage/ktech.db'),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  STORAGE_DIR: z.string().default('./storage'),
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
