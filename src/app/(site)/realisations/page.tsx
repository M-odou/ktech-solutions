import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/sections/Blocks';
import { ProjectGrid } from '@/features/projects/ProjectGrid';
import { mediaUrl } from '@/lib/format';
import { getProjects, getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Réalisations',
  description: 'Réalisations de KTech Solutions : sites web, applications, identités visuelles, formations et événements.',
  alternates: { canonical: '/realisations/' },
};

export default async function RealisationsPage() {
  const [{ projects: page, company }, projects] = await Promise.all([getSettings(), getProjects()]);
  const cards = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.date,
    categories: p.categories,
    cover: p.images[0] ? mediaUrl(p.images[0].path) : null,
  }));

  return (
    <>
      <PageHero crumbs={[{ label: 'Réalisations' }]} eyebrow="Réalisations" title={page.title} lead={page.lead} />
      <section className="section" aria-labelledby="portfolio-title">
        <div className="container">
          <h2 className="sr-only" id="portfolio-title">
            Toutes les réalisations
          </h2>
          {page.note && <p className="note">{page.note}</p>}
          <ProjectGrid projects={cards} />
        </div>
      </section>
      <CtaBand title="Votre projet pourrait être le prochain." sub="Parlons-en." whatsapp={company.whatsapp} />
    </>
  );
}
