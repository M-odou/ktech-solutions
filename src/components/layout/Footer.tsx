import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { CTA } from '@/config/site';
import type { Settings } from '@/content/settings';
import { telHref } from '@/lib/format';
import { Socials } from './Socials';

const LINKS = [
  { href: '/services/', label: 'Services' },
  { href: '/realisations/', label: 'Réalisations' },
  { href: '/formations/', label: 'Formations' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/contact/', label: 'Contact' },
];

/** Pied de page volontairement sobre : identité, liens essentiels, contact direct, mentions. */
export function Footer({ company }: { company: Settings['company'] }) {
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Link href="/" aria-label={`${company.name}, retour à l’accueil`}>
            <Logo />
          </Link>
          <p>{company.tagline}.</p>
        </div>
        <div className="footer-cta">
          <Link className="btn btn-sm" href={CTA.href}>
            {CTA.primary}
          </Link>
          <a className="footer-phone" href={telHref(company.phone)}>
            {company.phone}
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <nav aria-label="Liens du pied de page">
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Socials company={company} />
        <p className="footer-legal">
          © {new Date().getFullYear()} {company.name} · <Link href="/mentions-legales/">Mentions légales</Link> ·{' '}
          <Link href="/confidentialite/">Confidentialité</Link>
        </p>
      </div>
    </footer>
  );
}
