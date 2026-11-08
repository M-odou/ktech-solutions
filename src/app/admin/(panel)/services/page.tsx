import type { Metadata } from 'next';
import Link from 'next/link';
import { getServices } from '@/server/queries/content';

export const metadata: Metadata = { title: 'Services' };

export default async function AdminServices() {
  const services = await getServices({ includeDrafts: true });
  return (
    <>
      <header className="admin-head split-head">
        <div>
          <h1>Services</h1>
          <p className="muted">Chaque service a sa page dédiée sur le site et apparaît dans la demande de devis.</p>
        </div>
        <Link className="btn btn-sm" href="/admin/services/nouveau">
          Ajouter un service
        </Link>
      </header>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Ordre</th>
              <th scope="col">Service</th>
              <th scope="col">Adresse</th>
              <th scope="col">État</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.position}</td>
                <td>
                  <Link href={`/admin/services/${s.id}`}>{s.title}</Link>
                  <small>{s.shortTitle}</small>
                </td>
                <td>/services/{s.slug}/</td>
                <td>{s.published ? <span className="status s-gagne">Publié</span> : <span className="status s-archive">Brouillon</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
