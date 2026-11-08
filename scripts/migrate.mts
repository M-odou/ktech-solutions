/** Applique les migrations SQL du dossier drizzle/. Usage : npm run db:migrate */
import { mkdirSync } from 'node:fs';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

const url = process.env.DATABASE_URL ?? 'file:./storage/ktech.db';
if (url.startsWith('file:')) mkdirSync('./storage', { recursive: true });

const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
await migrate(drizzle(client), { migrationsFolder: './drizzle' });
console.log('✓ Migrations appliquées');
client.close();
