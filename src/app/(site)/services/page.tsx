import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand, PageHero } from '@/components/sections/Blocks';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getServices, getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Nos services',
  description: 'Formation numérique, développement web et mobile, identité visuelle, impression et accompagnement événementiel.',
  alternates: { canonical: '/services/' },
};

export default async function ServicesPage() {
  const [{ services: page, company }, services] = await Promise.all([getSettings(), getServices()]);
  return (
    <>
      <PageHero crumbs={[{ label: 'Services' }]} eyebrow="Nos services" title={page.title} lead={page.lead} />
      <section className="section" aria-label="Liste des services">
        <div className="container">
          <ul className="svc-index">
            {services.map((s, i) => (
              <li key={s.id} className="reveal">
                <Link className="svc-item" href={`/services/${s.slug}/`}>
                  <span className="svc-item-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="icon">
                    <Icon name={s.icon as IconName} />
                  </span>
                  <span className="svc-item-body">
                    <span className="svc-item-title">{s.title}</span>
                    <span className="svc-item-text">{s.summary}</span>
                    <span className="svc-tags">
                      {s.tags.slice(0, 4).map((t) => (
                        <em key={t}>{t}</em>
                      ))}
                    </span>
                  </span>
                  <span className="row-arrow" aria-hidden="true">
                    <Icon name="arrow" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title="Vous ne savez pas par où commencer ?" sub="Décrivez votre besoin, nous vous orientons." whatsapp={company.whatsapp} />
    </>
  );
}
