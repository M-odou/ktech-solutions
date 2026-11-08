import 'server-only';
import { and, count, desc, eq, like, or, sql } from 'drizzle-orm';
import { db, schema } from '@/server/db/client';
import type { RequestKind, RequestStatus } from '@/server/db/schema';

const PREFIX: Record<RequestKind, string> = { devis: 'DEV', formation: 'FOR', message: 'MSG' };

/** Référence lisible et unique : DEV-2026-0007. */
async function nextReference(kind: RequestKind) {
  const year = new Date().getFullYear();
  const prefix = `${PREFIX[kind]}-${year}-`;
  const [row] = await db
    .select({ n: count() })
    .from(schema.requests)
    .where(like(schema.requests.reference, `${prefix}%`));
  return `${prefix}${String(row.n + 1).padStart(4, '0')}`;
}

export async function createRequest(input: {
  kind: RequestKind;
  subject: string;
  details: Record<string, string | string[]>;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  contactPreference?: string;
}) {
  // Quelques tentatives en cas de collision de référence (envois simultanés).
  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = await nextReference(input.kind);
    try {
      const [row] = await db
        .insert(schema.requests)
        .values({ ...input, email: input.email ?? '', company: input.company ?? '', contactPreference: input.contactPreference ?? '', reference })
        .returning();
      return row;
    } catch (e) {
      if (attempt === 2) throw e;
    }
  }
  throw new Error('Impossible de créer la demande');
}

export async function addRequestFile(requestId: number, file: { originalName: string; storedPath: string; mime: string; size: number }) {
  await db.insert(schema.requestFiles).values({ requestId, ...file });
}

export async function listRequests(filters: { status?: RequestStatus | 'actives'; kind?: RequestKind; q?: string } = {}) {
  const q = filters.q?.trim();
  return db.query.requests.findMany({
    where: and(
      filters.status === 'actives'
        ? sql`${schema.requests.status} not in ('gagne','perdu','archive')`
        : filters.status
          ? eq(schema.requests.status, filters.status)
          : undefined,
      filters.kind ? eq(schema.requests.kind, filters.kind) : undefined,
      q
        ? or(
            like(schema.requests.name, `%${q}%`),
            like(schema.requests.reference, `%${q}%`),
            like(schema.requests.company, `%${q}%`),
            like(schema.requests.subject, `%${q}%`),
            like(schema.requests.phone, `%${q}%`),
          )
        : undefined,
    ),
    orderBy: [desc(schema.requests.createdAt), desc(schema.requests.id)],
    with: { files: { columns: { id: true } } },
  });
}

export async function getRequest(id: number) {
  return db.query.requests.findFirst({
    where: eq(schema.requests.id, id),
    with: { files: true, notes: { orderBy: [desc(schema.requestNotes.createdAt)] } },
  });
}

export async function requestStats() {
  const rows = await db.select({ status: schema.requests.status, n: count() }).from(schema.requests).groupBy(schema.requests.status);
  const byStatus = Object.fromEntries(rows.map((r) => [r.status, r.n])) as Partial<Record<RequestStatus, number>>;
  const total = rows.reduce((a, r) => a + r.n, 0);
  return { byStatus, total };
}
