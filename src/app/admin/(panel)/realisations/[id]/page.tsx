import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PROJECT_CATEGORIES } from '@/config/site';
import { ActionForm, ConfirmButton, SubmitButton } from '@/features/admin/ActionForm';
import { FormGrid, TextArea, TextInput, Toggle } from '@/features/admin/inputs';
import { mediaUrl } from '@/lib/format';
import { deleteProject, deleteProjectImage, saveProject, updateProjectImage, uploadProjectImages } from '@/server/actions/content';
import { getProjects } from '@/server/queries/content';

export const metadata: Metadata = { title: 'Réalisation' };

export default async function ProjectEditor({ params, searchParams }: PageProps<'/admin/realisations/[id]'>) {
  const { id } = await params;
  const created = (await searchParams).cree === '1';
  const isNew = id === 'nouveau';
  const p = isNew ? null : (await getProjects({ includeDrafts: true })).find((x) => x.id === Number(id));
  if (!isNew && !p) notFound();

  return (
    <>
      <nav className="admin-crumbs" aria-label="Fil d’Ariane">
        <Link href="/admin/realisations">Réalisations</Link> / {p?.title ?? 'Nouvelle réalisation'}
      </nav>
      <header className="admin-head split-head">
        <h1>{p?.title ?? 'Nouvelle réalisation'}</h1>
        {p && (
          <Link className="btn btn-ghost btn-sm" href={`/realisations/${p.slug}/`} target="_blank">
            Voir la page<span className="sr-only"> (nouvel onglet)</span>
          </Link>
        )}
      </header>
      {created && (
        <p className="admin-feedback ok" role="status">
          Réalisation créée. Ajoutez maintenant les images de la galerie.
        </p>
      )}

      <section className="admin-card" aria-labelledby="info-title">
        <h2 id="info-title">Informations</h2>
        <ActionForm action={saveProject.bind(null, p?.id ?? null)} submitLabel={isNew ? 'Créer la réalisation' : 'Enregistrer et publier'}>
          <FormGrid>
            <TextInput name="title" label="Titre" defaultValue={p?.title} required />
            <TextInput name="slug" label="Adresse de la page" defaultValue={p?.slug} help="Générée depuis le titre si vide." />
            <TextInput name="date" label="Date (AAAA-MM)" defaultValue={p?.date} placeholder="2026-03" required />
            <TextInput name="duration" label="Durée" defaultValue={p?.duration} placeholder="3 mois" />
            <TextInput name="client" label="Client" defaultValue={p?.client} />
            <TextInput name="sector" label="Secteur" defaultValue={p?.sector} />
            <TextInput name="location" label="Lieu" defaultValue={p?.location} />
            <TextInput name="position" label="Ordre (à date égale)" type="number" defaultValue={p?.position ?? 0} />
          </FormGrid>
          <fieldset className="choice-group">
            <legend>Expertises</legend>
            <div className="choices">
              {PROJECT_CATEGORIES.map((c) => (
                <label className="choice" key={c.key}>
                  <input type="checkbox" name="categories" value={c.key} defaultChecked={p?.categories.includes(c.key)} />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <TextArea name="summary" label="Résumé (cartes et référencement)" defaultValue={p?.summary} rows={2} required />
          <FormGrid>
            <TextArea name="context" label="Contexte" defaultValue={p?.context} required />
            <TextArea name="needs" label="Besoins" defaultValue={p?.needs} required />
            <TextArea name="expectations" label="Attendus" defaultValue={p?.expectations} required />
            <TextArea name="solution" label="Solution apportée" defaultValue={p?.solution} required />
            <TextArea name="deliverables" label="Livrables" defaultValue={p?.deliverables} required />
            <TextArea name="results" label="Résultats" defaultValue={p?.results} />
          </FormGrid>
          <TextArea
            name="references"
            label="Références"
            defaultValue={(p?.references ?? []).map((r) => (r.url ? `${r.label} | ${r.url}` : r.label)).join('\n')}
            help="Une par ligne : Libellé | https://lien (le lien est facultatif). Ex. Site en ligne | https://exemple.sn"
          />
          <FormGrid>
            <Toggle name="featured" label="Mettre à la une (page d’accueil)" defaultChecked={p?.featured ?? false} />
            <Toggle name="published" label="Publié sur le site" defaultChecked={p?.published ?? true} />
          </FormGrid>
        </ActionForm>
      </section>

      {p && (
        <section className="admin-card" aria-labelledby="gallery-title">
          <h2 id="gallery-title">Galerie ({p.images.length})</h2>
          <p className="muted">La première image sert de couverture. Formats JPG, PNG, WebP ou AVIF, 8 Mo maximum chacune.</p>
          <ActionForm action={uploadProjectImages.bind(null, p.id)} submitLabel="Ajouter à la galerie" resetOnSuccess>
            <FormGrid>
              <div className="field">
                <label htmlFor="images">Images</label>
                <input className="input" id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple required />
              </div>
              <TextInput name="alt" label="Description des images (accessibilité)" help="Ce que montre l’image, ex. « Tableau de bord sur ordinateur »." />
            </FormGrid>
          </ActionForm>

          {p.images.length > 0 && (
            <ul className="gallery-admin">
              {p.images.map((img) => (
                <li key={img.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- aperçu d'administration */}
                  <img src={mediaUrl(img.path)} alt="" />
                  <form action={updateProjectImage.bind(null, img.id)} className="form">
                    <div className="field">
                      <label htmlFor={`alt-${img.id}`}>Description</label>
                      <input className="input" id={`alt-${img.id}`} name="alt" defaultValue={img.alt} />
                    </div>
                    <div className="field">
                      <label htmlFor={`pos-${img.id}`}>Ordre</label>
                      <input className="input" id={`pos-${img.id}`} name="position" type="number" defaultValue={img.position} />
                    </div>
                    <SubmitButton label="Enregistrer" className="btn btn-ghost btn-sm" />
                  </form>
                  <ConfirmButton action={deleteProjectImage.bind(null, img.id)} label="Retirer" confirm="Retirer cette image de la galerie ?" />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {p && (
        <section className="admin-card danger-zone">
          <h2>Supprimer cette réalisation</h2>
          <p className="muted">La page et toutes les images de la galerie seront supprimées.</p>
          <ConfirmButton action={deleteProject.bind(null, p.id)} label="Supprimer la réalisation" confirm={`Supprimer définitivement « ${p.title} » et sa galerie ?`} />
        </section>
      )}
    </>
  );
}
