import type { Metadata } from 'next';
import { PageHero, RichText } from '@/components/sections/Blocks';
import { getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Comment KTech Solutions collecte, utilise et protège les données transmises via son site.',
  alternates: { canonical: '/confidentialite/' },
};

export default async function PrivacyPage() {
  const { legal } = await getSettings();
  return (
    <>
      <PageHero crumbs={[{ label: 'Confidentialité' }]} eyebrow="Informations" title="Politique de confidentialité" />
      <section className="section">
        <div className="container">
          <RichText source={legal.privacy} />
        </div>
      </section>
    </>
  );
}
