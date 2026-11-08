import 'server-only';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { env } from '@/server/env';

export const SESSION_COOKIE = 'ktech_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours
const key = new TextEncoder().encode(env.SESSION_SECRET);

export type SessionPayload = { userId: number; name: string };

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key);
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    if (typeof payload.userId !== 'number' || typeof payload.name !== 'string') return null;
    return { userId: payload.userId, name: payload.name };
  } catch {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  (await cookies()).set(SESSION_COOKIE, await encryptSession(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function deleteSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
