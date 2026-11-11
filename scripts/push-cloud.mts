/**
 * Copie le contenu local vers le cloud (hébergement Vercel) :
 *   1. applique les migrations sur la base Turso ;
 *   2. remplace les données de Turso par celles de storage/ktech.db ;
 *   3. envoie les fichiers de storage/media et storage/private dans Vercel Blob (accès privé).
 *
 * Usage : renseigner dans .env.cloud.local
 *   DATABASE_URL=libsql://…   DATABASE_AUTH_TOKEN=…   BLOB_READ_WRITE_TOKEN=…
 * puis : npm run cloud:push
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { createClient, type InValue } from '@libsql/client';
import { put } from '@vercel/blob';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const LOCAL_DB = 'file:./storage/ktech.db';
const STORAGE = './storage';
/** Ordre d'insertion compatible avec les clés étrangères. */
const TABLES = ['settings', 'users', 'services', 'projects', 'project_images', 'courses', 'faqs', 'requests', 'request_files', 'request_notes'];

const url = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
if (!url?.startsWith('libsql://') || !authToken) throw new Error('Renseignez DATABASE_URL (libsql://…) et DATABASE_AUTH_TOKEN dans .env.cloud.local');
if (!blobToken) throw new Error('Renseignez BLOB_READ_WRITE_TOKEN dans .env.cloud.local');

// 1. Migrations
const remote = createClient({ url, authToken });
await migrate(drizzle(remote), { migrationsFolder: './drizzle' });
console.log('✓ Migrations appliquées sur Turso');

// 2. Données
const local = createClient({ url: LOCAL_DB });
const statements: { sql: string; args: InValue[] }[] = [];
for (const table of [...TABLES].reverse()) statements.push({ sql: `DELETE FROM "${table}"`, args: [] });
for (const table of TABLES) {
  const res = await local.execute(`SELECT * FROM "${table}"`);
  const cols = res.columns.map((c) => `"${c}"`).join(', ');
  const marks = res.columns.map(() => '?').join(', ');
  for (const row of res.rows) {
    statements.push({ sql: `INSERT INTO "${table}" (${cols}) VALUES (${marks})`, args: res.columns.map((c) => row[c] as InValue) });
  }
  console.log(`  ${table} : ${res.rows.length} ligne(s)`);
}
await remote.batch(statements, 'write');
console.log('✓ Données copiées vers Turso');
local.close();
remote.close();

// 3. Fichiers
const TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.txt': 'text/plain', '.zip': 'application/zip',
};
function* walk(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (name !== '.DS_Store') yield full;
  }
}
let sent = 0;
for (const bucket of ['media', 'private']) {
  for (const file of walk(path.join(STORAGE, bucket))) {
    const pathname = path.relative(STORAGE, file).split(path.sep).join('/');
    const contentType = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
    await put(pathname, readFileSync(file), { access: 'private', contentType, addRandomSuffix: false, allowOverwrite: true, token: blobToken });
    sent++;
  }
}
console.log(`✓ ${sent} fichier(s) envoyé(s) dans Vercel Blob`);
