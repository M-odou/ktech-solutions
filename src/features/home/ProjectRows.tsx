import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { categoryLabel, formatMonth, mediaUrl } from '@/lib/format';
import type { ProjectWithImages } from '@/server/queries/content';

/** Projets en lignes : chaque ligne mène à la page dédiée du projet. */
export function ProjectRows({ projects }: { projects: ProjectWithImages[] }) {
  return (
    <ul className="rows">
      {projects.map((p) => (
        <li key={p.id}>
          <Link className="row" href={`/realisations/${p.slug}/`}>
            <span className="row-title">
              {p.title}
              <small>{formatMonth(p.date)}</small>
            </span>
            <span className="row-info">
              <span className="row-tags">
                {p.categories.map((c) => (
                  <span key={c}>{categoryLabel(c)}</span>
                ))}
              </span>
              <span className="row-text">{p.summary}</span>
            </span>
            <span className="row-media" aria-hidden="true">
              {p.images.slice(0, 2).map((img) => (
                // eslint-disable-next-line @next/next/no-img-element -- fichiers servis par /media, dimensions libres
                <img key={img.id} className="row-shot" src={mediaUrl(img.path)} alt="" loading="lazy" decoding="async" />
              ))}
            </span>
            <span className="row-arrow" aria-hidden="true">
              <Icon name="arrow" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
