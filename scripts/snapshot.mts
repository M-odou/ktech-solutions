/**
 * Instantané du contenu pour le mode vitrine (site sans base de données, ex. Vercel) :
 *   - src/content/snapshot.json : textes, services, réalisations, formations, FAQ (publiés ou non) ;
 *   - public/media/ : copie des images de storage/media.
 * À relancer après chaque modification faite dans le back-office local, puis pousser sur GitHub.
 * Usage : npm run snapshot
 */
import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../src/server/db/schema.ts';

const client = createClient({ url: process.env.DATABASE_URL ?? 'file:./storage/ktech.db', authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client, { schema });

const settings = Object.fromEntries((await db.select().from(schema.settings)).map((r) => [r.key, r.value]));
const snapshot = {
  settings,
  services: await db.select().from(schema.services),
  projects: await db.query.projects.findMany({ with: { images: true } }),
  courses: await db.select().from(schema.courses),
  faqs: await db.select().from(schema.faqs),
};
writeFileSync('src/content/snapshot.json', JSON.stringify(snapshot, null, 2) + '\n');
client.close();

rmSync('public/media', { recursive: true, force: true });
if (existsSync('storage/media')) cpSync('storage/media', 'public/media', { recursive: true, filter: (f) => !f.endsWith('.DS_Store') });

console.log(
  `✓ Instantané : ${snapshot.services.length} services, ${snapshot.projects.length} réalisations, ` +
    `${snapshot.courses.length} formations, ${snapshot.faqs.length} questions — images copiées dans public/media/`,
);
