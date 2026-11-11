import 'server-only';
import { and, asc, desc, eq } from 'drizzle-orm';
import { cache } from 'react';
import { DEFAULT_SETTINGS, type SectionKey, type Settings } from '@/content/settings';
import snapshotJson from '@/content/snapshot.json';
import { db, schema } from '@/server/db/client';
import { STATIC_SITE } from '@/server/mode';

type Service = typeof schema.services.$inferSelect;
type Project = typeof schema.projects.$inferSelect;
type ProjectImage = typeof schema.projectImages.$inferSelect;
type Course = typeof schema.courses.$inferSelect;
type Faq = typeof schema.faqs.$inferSelect;
type ProjectWithImagesRow = Project & { images: ProjectImage[] };

/** Contenu figé utilisé en mode vitrine (généré par `npm run snapshot`). */
const snapshot = snapshotJson as unknown as {
  settings: Partial<Record<SectionKey, object>>;
  services: Service[];
  projects: ProjectWithImagesRow[];
  courses: Course[];
  faqs: Faq[];
};

/** Tri par position puis identifiant, comme en base. */
const byPosition = <T extends { position: number; id: number }>(a: T, b: T) => a.position - b.position || a.id - b.id;
const withSortedImages = (p: ProjectWithImagesRow): ProjectWithImagesRow => ({
  ...p,
  images: [...p.images].sort((a, b) => a.position - b.position),
});
/** Réalisations : les plus récentes d'abord, puis position. */
const byProjectOrder = (a: Project, b: Project) => b.date.localeCompare(a.date) || a.position - b.position;

/** Contenus éditoriaux, fusionnés avec les valeurs par défaut (aucun champ jamais vide par accident). */
export const getSettings = cache(async (): Promise<Settings> => {
  const stored: Partial<Record<SectionKey, object>> = STATIC_SITE
    ? snapshot.settings
    : Object.fromEntries((await db.select().from(schema.settings)).map((r) => [r.key, r.value]));
  const merged = {} as Record<SectionKey, unknown>;
  for (const key of Object.keys(DEFAULT_SETTINGS) as SectionKey[]) {
    merged[key] = { ...DEFAULT_SETTINGS[key], ...(stored[key] ?? {}) };
  }
  return merged as Settings;
});

export const getServices = cache(async (opts: { includeDrafts?: boolean } = {}): Promise<Service[]> => {
  if (STATIC_SITE) return snapshot.services.filter((s) => opts.includeDrafts || s.published).sort(byPosition);
  return db.query.services.findMany({
    where: opts.includeDrafts ? undefined : eq(schema.services.published, true),
    orderBy: [asc(schema.services.position), asc(schema.services.id)],
  });
});

export const getServiceBySlug = cache(async (slug: string): Promise<Service | undefined> => {
  if (STATIC_SITE) return snapshot.services.find((s) => s.slug === slug && s.published);
  return db.query.services.findFirst({ where: and(eq(schema.services.slug, slug), eq(schema.services.published, true)) });
});

const projectOrder = [desc(schema.projects.date), asc(schema.projects.position)];

export const getProjects = cache(
  async (opts: { includeDrafts?: boolean; featured?: boolean } = {}): Promise<ProjectWithImagesRow[]> => {
    if (STATIC_SITE) {
      return snapshot.projects
        .filter((p) => (opts.includeDrafts || p.published) && (!opts.featured || p.featured))
        .sort(byProjectOrder)
        .map(withSortedImages);
    }
    return db.query.projects.findMany({
      where: and(
        opts.includeDrafts ? undefined : eq(schema.projects.published, true),
        opts.featured ? eq(schema.projects.featured, true) : undefined,
      ),
      orderBy: projectOrder,
      with: { images: { orderBy: [asc(schema.projectImages.position)] } },
    });
  },
);

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectWithImagesRow | undefined> => {
  if (STATIC_SITE) {
    const p = snapshot.projects.find((x) => x.slug === slug && x.published);
    return p && withSortedImages(p);
  }
  return db.query.projects.findFirst({
    where: and(eq(schema.projects.slug, slug), eq(schema.projects.published, true)),
    with: { images: { orderBy: [asc(schema.projectImages.position)] } },
  });
});

export const getCourses = cache(async (opts: { includeDrafts?: boolean } = {}): Promise<Course[]> => {
  if (STATIC_SITE) return snapshot.courses.filter((c) => opts.includeDrafts || c.published).sort(byPosition);
  return db.query.courses.findMany({
    where: opts.includeDrafts ? undefined : eq(schema.courses.published, true),
    orderBy: [asc(schema.courses.position), asc(schema.courses.id)],
  });
});

export const getFaqs = cache(async (opts: { includeDrafts?: boolean } = {}): Promise<Faq[]> => {
  if (STATIC_SITE) return snapshot.faqs.filter((f) => opts.includeDrafts || f.published).sort(byPosition);
  return db.query.faqs.findMany({
    where: opts.includeDrafts ? undefined : eq(schema.faqs.published, true),
    orderBy: [asc(schema.faqs.position), asc(schema.faqs.id)],
  });
});

export type ProjectWithImages = Awaited<ReturnType<typeof getProjects>>[number];
