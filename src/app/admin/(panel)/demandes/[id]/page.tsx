import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ConfirmButton, SubmitButton } from '@/features/admin/ActionForm';
import { KIND_LABEL, STATUS_LABEL } from '@/features/admin/labels';
import { formatBytes, formatDateTime, telHref, whatsappUrl } from '@/lib/format';
import { addRequestNote, deleteRequest, updateRequestStatus } from '@/server/actions/requests';
import { REQUEST_STATUSES } from '@/server/db/schema';
import { getRequest } from '@/server/queries/requests';

export const metadata: Metadata = { title: 'Demande' };

export default async function RequestPage({ params }: PageProps<'/admin/demandes/[id]'>) {
  const id = Number((await params).id);
  const r = Number.isInteger(id) ? await getRequest(id) : undefined;
  if (!r) notFound();

  const wa = whatsappUrl(r.phone, `Bonjour ${r.name.split(' ')[0]}, ici KTech Solutions au sujet de votre demande ${r.reference}.`);

  return (
    <>
      <nav className="admin-crumbs" aria-label="Fil d’Ariane">
        <Link href="/admin/demandes">Demandes</Link> / {r.reference}
      </nav>
      <header className="admin-head split-head">
        <div>
          <h1>
            {r.name} <span className={`status s-${r.status}`}>{STATUS_LABEL[r.status]}</span>
          </h1>
          <p className="muted">
            {r.reference} · {KIND_LABEL[r.kind]} · reçue le {formatDateTime(r.createdAt)}
          </p>
        </div>
        <div className="btns">
          {wa && (
            <a className="btn btn-sm" href={wa} target="_blank" rel="noopener noreferrer">
              Répondre sur WhatsApp
            </a>
          )}
          <a className="btn btn-ghost btn-sm" href={telHref(r.phone)}>
            Appeler
          </a>
          {r.email && (
            <a className="btn btn-ghost btn-sm" href={`mailto:${r.email}?subject=${encodeURIComponent(`Votre demande ${r.reference}`)}`}>
              Écrire un e-mail
            </a>
          )}
        </div>
      </header>

      <div className="admin-cols">
        <div className="admin-stack">
          <section className="admin-card" aria-labelledby="details-title">
            <h2 id="details-title">{r.subject}</h2>
            <dl className="admin-dl">
              {Object.entries(r.details).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd className="pre">{Array.isArray(v) ? v.join(', ') || '—' : v || '—'}</dd>
                </div>
              ))}
            </dl>
          </section>

          {r.files.length > 0 && (
            <section className="admin-card" aria-labelledby="files-title">
              <h2 id="files-title">Pièces jointes</h2>
              <ul className="file-list">
                {r.files.map((f) => (
                  <li key={f.id}>
                    <a href={`/admin/fichiers/${f.id}`} download>
                      {f.originalName}
                    </a>
                    <span className="file-size">{formatBytes(f.size)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="admin-card" aria-labelledby="notes-title">
            <h2 id="notes-title">Suivi interne</h2>
            <form action={addRequestNote.bind(null, r.id)} className="form">
              <div className="field">
                <label htmlFor="body">Ajouter une note</label>
                <textarea className="input" id="body" name="body" rows={3} required placeholder="Appel effectué, devis envoyé, prochaine relance…" />
              </div>
              <SubmitButton label="Ajouter la note" />
            </form>
            {r.notes.length > 0 && (
              <ol className="notes">
                {r.notes.map((n) => (
                  <li key={n.id}>
                    <p className="pre">{n.body}</p>
                    <small>
                      {n.author} · {formatDateTime(n.createdAt)}
                    </small>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="admin-stack" aria-label="Contact et statut">
          <section className="admin-card" aria-labelledby="status-title">
            <h2 id="status-title">Statut</h2>
            <form action={updateRequestStatus.bind(null, r.id)} className="form">
              <div className="field">
                <label htmlFor="status">Étape de suivi</label>
                <select className="input" id="status" name="status" defaultValue={r.status}>
                  {REQUEST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
              </div>
              <SubmitButton label="Mettre à jour" />
            </form>
          </section>
          <section className="admin-card" aria-labelledby="contact-title">
            <h2 id="contact-title">Contact</h2>
            <dl className="admin-dl">
              <div>
                <dt>Téléphone</dt>
                <dd>
                  <a href={telHref(r.phone)}>{r.phone}</a>
                </dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>{r.email ? <a href={`mailto:${r.email}`}>{r.email}</a> : '—'}</dd>
              </div>
              <div>
                <dt>Entreprise</dt>
                <dd>{r.company || '—'}</dd>
              </div>
              <div>
                <dt>Contact préféré</dt>
                <dd>{r.contactPreference || '—'}</dd>
              </div>
              <div>
                <dt>Dernière mise à jour</dt>
                <dd>{formatDateTime(r.updatedAt)}</dd>
              </div>
            </dl>
          </section>
          <section className="admin-card danger-zone" aria-labelledby="danger-title">
            <h2 id="danger-title">Supprimer</h2>
            <p className="muted">Supprime définitivement la demande, ses notes et ses pièces jointes.</p>
            <ConfirmButton action={deleteRequest.bind(null, r.id)} label="Supprimer la demande" confirm={`Supprimer définitivement la demande ${r.reference} de ${r.name} ?`} />
          </section>
        </aside>
      </div>
    </>
  );
}
