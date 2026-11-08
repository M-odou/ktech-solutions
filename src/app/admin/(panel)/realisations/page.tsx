import type { Metadata } from 'next';
import Link from 'next/link';
import { categoryLabel, formatMonth, mediaUrl } from '@/lib/format';
import { getProjects } from '@/server/queries/content';

export const metadata: Metadata = { title: 'Réalisations' };

export default async function AdminProjects() {
  const projects = await getProjects({ includeDrafts: true });
  return (
    <>
      <header className="admin-head split-head">
        <div>
          <h1>Réalisations</h1>
          <p className="muted">Chaque réalisation a sa page dédiée avec galerie, contexte, besoins, attendus, date et références.</p>
        </div>
        <Link className="btn btn-sm" href="/admin/realisations/nouveau">
          Ajouter une réalisation
        </Link>
      </header>
      <ul className="project-admin-list">
        {projects.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/realisations/${p.id}`} className="admin-card project-admin-item">
              {p.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element -- vignette d'administration
                <img src={mediaUrl(p.images[0].path)} alt="" />
              ) : (
                <span className="thumb-empty" aria-hidden="true" />
              )}
              <span>
                <b>{p.title}</b>
                <small>
                  {formatMonth(p.date)} · {p.categories.map(categoryLabel).join(', ')} · {p.images.length} image(s)
                </small>
              </span>
              <span className="tags">
                {p.featured && <span className="status s-devis_envoye">À la une</span>}
                {p.published ? <span className="status s-gagne">Publié</span> : <span className="status s-archive">Brouillon</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
