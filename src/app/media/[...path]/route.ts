import { contentTypeFor, readStored } from '@/server/storage';

/** Fichiers publics (images des réalisations) depuis le stockage `media/`. */
export async function GET(_req: Request, ctx: RouteContext<'/media/[...path]'>) {
  const { path } = await ctx.params;
  const relative = path.join('/');
  try {
    const data = await readStored('media', relative);
    const type = contentTypeFor(relative);
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        // Les SVG (illustrations) ne doivent jamais exécuter de script.
        ...(type === 'image/svg+xml' ? { 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox" } : {}),
      },
    });
  } catch {
    return new Response('Introuvable', { status: 404 });
  }
}
