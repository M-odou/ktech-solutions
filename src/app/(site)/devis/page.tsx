import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/Blocks';
import { QuoteWizard } from '@/features/quote/QuoteWizard';
import { getServices, getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Demande de devis',
  description: 'Décrivez votre projet en quelques minutes et recevez une proposition adaptée de KTech Solutions.',
  alternates: { canonical: '/devis/' },
};

export default async function DevisPage({ searchParams }: PageProps<'/devis'>) {
  const [{ quote, company }, services, params] = await Promise.all([getSettings(), getServices(), searchParams]);
  const initial = typeof params.service === 'string' ? params.service : undefined;

  return (
    <>
      <PageHero crumbs={[{ label: 'Demande de devis' }]} eyebrow="Demande de devis" title={quote.title} lead={quote.lead} />
      <section className="section wizard-section">
        <div className="container">
          <QuoteWizard
            services={services.map((s) => ({ slug: s.slug, title: s.title, shortTitle: s.shortTitle, summary: s.summary, icon: s.icon, offers: s.offers }))}
            initialService={initial}
            whatsapp={company.whatsapp}
            successText={quote.successText}
          />
        </div>
      </section>
    </>
  );
}
