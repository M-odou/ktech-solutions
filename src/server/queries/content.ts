import 'server-only';
import { and, asc, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { DEFAULT_SETTINGS, type SectionKey, type Settings } from '@/content/settings';
import { db, schema } from '@/server/db/client';

/** Contenus éditoriaux, fusionnés avec les valeurs par défaut (aucun champ jamais vide par accident). */
export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await db.select().from(schema.settings);
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Partial<Record<SectionKey, object>>;
  const merged = {} as Record<SectionKey, unknown>;
  for (const key of Object.keys(DEFAULT_SETTINGS) as SectionKey[]) {
    merged[key] = { ...DEFAULT_SETTINGS[key], ...(stored[key] ?? {}) };
  }
  return merged as Settings;
});

export const getServices = cache(async (opts: { includeDrafts?: boolean } = {}) =>
  db.query.services.findMany({
    where: opts.includeDrafts ? undefined : eq(schema.services.published, true),
    orderBy: [asc(schema.services.position), asc(schema.services.id)],
  }),
);

export const getServiceBySlug = cache(async (slug: string) =>
  db.query.services.findFirst({ where: and(eq(schema.services.slug, slug), eq(schema.services.published, true)) }),
);

const projectOrder = [desc(schema.projects.date), asc(schema.projects.position)];

export const getProjects = cache(async (opts: { includeDrafts?: boolean; featured?: boolean } = {}) =>
  db.query.projects.findMany({
    where: and(
      opts.includeDrafts ? undefined : eq(schema.projects.published, true),
      opts.featured ? eq(schema.projects.featured, true) : undefined,
    ),
    orderBy: projectOrder,
    with: { images: { orderBy: [asc(schema.projectImages.position)] } },
  }),
);

export const getProjectBySlug = cache(async (slug: string) =>
  db.query.projects.findFirst({
    where: and(eq(schema.projects.slug, slug), eq(schema.projects.published, true)),
    with: { images: { orderBy: [asc(schema.projectImages.position)] } },
  }),
);

export const getCourses = cache(async (opts: { includeDrafts?: boolean } = {}) =>
  db.query.courses.findMany({
    where: opts.includeDrafts ? undefined : eq(schema.courses.published, true),
    orderBy: [asc(schema.courses.position), asc(schema.courses.id)],
  }),
);

export const getFaqs = cache(async (opts: { includeDrafts?: boolean } = {}) =>
  db.query.faqs.findMany({
    where: opts.includeDrafts ? undefined : eq(schema.faqs.published, true),
    orderBy: [asc(schema.faqs.position), asc(schema.faqs.id)],
  }),
);

export type ProjectWithImages = Awaited<ReturnType<typeof getProjects>>[number];
