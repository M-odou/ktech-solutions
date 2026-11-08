import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { getProjects, getServices } from '@/server/queries/content';

const STATIC = ['/', '/services/', '/realisations/', '/formations/', '/a-propos/', '/contact/', '/devis/', '/mentions-legales/', '/confidentialite/'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([getServices(), getProjects()]);
  const url = (p: string) => new URL(p, SITE_URL).toString();
  return [
    ...STATIC.map((p) => ({ url: url(p), changeFrequency: 'monthly' as const, priority: p === '/' ? 1 : p === '/devis/' ? 0.9 : 0.7 })),
    ...services.map((s) => ({ url: url(`/services/${s.slug}/`), lastModified: s.updatedAt, priority: 0.8 })),
    ...projects.map((p) => ({ url: url(`/realisations/${p.slug}/`), lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
