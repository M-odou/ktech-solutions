'use server';

import { asc, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { SECTIONS, type SectionKey } from '@/content/settings';
import { slugify, toLines } from '@/lib/format';
import { requireAdmin } from '@/server/auth/dal';
import { db, schema } from '@/server/db/client';
import { deleteStored, saveFile } from '@/server/storage';
import type { ActionState } from './types';

/** Après toute modification de contenu : le site public est régénéré. */
const refreshSite = () => revalidatePath('/', 'layout');
const now = sql`(datetime('now'))`;

const str = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
const bool = (form: FormData, key: string) => form.get(key) === 'on';
const pairs = (text: string) =>
  toLines(text).map((l) => {
    const [title, ...rest] = l.split('|');
    return { title: title.trim(), text: rest.join('|').trim() };
  });

/* ---------------------------------------------------------- Textes des pages */

export async function saveSection(section: SectionKey, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const def = SECTIONS[section];
  if (!def) return { ok: false, message: 'Section inconnue.' };
  const value: Record<string, unknown> = {};
  for (const f of def.fields) {
    const raw = String(form.get(f.key) ?? '');
    value[f.key] = f.type === 'lines' ? toLines(raw) : f.type === 'pairs' ? pairs(raw) : raw.trim();
  }
  await db
    .insert(schema.settings)
    .values({ key: section, value })
    .onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: now } });
  refreshSite();
  return { ok: true, message: 'Modifications enregistrées et publiées.' };
}

/* ---------------------------------------------------------- Services */

const serviceSchema = z.object({
  title: z.string().min(3, 'Le titre est obligatoire.'),
  shortTitle: z.string().min(2, 'Le titre court est obligatoire.'),
  summary: z.string().min(10, 'Le résumé est obligatoire.'),
  icon: z.string().min(1),
});

export async function saveService(id: number | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse({ title: str(form, 'title'), shortTitle: str(form, 'shortTitle'), summary: str(form, 'summary'), icon: str(form, 'icon') });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const values = {
    ...parsed.data,
    slug: slugify(str(form, 'slug') || parsed.data.title),
    tags: toLines(str(form, 'tags')),
    needs: toLines(str(form, 'needs')),
    offers: toLines(str(form, 'offers')),
    benefits: pairs(str(form, 'benefits')),
    steps: toLines(str(form, 'steps')),
    position: Number(form.get('position') ?? 0) || 0,
    published: bool(form, 'published'),
  };
  try {
    if (id) await db.update(schema.services).set({ ...values, updatedAt: now }).where(eq(schema.services.id, id));
    else await db.insert(schema.services).values(values);
  } catch {
    return { ok: false, message: 'Cette adresse (slug) est déjà utilisée par un autre service.' };
  }
  refreshSite();
  if (!id) redirect('/admin/services');
  return { ok: true, message: 'Service enregistré et publié.' };
}

export async function deleteService(id: number) {
  await requireAdmin();
  await db.delete(schema.services).where(eq(schema.services.id, id));
  refreshSite();
  redirect('/admin/services');
}

/* ---------------------------------------------------------- Réalisations */

const projectSchema = z.object({
  title: z.string().min(3, 'Le titre est obligatoire.'),
  date: z.string().regex(/^\d{4}-\d{2}$/, 'La date doit être au format AAAA-MM.'),
  summary: z.string().min(10, 'Le résumé est obligatoire.'),
  context: z.string().min(1, 'Le contexte est obligatoire.'),
  needs: z.string().min(1, 'Les besoins sont obligatoires.'),
  expectations: z.string().min(1, 'Les attendus sont obligatoires.'),
  solution: z.string().min(1, 'La solution est obligatoire.'),
  deliverables: z.string().min(1, 'Les livrables sont obligatoires.'),
});

