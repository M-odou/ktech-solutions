import { eq } from 'drizzle-orm';
import { getSession } from '@/server/auth/dal';
import { db, schema } from '@/server/db/client';
import { readStored } from '@/server/storage';

/** Téléchargement d'une pièce jointe de demande — réservé à l'administration. */
export async function GET(_req: Request, ctx: RouteContext<'/admin/fichiers/[id]'>) {
  if (!(await getSession())) return new Response('Non autorisé', { status: 401 });
  const { id } = await ctx.params;
  const file = await db.query.requestFiles.findFirst({ where: eq(schema.requestFiles.id, Number(id)) });
  if (!file) return new Response('Introuvable', { status: 404 });
  try {
    const data = await readStored('private', file.storedPath);
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response('Fichier manquant', { status: 404 });
  }
}
