import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Vérification optimiste : redirige vers la connexion si aucune session valide.
 * La vérification qui fait foi reste `requireAdmin()` côté serveur.
 */
const key = new TextEncoder().encode(process.env.SESSION_SECRET ?? 'dev-only-secret-change-me-dev-only-secret');

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/+$/, '') || '/';
  if (pathname === '/admin/login') return NextResponse.next();
  const token = request.cookies.get('ktech_session')?.value;
  if (token) {
    try {
      await jwtVerify(token, key, { algorithms: ['HS256'] });
      return NextResponse.next();
    } catch {
      /* session invalide : redirection */
    }
  }
  const url = new URL('/admin/login/', request.url);
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*'] };
