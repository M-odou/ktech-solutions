import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICE_ICONS } from '@/config/site';
import { ActionForm, ConfirmButton } from '@/features/admin/ActionForm';
import { FormGrid, linesOf, pairsOf, TextArea, TextInput, Toggle } from '@/features/admin/inputs';
import { deleteService, saveService } from '@/server/actions/content';
import { getServices } from '@/server/queries/content';

export const metadata: Metadata = { title: 'Service' };

/** Création (/admin/services/nouveau) et modification (/admin/services/12). */
export default async function ServiceEditor({ params }: PageProps<'/admin/services/[id]'>) {
  const { id } = await params;
  const isNew = id === 'nouveau';
  const s = isNew ? null : (await getServices({ includeDrafts: true })).find((x) => x.id === Number(id));
  if (!isNew && !s) notFound();

  return (
    <>
      <nav className="admin-crumbs" aria-label="Fil d’Ariane">
        <Link href="/admin/services">Services</Link> / {s?.title ?? 'Nouveau service'}
      </nav>
      <header className="admin-head split-head">
        <h1>{s?.title ?? 'Nouveau service'}</h1>
        {s && (
          <Link className="btn btn-ghost btn-sm" href={`/services/${s.slug}/`} target="_blank">
            Voir la page<span className="sr-only"> (nouvel onglet)</span>
          </Link>
        )}
      </header>

      <section className="admin-card">
        <ActionForm action={saveService.bind(null, s?.id ?? null)} submitLabel={isNew ? 'Créer le service' : 'Enregistrer et publier'}>
          <FormGrid>
            <TextInput name="title" label="Titre" defaultValue={s?.title} required />
            <TextInput name="shortTitle" label="Titre court (menus)" defaultValue={s?.shortTitle} required />
            <TextInput name="slug" label="Adresse de la page" defaultValue={s?.slug} help="Générée depuis le titre si vide. Ex. developpement" />
            <div className="field">
              <label htmlFor="f-icon">Icône</label>
              <select className="input" id="f-icon" name="icon" defaultValue={s?.icon ?? 'dev'}>
                {SERVICE_ICONS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </FormGrid>
          <TextArea name="summary" label="Résumé" defaultValue={s?.summary} rows={2} required />
          <FormGrid>
            <TextArea name="tags" label="Mots-clés (aperçu)" defaultValue={linesOf(s?.tags ?? [])} help="Un par ligne." />
            <TextArea name="needs" label="Besoins auxquels il répond" defaultValue={linesOf(s?.needs ?? [])} help="Un par ligne." />
            <TextArea name="offers" label="Prestations" defaultValue={linesOf(s?.offers ?? [])} help="Une par ligne. Proposées comme choix dans la demande de devis." />
            <TextArea name="steps" label="Étapes de réalisation" defaultValue={linesOf(s?.steps ?? [])} help="Une par ligne." />
          </FormGrid>
          <TextArea name="benefits" label="Bénéfices" defaultValue={pairsOf(s?.benefits ?? [])} help="Un par ligne : Titre | Texte" />
          <FormGrid>
            <TextInput name="position" label="Ordre d’affichage" type="number" defaultValue={s?.position ?? 0} />
            <Toggle name="published" label="Publié sur le site" defaultChecked={s?.published ?? true} />
          </FormGrid>
        </ActionForm>
      </section>

      {s && (
        <section className="admin-card danger-zone">
          <h2>Supprimer ce service</h2>
          <p className="muted">La page du service disparaîtra du site. Préférez « Brouillon » pour le masquer temporairement.</p>
          <ConfirmButton action={deleteService.bind(null, s.id)} label="Supprimer le service" confirm={`Supprimer définitivement le service « ${s.title} » ?`} />
        </section>
      )}
    </>
  );
}
