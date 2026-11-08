import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { CTA } from '@/config/site';
import { whatsappUrl } from '@/lib/format';

type Crumb = { href?: string; label: string };

/** En-tête des pages internes : fil d'Ariane, surtitre, H1, introduction. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container">
        <nav className="crumbs" aria-label="Fil d’Ariane">
          <ol>
            <li>
              <Link href="/">Accueil</Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.label} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>
                {c.href && i < crumbs.length - 1 ? <Link href={c.href}>{c.label}</Link> : c.label}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h1">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHead({ id, eyebrow, title, lead, aside }: { id: string; eyebrow: string; title: string; lead?: string; aside?: ReactNode }) {
  return (
    <div className={`section-head${lead || aside ? ' split' : ''}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2" id={id}>
          {title}
        </h2>
      </div>
      {(lead || aside) && (
        <div>
          {lead && <p className="lead">{lead}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}

/** Bandeau de fin de page : action principale + WhatsApp. */
export function CtaBand({ title, sub, whatsapp }: { title: string; sub: string; whatsapp?: string }) {
  const wa = whatsapp ? whatsappUrl(whatsapp, 'Bonjour KTech Solutions, je souhaite échanger sur un projet.') : null;
  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-band">
          <h2 id="cta-title">
            {title} <span className="hl">{sub}</span>
          </h2>
          <div className="btns">
            <Link className="btn" href={CTA.href}>
              {CTA.primary} <Icon name="arrow" />
            </Link>
            {wa && (
              <a className="btn btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" /> {CTA.whatsapp}
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Checks({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`checks ${className}`}>
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

/**
 * Rendu d'un texte simple édité au back-office :
 * « ## » = titre, « - » = élément de liste, ligne vide = nouveau paragraphe.
 * Aucun HTML n'est interprété (pas d'injection possible).
 */
export function RichText({ source }: { source: string }) {
  const out: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (para.length) out.push(<p key={out.length}>{para.join(' ')}</p>);
    if (list.length) out.push(<ul key={out.length}>{list.map((l, i) => <li key={i}>{l}</li>)}</ul>);
    para = [];
    list = [];
  };
  for (const raw of source.replace(/\r/g, '').split('\n')) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith('## ')) {
      flush();
      out.push(<h2 key={out.length}>{line.slice(3)}</h2>);
    } else if (line.startsWith('- ')) {
      if (para.length) flush();
      list.push(line.slice(2));
    } else {
      if (list.length) flush();
      para.push(line);
    }
  }
  flush();
  return <div className="prose">{out}</div>;
}
