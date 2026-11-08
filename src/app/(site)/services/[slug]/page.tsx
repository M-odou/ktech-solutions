import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Checks, CtaBand, PageHero } from '@/components/sections/Blocks';
import { Icon, type IconName } from '@/components/ui/Icon';
import { CTA } from '@/config/site';
import { categoryLabel } from '@/lib/format';
import { getProjects, getServiceBySlug, getServices, getSettings } from '@/server/queries/content';

/** Lien service → catégories de réalisations, pour proposer des exemples pertinents. */
const RELATED: Record<string, string[]> = {
  formation: ['formation'],
  developpement: ['dev', 'uiux'],
  design: ['graphique', 'uiux'],
  impression: ['graphique', 'evenementiel'],
  evenementiel: ['evenementiel'],
};

export async function generateStaticParams() {
  return (await getServices()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<'/services/[slug]'>): Promise<Metadata> {
  const service = await getServiceBySlug((await params).slug);
  if (!service) return {};
  return { title: service.title, description: service.summary, alternates: { canonical: `/services/${service.slug}/` } };
}

export default async function ServicePage({ params }: PageProps<'/services/[slug]'>) {
  const { slug } = await params;
  const [service, services, projects, { company }] = await Promise.all([getServiceBySlug(slug), getServices(), getProjects(), getSettings()]);
  if (!service) notFound();

  const cats = RELATED[service.slug] ?? [];
  const related = projects.filter((p) => p.categories.some((c) => cats.includes(c))).slice(0, 3);
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero crumbs={[{ href: '/services/', label: 'Services' }, { label: service.shortTitle }]} eyebrow="Service" title={service.title} lead={service.summary}>
        <div className="btns">
          <Link className="btn" href={`${CTA.href}?service=${service.slug}`}>
            {CTA.primary} <Icon name="arrow" />
          </Link>
        </div>
      </PageHero>

      <section className="section" aria-label="Détail du service">
        <div className="container detail-grid">
          <div className="detail-main">
            <div className="cols-2">
              <div className="block reveal">
                <h2 className="block-title">Les besoins auxquels il répond</h2>
                <Checks items={service.needs} />
              </div>
              <div className="block reveal">
                <h2 className="block-title">Nos prestations</h2>
                <Checks items={service.offers} />
              </div>
            </div>
            <div className="block reveal">
              <h2 className="block-title">Vos bénéfices</h2>
              <div className="benefits">
                {service.benefits.map((b) => (
                  <div className="benefit" key={b.title}>
                    <b>{b.title}</b>
                    <p>{b.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="block reveal">
              <h2 className="block-title">Les étapes de réalisation</h2>
              <ol className="inline-steps">
                {service.steps.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="detail-side">
            <div className="panel">
              <span className="icon">
                <Icon name={service.icon as IconName} />
              </span>
              <p className="side-title">Un projet dans ce domaine ?</p>
              <p className="muted">Quelques questions suffisent pour recevoir une proposition adaptée.</p>
              <Link className="btn" href={`${CTA.href}?service=${service.slug}`}>
                {CTA.primary}
              </Link>
            </div>
            <nav className="side-nav" aria-label="Autres services">
              <p className="side-title">Autres services</p>
              <ul>
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}/`}>
                      {s.shortTitle} <Icon name="arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section band" aria-labelledby="related-title">
          <div className="container">
            <p className="eyebrow">Exemples</p>
            <h2 className="h2" id="related-title" style={{ marginBottom: 32 }}>
              Réalisations dans ce domaine
            </h2>
            <ul className="mini-projects">
              {related.map((p) => (
                <li key={p.id}>
                  <Link href={`/realisations/${p.slug}/`}>
                    <span className="mini-tags">{p.categories.map(categoryLabel).join(' · ')}</span>
                    <b>{p.title}</b>
                    <span className="muted">{p.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title="Parlons de votre projet." sub="Une proposition claire, adaptée à votre budget." whatsapp={company.whatsapp} />
    </>
  );
}
