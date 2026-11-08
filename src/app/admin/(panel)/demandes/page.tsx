import type { Metadata } from 'next';
import Link from 'next/link';
import { KIND_LABEL, STATUS_LABEL } from '@/features/admin/labels';
import { formatDateTime } from '@/lib/format';
import { REQUEST_KINDS, REQUEST_STATUSES, type RequestKind, type RequestStatus } from '@/server/db/schema';
import { listRequests } from '@/server/queries/requests';

export const metadata: Metadata = { title: 'Demandes' };

export default async function RequestsPage({ searchParams }: PageProps<'/admin/demandes'>) {
  const sp = await searchParams;
  const statut = typeof sp.statut === 'string' ? sp.statut : 'actives';
  const type = typeof sp.type === 'string' ? sp.type : '';
  const q = typeof sp.q === 'string' ? sp.q : '';
  const status = statut === 'toutes' ? undefined : statut === 'actives' ? 'actives' : (REQUEST_STATUSES as readonly string[]).includes(statut) ? (statut as RequestStatus) : 'actives';
  const kind = (REQUEST_KINDS as readonly string[]).includes(type) ? (type as RequestKind) : undefined;
  const rows = await listRequests({ status, kind, q });

  return (
    <>
      <header className="admin-head">
        <h1>Demandes</h1>
        <p className="muted">Devis, demandes de formation et messages reçus depuis le site.</p>
      </header>

      <form className="admin-filters" role="search" aria-label="Filtrer les demandes">
        <div className="field">
          <label htmlFor="statut">Statut</label>
          <select className="input" id="statut" name="statut" defaultValue={statut}>
            <option value="actives">À traiter (actives)</option>
            <option value="toutes">Toutes</option>
            {REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="type">Type</label>
          <select className="input" id="type" name="type" defaultValue={type}>
            <option value="">Tous</option>
            {REQUEST_KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </div>
        <div className="field grow">
          <label htmlFor="q">Rechercher</label>
          <input className="input" id="q" name="q" type="search" defaultValue={q} placeholder="Nom, référence, entreprise, téléphone…" />
        </div>
        <button className="btn btn-sm" type="submit">
          Filtrer
        </button>
      </form>

      <p className="muted" aria-live="polite">
        {rows.length} demande{rows.length > 1 ? 's' : ''}
      </p>

      {rows.length ? (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Référence</th>
                <th scope="col">Contact</th>
                <th scope="col">Objet</th>
                <th scope="col">Statut</th>
                <th scope="col">Reçue le</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/admin/demandes/${r.id}`}>{r.reference}</Link>
                    <small>{KIND_LABEL[r.kind]}</small>
                  </td>
                  <td>
                    {r.name}
                    <small>{r.company || r.phone}</small>
                  </td>
                  <td>
                    {r.subject}
                    {r.files.length > 0 && <small>{r.files.length} pièce(s) jointe(s)</small>}
                  </td>
                  <td>
                    <span className={`status s-${r.status}`}>{STATUS_LABEL[r.status]}</span>
                  </td>
                  <td>{formatDateTime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <p>Aucune demande ne correspond à ces filtres.</p>
          <Link className="link" href="/admin/demandes?statut=toutes">
            Afficher toutes les demandes
          </Link>
        </div>
      )}
    </>
  );
}