export async function saveProject(id: number | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(Object.fromEntries(Object.keys(projectSchema.shape).map((k) => [k, str(form, k)])));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const values = {
    ...parsed.data,
    slug: slugify(str(form, 'slug') || parsed.data.title),
    client: str(form, 'client'),
    sector: str(form, 'sector'),
    location: str(form, 'location'),
    duration: str(form, 'duration'),
    results: str(form, 'results'),
    categories: form.getAll('categories').map(String),
    references: toLines(str(form, 'references')).map((l) => {
      const [label, ...url] = l.split('|');
      return { label: label.trim(), url: url.join('|').trim() };
    }),
    featured: bool(form, 'featured'),
    published: bool(form, 'published'),
    position: Number(form.get('position') ?? 0) || 0,
  };
  let projectId = id;
  try {
    if (id) await db.update(schema.projects).set({ ...values, updatedAt: now }).where(eq(schema.projects.id, id));
    else [{ id: projectId }] = await db.insert(schema.projects).values(values).returning({ id: schema.projects.id });
  } catch {
    return { ok: false, message: 'Cette adresse (slug) est déjà utilisée par une autre réalisation.' };
  }
  refreshSite();
  if (!id) redirect(`/admin/realisations/${projectId}?cree=1`);
  return { ok: true, message: 'Réalisation enregistrée et publiée.' };
}

export async function deleteProject(id: number) {
  await requireAdmin();
  const images = await db.query.projectImages.findMany({ where: eq(schema.projectImages.projectId, id) });
  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  await Promise.all(images.map((i) => deleteStored('media', i.path)));
  refreshSite();
  redirect('/admin/realisations');
}

export async function uploadProjectImages(projectId: number, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return { ok: false, message: 'Choisissez au moins une image.' };
  const existing = await db.query.projectImages.findMany({ where: eq(schema.projectImages.projectId, projectId), orderBy: [asc(schema.projectImages.position)] });
  let position = existing.length;
  const errors: string[] = [];
  for (const file of files) {
    if (file.type === 'image/svg+xml') {
      errors.push(`${file.name} : SVG non accepté (risque de sécurité).`);
      continue;
    }
    try {
      const path = await saveFile('media', `projects/${projectId}`, file, 'image');
      await db.insert(schema.projectImages).values({ projectId, path, alt: str(form, 'alt'), position: position++ });
    } catch (e) {
      errors.push(e instanceof Error ? e.message : file.name);
    }
  }
  refreshSite();
  return errors.length ? { ok: false, message: errors.join(' ') } : { ok: true, message: `${files.length} image(s) ajoutée(s).` };
}

export async function updateProjectImage(imageId: number, form: FormData) {
  await requireAdmin();
  await db
    .update(schema.projectImages)
    .set({ alt: str(form, 'alt'), position: Number(form.get('position') ?? 0) || 0 })
    .where(eq(schema.projectImages.id, imageId));
  refreshSite();
}

export async function deleteProjectImage(imageId: number) {
  await requireAdmin();
  const [img] = await db.delete(schema.projectImages).where(eq(schema.projectImages.id, imageId)).returning();
  if (img) await deleteStored('media', img.path);
  refreshSite();
}

/* ---------------------------------------------------------- Formations & FAQ */

export async function saveCourse(id: number | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const values = {
    title: str(form, 'title'),
    description: str(form, 'description'),
    level: str(form, 'level'),
    mode: str(form, 'mode'),
    position: Number(form.get('position') ?? 0) || 0,
    published: bool(form, 'published'),
  };
  if (!values.title || !values.description) return { ok: false, message: 'Titre et description sont obligatoires.' };
  if (id) await db.update(schema.courses).set(values).where(eq(schema.courses.id, id));
  else await db.insert(schema.courses).values(values);
  refreshSite();
  return { ok: true, message: id ? 'Formation mise à jour.' : 'Formation ajoutée.' };
}

export async function deleteCourse(id: number) {
  await requireAdmin();
  await db.delete(schema.courses).where(eq(schema.courses.id, id));
  refreshSite();
}

export async function saveFaq(id: number | null, _prev: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const values = {
    question: str(form, 'question'),
    answer: str(form, 'answer'),
    position: Number(form.get('position') ?? 0) || 0,
    published: bool(form, 'published'),
  };
  if (!values.question || !values.answer) return { ok: false, message: 'Question et réponse sont obligatoires.' };
  if (id) await db.update(schema.faqs).set(values).where(eq(schema.faqs.id, id));
  else await db.insert(schema.faqs).values(values);
  refreshSite();
  return { ok: true, message: id ? 'Question mise à jour.' : 'Question ajoutée.' };
}

export async function deleteFaq(id: number) {
  await requireAdmin();
  await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
  refreshSite();
}
