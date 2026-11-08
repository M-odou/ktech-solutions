import type { Metadata } from 'next';
import { PageHero, RichText } from '@/components/sections/Blocks';
import { getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site KTech Solutions.',
  alternates: { canonical: '/mentions-legales/' },
};

export default async function MentionsPage() {
  const { legal } = await getSettings();
  return (
    <>
      <PageHero crumbs={[{ label: 'Mentions légales' }]} eyebrow="Informations" title="Mentions légales" />
      <section className="section">
        <div className="container">
          <RichText source={legal.mentions} />
        </div>
      </section>
    </>
  );
}
