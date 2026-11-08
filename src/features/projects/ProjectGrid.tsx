'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { PROJECT_CATEGORIES } from '@/config/site';
import { categoryLabel, formatMonth } from '@/lib/format';

export type ProjectCard = { slug: string; title: string; summary: string; date: string; categories: string[]; cover: string | null };

/** Grille filtrable des réalisations ; chaque carte mène à la page du projet. */
export function ProjectGrid({ projects }: { projects: ProjectCard[] }) {
  const [filter, setFilter] = useState<string>('all');
  const visible = filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter));
  const available = PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.categories.includes(c.key)));

  return (
    <>
      <div className="filters" role="group" aria-label="Filtrer les réalisations par catégorie">
        <button type="button" className="filter" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
          Tout
        </button>
        {available.map((c) => (
          <button key={c.key} type="button" className="filter" aria-pressed={filter === c.key} onClick={() => setFilter(c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} réalisation{visible.length > 1 ? 's' : ''} affichée{visible.length > 1 ? 's' : ''}
      </p>

      {visible.length ? (
        <ul className="work-grid three">
          {visible.map((p) => (
            <li key={p.slug}>
              <Link className="work" href={`/realisations/${p.slug}/`}>
                <span className="work-media">
                  {p.cover && (
                    // eslint-disable-next-line @next/next/no-img-element -- fichiers servis par /media
                    <img src={p.cover} alt="" loading="lazy" decoding="async" />
                  )}
                  <span className="tag">{categoryLabel(p.categories[0] ?? '')}</span>
                </span>
                <span className="meta">
                  <span>
                    <span className="work-date">{formatMonth(p.date)}</span>
                    <span className="work-title">{p.title}</span>
                    <span className="work-need">{p.summary}</span>
                  </span>
                  <span className="arrow" aria-hidden="true">
                    <Icon name="arrow" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">Aucune réalisation dans cette catégorie pour le moment.</p>
      )}
    </>
  );
}
