import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CtaBand } from '@/components/sections/Blocks';
import { ServicesMarket, ServicesMarketFromUrl } from '@/features/cart/ServicesMarket';
import { getServices, getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Nos services',
  description: 'Formation numérique, développement web et mobile, identité visuelle, impression et accompagnement événementiel.',
  alternates: { canonical: '/services/' },
};

export default async function ServicesPage() {
  const [{ company }, services] = await Promise.all([getSettings(), getServices()]);
  const list = services.map((s) => ({ slug: s.slug, title: s.title, shortTitle: s.shortTitle, summary: s.summary, icon: s.icon }));
  return (
    <>
      <section className="section market" aria-labelledby="market-title">
        <div className="container">
          <div className="market-head">
            <p className="eyebrow">Le magasin KTech · 1 minute</p>
            <h1 className="h2" id="market-title">
              Touchez, c’est dans le chariot.
            </h1>
          </div>
          <Suspense fallback={<ServicesMarket services={list} />}>
            <ServicesMarketFromUrl services={list} />
          </Suspense>
        </div>
      </section>
      <CtaBand title="Vous ne savez pas par où commencer ?" sub="Décrivez votre besoin, nous vous orientons." whatsapp={company.whatsapp} />
    </>
  );
}
