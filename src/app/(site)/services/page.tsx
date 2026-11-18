import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CtaBand, PageHero } from '@/components/sections/Blocks';
import { ServicesMarket, ServicesMarketFromUrl } from '@/features/cart/ServicesMarket';
import { getServices, getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Nos services',
  description: 'Formation numérique, développement web et mobile, identité visuelle, impression et accompagnement événementiel.',
  alternates: { canonical: '/services/' },
};

export default async function ServicesPage() {
  const [{ services: page, company }, services] = await Promise.all([getSettings(), getServices()]);
  const list = services.map((s) => ({ slug: s.slug, title: s.title, shortTitle: s.shortTitle, summary: s.summary, icon: s.icon }));
  return (
    <>
      <PageHero crumbs={[{ label: 'Services' }]} eyebrow="Nos services" title={page.title} lead={page.lead} />
      <section className="section market" aria-label="Choisir un service et ses livrables">
        <div className="container">
          <Suspense fallback={<ServicesMarket services={list} />}>
            <ServicesMarketFromUrl services={list} />
          </Suspense>
        </div>
      </section>
      <CtaBand title="Vous ne savez pas par où commencer ?" sub="Décrivez votre besoin, nous vous orientons." whatsapp={company.whatsapp} />
    </>
  );
}
