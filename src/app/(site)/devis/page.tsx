import type { Metadata } from 'next';
import Link from 'next/link';
import { Checkout } from '@/features/cart/Checkout';
import { getServices, getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'La caisse',
  description: 'Validez votre chariot en une minute et recevez un devis gratuit de KTech Solutions.',
  alternates: { canonical: '/devis/' },
};

/** La caisse : le chariot rempli dans les rayons + trois questions, sur un seul écran. */
export default async function DevisPage() {
  const [{ company }, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <section className="section checkout-section">
      <div className="container">
        <nav className="crumbs" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li>
              <Link href="/services/">Le magasin</Link>
            </li>
            <li aria-current="page">La caisse</li>
          </ol>
        </nav>
        <div className="checkout-head">
          <p className="eyebrow">La caisse</p>
          <h1 className="h1">Passage en caisse{'\u00a0'}: une minute suffit.</h1>
        </div>
        <Checkout services={services.map((s) => ({ slug: s.slug, shortTitle: s.shortTitle, icon: s.icon }))} whatsapp={company.whatsapp} />
      </div>
    </section>
  );
}
