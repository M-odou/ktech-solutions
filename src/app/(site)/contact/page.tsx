import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/Blocks';
import { Icon } from '@/components/ui/Icon';
import { Socials } from '@/components/layout/Socials';
import { CTA } from '@/config/site';
import { SimpleRequestForm } from '@/features/requests/SimpleRequestForm';
import { telHref, whatsappUrl } from '@/lib/format';
import { getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez KTech Solutions : téléphone, WhatsApp, message ou demande de devis en ligne. Basés à Rufisque, Dakar.',
  alternates: { canonical: '/contact/' },
};

export default async function ContactPage() {
  const { contact, company } = await getSettings();
  const wa = whatsappUrl(company.whatsapp, 'Bonjour KTech Solutions, je souhaite des informations.');

  return (
    <>
      <PageHero crumbs={[{ label: 'Contact' }]} eyebrow="Contact" title={contact.title} lead={contact.lead} />

      <section className="section" aria-label="Moyens de contact">
        <div className="container">
          <ul className="contact-paths">
            <li>
              <Link className="contact-path primary" href={CTA.href}>
                <span className="icon">
                  <Icon name="rocket" />
                </span>
                <b>Un projet précis ?</b>
                <span>Lancez votre demande de devis guidée, en quelques minutes.</span>
                <span className="link">
                  {CTA.primary} <Icon name="arrow" />
                </span>
              </Link>
            </li>
            {wa && (
              <li>
                <a className="contact-path" href={wa} target="_blank" rel="noopener noreferrer">
                  <span className="icon">
                    <Icon name="whatsapp" />
                  </span>
                  <b>Une question rapide ?</b>
                  <span>Écrivez-nous directement sur WhatsApp.</span>
                  <span className="link">
                    {CTA.whatsapp} <Icon name="arrow" />
                    <span className="sr-only"> (nouvel onglet)</span>
                  </span>
                </a>
              </li>
            )}
            <li>
              <a className="contact-path" href={telHref(company.phone)}>
                <span className="icon">
                  <Icon name="phone" />
                </span>
                <b>Nous appeler</b>
                <span>{company.hours}</span>
                <span className="link">{company.phone}</span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="section band" aria-labelledby="msg-title">
        <div className="container contact-grid">
          <div className="card">
            <h2 className="h3" id="msg-title">
              Envoyer un message
            </h2>
            <SimpleRequestForm kind="message" />
          </div>
          <section className="panel" aria-labelledby="coord-title">
            <h2 className="h3" id="coord-title">
              Nos coordonnées
            </h2>
            <ul className="info-list">
              <li>
                <span className="icon">
                  <Icon name="phone" />
                </span>
                <div>
                  <small>Téléphone</small>
                  <a href={telHref(company.phone)}>{company.phone}</a>
                </div>
              </li>
              {company.email && (
                <li>
                  <span className="icon">
                    <Icon name="mail" />
                  </span>
                  <div>
                    <small>E-mail</small>
                    <a href={`mailto:${company.email}`}>{company.email}</a>
                  </div>
                </li>
              )}
              <li>
                <span className="icon">
                  <Icon name="pin" />
                </span>
                <div>
                  <small>Adresse</small>
                  {company.address}
                </div>
              </li>
              <li>
                <span className="icon">
                  <Icon name="clock" />
                </span>
                <div>
                  <small>Horaires</small>
                  {company.hours}
                </div>
              </li>
            </ul>
            <Socials company={company} />
          </section>
        </div>
      </section>
    </>
  );
}
