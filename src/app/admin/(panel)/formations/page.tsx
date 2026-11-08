import type { Metadata } from 'next';
import { ActionForm, ConfirmButton } from '@/features/admin/ActionForm';
import { FormGrid, TextArea, TextInput, Toggle } from '@/features/admin/inputs';
import { deleteCourse, saveCourse } from '@/server/actions/content';
import { getCourses } from '@/server/queries/content';

export const metadata: Metadata = { title: 'Formations' };

export default async function AdminCourses() {
  const courses = await getCourses({ includeDrafts: true });
  return (
    <>
      <header className="admin-head">
        <h1>Formations</h1>
        <p className="muted">Domaines affichés sur la page Formations et proposés dans le formulaire de demande de programme.</p>
      </header>

      {courses.map((c) => (
        <details className="admin-card editable" key={c.id}>
          <summary>
            <b>{c.title}</b>
            <span className="muted">
              {c.level} · {c.mode}
            </span>
            {!c.published && <span className="status s-archive">Brouillon</span>}
          </summary>
          <ActionForm action={saveCourse.bind(null, c.id)}>
            <FormGrid>
              <TextInput name="title" label="Intitulé" defaultValue={c.title} required />
              <TextInput name="level" label="Niveau" defaultValue={c.level} required />
              <TextInput name="mode" label="Format" defaultValue={c.mode} required />
              <TextInput name="position" label="Ordre" type="number" defaultValue={c.position} />
            </FormGrid>
            <TextArea name="description" label="Description" defaultValue={c.description} rows={2} required />
            <Toggle name="published" label="Publiée sur le site" defaultChecked={c.published} />
          </ActionForm>
          <ConfirmButton action={deleteCourse.bind(null, c.id)} confirm={`Supprimer la formation « ${c.title} » ?`} />
        </details>
      ))}

      <section className="admin-card" aria-labelledby="new-course">
        <h2 id="new-course">Ajouter une formation</h2>
        <ActionForm action={saveCourse.bind(null, null)} submitLabel="Ajouter" resetOnSuccess>
          <FormGrid>
            <TextInput name="title" label="Intitulé" required />
            <TextInput name="level" label="Niveau" required placeholder="Débutant à intermédiaire" />
            <TextInput name="mode" label="Format" required placeholder="Présentiel ou en ligne" />
            <TextInput name="position" label="Ordre" type="number" defaultValue={courses.length} />
          </FormGrid>
          <TextArea name="description" label="Description" rows={2} required />
          <Toggle name="published" label="Publiée sur le site" defaultChecked />
        </ActionForm>
      </section>
    </>
  );
}
