import { jwtVerify } from 'jose';
import { NextResponse, type NextRequest } from 'next/server';
import { STATIC_SITE } from '@/server/mode';

/**
 * Vérification optimiste : redirige vers la connexion si aucune session valide.
 * La vérification qui fait foi reste `requireAdmin()` côté serveur.
 */
const key = new TextEncoder().encode(process.env.SESSION_SECRET ?? 'dev-only-secret-change-me-dev-only-secret');

/** Page affichée à la place du back-office en mode vitrine (pas de base de données en ligne). */
const OFFLINE_HTML = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Back-office indisponible</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,sans-serif;background:#090C10;color:#E8EDF2;padding:24px}main{max-width:440px;text-align:center}h1{font-size:1.4rem;font-weight:600}p{color:#9AA7B4;line-height:1.6}a{color:#6FD39B}</style></head><body><main><h1>Back-office indisponible en ligne</h1><p>Cette version du site fonctionne sans base de données. Le back-office s’utilise sur l’ordinateur de l’équipe, puis le contenu est republié.</p><p><a href="/">Retour au site</a></p></main></body></html>`;

export async function proxy(request: NextRequest) {
  if (STATIC_SITE) {
    return new NextResponse(OFFLINE_HTML, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
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
