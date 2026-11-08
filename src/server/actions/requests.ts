'use server';

import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/server/auth/dal';
import { db, schema } from '@/server/db/client';
import { REQUEST_STATUSES, type RequestStatus } from '@/server/db/schema';
import { deleteStored } from '@/server/storage';

export async function updateRequestStatus(id: number, form: FormData) {
  await requireAdmin();
  const status = String(form.get('status')) as RequestStatus;
  if (!REQUEST_STATUSES.includes(status)) return;
  await db.update(schema.requests).set({ status, updatedAt: sql`(datetime('now'))` }).where(eq(schema.requests.id, id));
  revalidatePath('/admin', 'layout');
}

export async function addRequestNote(id: number, form: FormData) {
  const session = await requireAdmin();
  const body = String(form.get('body') ?? '').trim();
  if (!body) return;
  await db.insert(schema.requestNotes).values({ requestId: id, body: body.slice(0, 4000), author: session.name });
  await db.update(schema.requests).set({ updatedAt: sql`(datetime('now'))` }).where(eq(schema.requests.id, id));
  revalidatePath(`/admin/demandes/${id}`);
}

export async function deleteRequest(id: number) {
  await requireAdmin();
  const files = await db.query.requestFiles.findMany({ where: eq(schema.requestFiles.requestId, id) });
  await db.delete(schema.requests).where(eq(schema.requests.id, id));
  await Promise.all(files.map((f) => deleteStored('private', f.storedPath)));
  revalidatePath('/admin', 'layout');
  redirect('/admin/demandes');
}
