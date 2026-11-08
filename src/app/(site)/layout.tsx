import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RevealObserver } from '@/components/layout/RevealObserver';
import { Icon } from '@/components/ui/Icon';
import { SITE_URL } from '@/config/site';
import { whatsappUrl } from '@/lib/format';
import { getServices, getSettings } from '@/server/queries/content';

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const [{ company }, services] = await Promise.all([getSettings(), getServices()]);
  const wa = whatsappUrl(company.whatsapp, `Bonjour ${company.name}, je souhaite des informations.`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: company.name,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-ktech.png`,
    slogan: company.tagline,
    description: company.description,
    telephone: company.phone.replace(/\s/g, ''),
    ...(company.email ? { email: company.email } : {}),
    address: { '@type': 'PostalAddress', addressLocality: 'Rufisque', addressRegion: 'Dakar', addressCountry: 'SN' },
    areaServed: ['Sénégal', 'Afrique de l’Ouest'],
    knowsAbout: services.map((s) => s.title),
  };

  return (
    <>
      <a className="skip" href="#contenu">
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" tabIndex={-1}>
        {children}
      </main>
      <Footer company={company} />
      {wa && (
        <aside aria-label="Contact rapide">
          <a className="wa-float" href={wa} target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp (nouvel onglet)">
            <Icon name="whatsapp" />
          </a>
        </aside>
      )}
      <RevealObserver />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
