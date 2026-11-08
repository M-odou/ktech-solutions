/**
 * Remplit la base avec le contenu initial et crée le compte administrateur.
 * Idempotent : ne remplace rien de ce qui existe déjà.
 * Usage : npm run db:seed
 */
import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { count, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import type { SQLiteTable } from 'drizzle-orm/sqlite-core';
import { DEFAULT_SETTINGS } from '../src/content/settings';
import { COURSES, FAQS, PROJECTS, SERVICES } from '../src/content/seed-data';
import { hashPassword } from '../src/server/auth/password';
import * as schema from '../src/server/db/schema';
import { illustrationsFor } from './illustrations.mts';

const client = createClient({ url: process.env.DATABASE_URL ?? 'file:./storage/ktech.db', authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client, { schema });
const storage = path.resolve(process.env.STORAGE_DIR ?? './storage');

async function isEmpty(table: SQLiteTable) {
  const [row] = await db.select({ n: count() }).from(table);
  return row.n === 0;
}

// Contenus éditoriaux : une ligne par section, uniquement si absente.
for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
  await db.insert(schema.settings).values({ key, value }).onConflictDoNothing();
}

if (await isEmpty(schema.services)) {
  await db.insert(schema.services).values(SERVICES.map((s, position) => ({ ...s, position })));
  console.log(`✓ ${SERVICES.length} services`);
}

if (await isEmpty(schema.projects)) {
  for (const [position, { art, ...p }] of PROJECTS.entries()) {
    const [row] = await db.insert(schema.projects).values({ ...p, position }).returning({ id: schema.projects.id });
    const images = illustrationsFor(art);
    for (const [i, img] of images.entries()) {
      const rel = `projects/${p.slug}/illustration-${i + 1}.svg`;
      await mkdir(path.join(storage, 'media', path.dirname(rel)), { recursive: true });
      await writeFile(path.join(storage, 'media', rel), img.svg);
      await db.insert(schema.projectImages).values({ projectId: row.id, path: rel, alt: img.alt, position: i });
    }
  }
  console.log(`✓ ${PROJECTS.length} projets (avec galeries)`);
}

if (await isEmpty(schema.courses)) {
  await db.insert(schema.courses).values(COURSES.map((c, position) => ({ ...c, position })));
  console.log(`✓ ${COURSES.length} formations`);
}

if (await isEmpty(schema.faqs)) {
  await db.insert(schema.faqs).values(FAQS.map((f, position) => ({ ...f, position })));
  console.log(`✓ ${FAQS.length} questions fréquentes`);
}

const email = process.env.ADMIN_EMAIL ?? 'admin@ktechsolutions.co';
const existing = await db.select().from(schema.users).where(eq(schema.users.email, email));
if (!existing.length) {
  const password = process.env.ADMIN_PASSWORD ?? randomBytes(9).toString('base64url');
  await db.insert(schema.users).values({ email, name: 'Administrateur', passwordHash: await hashPassword(password) });
  console.log(`✓ Compte administrateur créé : ${email}`);
  if (!process.env.ADMIN_PASSWORD) console.log(`  Mot de passe généré (à changer) : ${password}`);
}

console.log('✓ Base prête');
client.close();
