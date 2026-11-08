import type { Metadata } from 'next';
import { ActionForm, ConfirmButton } from '@/features/admin/ActionForm';
import { FormGrid, TextArea, TextInput, Toggle } from '@/features/admin/inputs';
import { deleteFaq, saveFaq } from '@/server/actions/content';
import { getFaqs } from '@/server/queries/content';

export const metadata: Metadata = { title: 'Questions fréquentes' };

export default async function AdminFaq() {
  const faqs = await getFaqs({ includeDrafts: true });
  return (
    <>
      <header className="admin-head">
        <h1>Questions fréquentes</h1>
        <p className="muted">Affichées en bas de la page d’accueil.</p>
      </header>

      {faqs.map((f) => (
        <details className="admin-card editable" key={f.id}>
          <summary>
            <b>{f.question}</b>
            {!f.published && <span className="status s-archive">Brouillon</span>}
          </summary>
          <ActionForm action={saveFaq.bind(null, f.id)}>
            <TextInput name="question" label="Question" defaultValue={f.question} required />
            <TextArea name="answer" label="Réponse" defaultValue={f.answer} rows={3} required />
            <FormGrid>
              <TextInput name="position" label="Ordre" type="number" defaultValue={f.position} />
              <Toggle name="published" label="Publiée sur le site" defaultChecked={f.published} />
            </FormGrid>
          </ActionForm>
          <ConfirmButton action={deleteFaq.bind(null, f.id)} confirm="Supprimer cette question ?" />
        </details>
      ))}

      <section className="admin-card" aria-labelledby="new-faq">
        <h2 id="new-faq">Ajouter une question</h2>
        <ActionForm action={saveFaq.bind(null, null)} submitLabel="Ajouter" resetOnSuccess>
          <TextInput name="question" label="Question" required />
          <TextArea name="answer" label="Réponse" rows={3} required />
          <FormGrid>
            <TextInput name="position" label="Ordre" type="number" defaultValue={faqs.length} />
            <Toggle name="published" label="Publiée sur le site" defaultChecked />
          </FormGrid>
        </ActionForm>
      </section>
    </>
  );
}
