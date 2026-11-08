'use server';

import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireAdmin } from '@/server/auth/dal';
import { hashPassword, verifyPassword } from '@/server/auth/password';
import { createSession, deleteSession } from '@/server/auth/session';
import { db, schema } from '@/server/db/client';
import type { ActionState } from './types';

// Limitation simple des tentatives (par e-mail, en mémoire du processus).
const attempts = new Map<string, { n: number; until: number }>();

export async function login(_prev: ActionState, form: FormData): Promise<ActionState> {
  const parsed = z
    .object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1), next: z.string().optional() })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: 'Indiquez votre e-mail et votre mot de passe.' };

  const { email, password, next } = parsed.data;
  const a = attempts.get(email);
  if (a && a.n >= 5 && a.until > Date.now()) return { ok: false, message: 'Trop de tentatives. Réessayez dans quelques minutes.' };

  const user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    const n = (a && a.until > Date.now() ? a.n : 0) + 1;
    attempts.set(email, { n, until: Date.now() + 10 * 60 * 1000 });
    return { ok: false, message: 'E-mail ou mot de passe incorrect.' };
  }

  attempts.delete(email);
  await createSession({ userId: user.id, name: user.name });
  redirect(next && next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin');
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}

export async function changePassword(_prev: ActionState, form: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = z
    .object({ current: z.string().min(1), next: z.string().min(10, 'Le nouveau mot de passe doit faire au moins 10 caractères.'), confirm: z.string() })
    .refine((v) => v.next === v.confirm, { message: 'Les deux mots de passe ne correspondent pas.', path: ['confirm'] })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };

  const user = await db.query.users.findFirst({ where: eq(schema.users.id, session.userId) });
  if (!user || !(await verifyPassword(parsed.data.current, user.passwordHash))) return { ok: false, message: 'Mot de passe actuel incorrect.' };
  await db.update(schema.users).set({ passwordHash: await hashPassword(parsed.data.next) }).where(eq(schema.users.id, user.id));
  return { ok: true, message: 'Mot de passe mis à jour.' };
}
