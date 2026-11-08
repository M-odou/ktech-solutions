import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { decryptSession, SESSION_COOKIE } from './session';

/**
 * Couche d'accès aux données (DAL) : toute page, action ou route d'administration
 * appelle `requireAdmin()` — la vérification ne repose jamais uniquement sur le proxy.
 */
export const getSession = cache(async () => decryptSession((await cookies()).get(SESSION_COOKIE)?.value));

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}
