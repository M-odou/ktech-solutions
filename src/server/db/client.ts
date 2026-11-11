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

function createDb() {
  const client =
    globalForDb.libsql ?? createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN || undefined });
  if (process.env.NODE_ENV !== 'production') globalForDb.libsql = client;
  return drizzle(client, { schema });
}

type Db = ReturnType<typeof createDb>;
let instance: Db | undefined;

/** Connexion ouverte au premier usage : importer ce module ne touche pas à la base (utile au build). */
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    instance ??= createDb();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
export { schema };
