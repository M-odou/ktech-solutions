import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand, PageHero } from '@/components/sections/Blocks';
import { Icon } from '@/components/ui/Icon';
import { CTA } from '@/config/site';
import { Gallery } from '@/features/projects/Gallery';
import { categoryLabel, formatMonth, mediaUrl } from '@/lib/format';
import { getProjectBySlug, getProjects, getSettings } from '@/server/queries/content';

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/realisations/[slug]'>): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return {};
  const cover = project.images[0];
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/realisations/${project.slug}/` },
    openGraph: cover && !cover.path.endsWith('.svg') ? { images: [mediaUrl(cover.path)] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<'/realisations/[slug]'>) {
  const { slug } = await params;
  const [project, all, { company }] = await Promise.all([getProjectBySlug(slug), getProjects(), getSettings()]);
  if (!project) notFound();

  const i = all.findIndex((p) => p.slug === project.slug);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;

  const facts = [
    ['Client', project.client],
    ['Secteur', project.sector],
    ['Lieu', project.location],
    ['Date', formatMonth(project.date)],
    ['Durée', project.duration],
    ['Expertises', project.categories.map(categoryLabel).join(', ')],
  ].filter(([, v]) => v);

  const story = [
    ['Contexte', project.context],
    ['Besoins', project.needs],
    ['Attendus', project.expectations],
    ['Solution apportée', project.solution],
    ['Livrables', project.deliverables],
    ['Résultats', project.results],
  ].filter(([, v]) => v);

  return (
    <>
      <PageHero crumbs={[{ href: '/realisations/', label: 'Réalisations' }, { label: project.title }]} eyebrow={project.categories.map(categoryLabel).join(' · ')} title={project.title} lead={project.summary}>
        <p className="hero-date">
          <Icon name="clock" /> <time dateTime={project.date}>{formatMonth(project.date)}</time>
          {project.duration && <> · {project.duration}</>}
        </p>
      </PageHero>

      <section className="section" aria-labelledby="gallery-title">
        <div className="container">
          <h2 className="sr-only" id="gallery-title">
            Galerie
          </h2>
          <Gallery title={project.title} images={project.images.map((img) => ({ src: mediaUrl(img.path), alt: img.alt }))} />
        </div>
      </section>

      <section className="section band" aria-label="Le projet en détail">
        <div className="container detail-grid">
          <div className="detail-main story-list">
            {story.map(([label, text]) => (
              <article key={label} className="story-item reveal">
                <h2>{label}</h2>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className="detail-side">
            <div className="panel">
              <p className="side-title">Fiche projet</p>
              <dl className="facts">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="panel">
              <p className="side-title">Références</p>
              {project.references.length ? (
                <ul className="refs">
                  {project.references.map((r) => (
                    <li key={r.label + r.url}>
                      {r.url ? (
                        <a href={r.url} target="_blank" rel="noopener noreferrer">
                          {r.label} <Icon name="arrow" />
                          <span className="sr-only"> (nouvel onglet)</span>
                        </a>
                      ) : (
                        r.label
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">Références et contacts clients communiqués sur demande.</p>
              )}
            </div>
            <Link className="btn" href={CTA.href}>
              Un projet similaire ? {CTA.primary}
            </Link>
          </div>
        </div>
      </section>

      <nav className="container pager" aria-label="Autres réalisations">
        {prev ? (
          <Link href={`/realisations/${prev.slug}/`} rel="prev">
            <small>Réalisation précédente</small>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/realisations/${next.slug}/`} rel="next" className="next">
            <small>Réalisation suivante</small>
            {next.title}
          </Link>
        )}
      </nav>

      <CtaBand title="Envie d’un résultat similaire ?" sub="Décrivez-nous votre projet." whatsapp={company.whatsapp} />
    </>
  );
}
