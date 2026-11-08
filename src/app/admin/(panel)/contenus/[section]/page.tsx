import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SECTIONS, type SectionKey } from '@/content/settings';
import { ActionForm } from '@/features/admin/ActionForm';
import { linesOf, pairsOf, TextArea, TextInput } from '@/features/admin/inputs';
import type { Pair } from '@/server/db/schema';
import { saveSection } from '@/server/actions/content';
import { getSettings } from '@/server/queries/content';

export const metadata: Metadata = { title: 'Modifier les textes' };

export default async function SectionPage({ params }: PageProps<'/admin/contenus/[section]'>) {
  const key = (await params).section as SectionKey;
  const def = SECTIONS[key];
  if (!def) notFound();
  const values = (await getSettings())[key] as Record<string, unknown>;

  return (
    <>
      <nav className="admin-crumbs" aria-label="Fil d’Ariane">
        <Link href="/admin/contenus">Textes des pages</Link> / {def.label}
      </nav>
      <header className="admin-head">
        <h1>{def.label}</h1>
        <p className="muted">{def.description}</p>
      </header>
      <section className="admin-card">
        <ActionForm action={saveSection.bind(null, key)} submitLabel="Enregistrer et publier">
          {def.fields.map((f) => {
            const v = values[f.key];
            if (f.type === 'text') return <TextInput key={f.key} name={f.key} label={f.label} help={f.help} defaultValue={String(v ?? '')} required />;
            const text = f.type === 'lines' ? linesOf(v as string[]) : f.type === 'pairs' ? pairsOf(v as Pair[]) : String(v ?? '');
            const rows = f.type === 'textarea' && key === 'legal' ? 16 : f.type === 'textarea' ? 3 : Math.min(12, Math.max(4, text.split('\n').length + 1));
            return <TextArea key={f.key} name={f.key} label={f.label} help={f.help} defaultValue={text} rows={rows} required />;
          })}
        </ActionForm>
      </section>
    </>
  );
}
