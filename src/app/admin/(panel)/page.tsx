import Link from 'next/link';
import { KIND_LABEL, STATUS_LABEL } from '@/features/admin/labels';
import { formatDateTime } from '@/lib/format';
import { getCourses, getFaqs, getProjects, getServices } from '@/server/queries/content';
import { listRequests, requestStats } from '@/server/queries/requests';

export default async function Dashboard() {
  const [stats, recent, projects, services, courses, faqs] = await Promise.all([
    requestStats(),
    listRequests({ status: 'actives' }),
    getProjects({ includeDrafts: true }),
    getServices({ includeDrafts: true }),
    getCourses({ includeDrafts: true }),
    getFaqs({ includeDrafts: true }),
  ]);
  const s = stats.byStatus;
  const cards = [
    { label: 'Nouvelles demandes', value: s.nouveau ?? 0, href: '/admin/demandes?statut=nouveau', accent: true },
    { label: 'En cours', value: (s.en_cours ?? 0) + (s.devis_envoye ?? 0), href: '/admin/demandes?statut=actives' },
    { label: 'Gagnées', value: s.gagne ?? 0, href: '/admin/demandes?statut=gagne' },
    { label: 'Total des demandes', value: stats.total, href: '/admin/demandes?statut=toutes' },
  ];

  return (
    <>
      <header className="admin-head">
        <h1>Tableau de bord</h1>
        <p className="muted">Vue d’ensemble des demandes et du contenu du site.</p>
      </header>

      <ul className="stat-grid">
        {cards.map((c) => (
          <li key={c.label}>
            <Link className={`stat${c.accent ? ' accent' : ''}`} href={c.href}>
              <b>{c.value}</b>
              <span>{c.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="admin-card" aria-labelledby="todo-title">
        <div className="admin-card-head">
          <h2 id="todo-title">Demandes à traiter</h2>
          <Link className="link" href="/admin/demandes">
            Toutes les demandes
          </Link>
        </div>
        {recent.length ? (
          <ul className="req-list">
            {recent.slice(0, 8).map((r) => (
              <li key={r.id}>
                <Link href={`/admin/demandes/${r.id}`}>
                  <span className={`status s-${r.status}`}>{STATUS_LABEL[r.status]}</span>
                  <span className="req-main">
                    <b>{r.name}</b> — {r.subject}
                    <small>
                      {r.reference} · {KIND_LABEL[r.kind]} · {formatDateTime(r.createdAt)}
                    </small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Aucune demande en attente. Les nouvelles demandes du site apparaîtront ici.</p>
        )}
      </section>

      <section className="admin-card" aria-labelledby="content-title">
        <h2 id="content-title">Contenu du site</h2>
        <ul className="content-grid">
          {[
            ['Réalisations', projects.length, '/admin/realisations'],
            ['Services', services.length, '/admin/services'],
            ['Formations', courses.length, '/admin/formations'],
            ['Questions fréquentes', faqs.length, '/admin/faq'],
          ].map(([l, n, h]) => (
            <li key={String(h)}>
              <Link href={String(h)}>
                <b>{n}</b> {l}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/admin/contenus">Textes des pages et coordonnées</Link>
          </li>
        </ul>
      </section>
    </>
  );
}
