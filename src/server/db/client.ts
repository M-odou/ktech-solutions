import 'server-only';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { env } from '@/server/env';
import * as schema from './schema';

/**
 * Client unique (réutilisé entre rechargements à chaud en développement).
 * En local : fichier SQLite. En production : Turso/libSQL via DATABASE_URL + DATABASE_AUTH_TOKEN.
 */
const globalForDb = globalThis as unknown as { libsql?: ReturnType<typeof createClient> };

const client =
  globalForDb.libsql ?? createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN || undefined });
if (process.env.NODE_ENV !== 'production') globalForDb.libsql = client;

export const db = drizzle(client, { schema });
export { schema };
