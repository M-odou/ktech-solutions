/**
 * Crée un administrateur ou réinitialise son mot de passe.
 * Usage : npm run admin:create -- email@domaine.com "MotDePasseSolide" "Nom"
 */
import { createClient } from '@libsql/client';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { hashPassword } from '../src/server/auth/password';
import { users } from '../src/server/db/schema';

const [email, password, name = 'Administrateur'] = process.argv.slice(2);
if (!email || !password || password.length < 10) {
  console.error('Usage : npm run admin:create -- <email> <mot de passe (10 caractères min.)> [nom]');
  process.exit(1);
}

const client = createClient({ url: process.env.DATABASE_URL ?? 'file:./storage/ktech.db', authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client);
const passwordHash = await hashPassword(password);
const [found] = await db.select().from(users).where(eq(users.email, email));
if (found) await db.update(users).set({ passwordHash, name }).where(eq(users.email, email));
else await db.insert(users).values({ email, name, passwordHash });
console.log(found ? `✓ Mot de passe mis à jour pour ${email}` : `✓ Administrateur créé : ${email}`);
client.close();
