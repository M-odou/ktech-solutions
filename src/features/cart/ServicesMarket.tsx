'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { FEATURES, resolveCart } from '@/content/features';
import { CheckoutLane } from './CheckoutLane';
import { FeatureStall } from './FeaturePicker';
import { useCart } from './store';

export type MarketService = { slug: string; title: string; shortTitle: string; summary: string; icon: string };

/**
 * Page Services en supermarché : chaque service est un rayon. On entre dans un rayon,
 * on met les livrables voulus dans le chariot (autant de rayons qu'on veut), puis on passe à la caisse.
 */
export function ServicesMarket({ services, initial = '' }: { services: MarketService[]; initial?: string }) {
  const valid = (slug: string) => (services.some((s) => s.slug === slug) ? slug : '');
  const [selected, setSelected] = useState(valid(initial));
  const [lastInitial, setLastInitial] = useState(initial);
  if (initial !== lastInitial) {
    setLastInitial(initial);
    if (valid(initial)) setSelected(initial);
  }
  const lines = resolveCart(useCart());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const current = services.find((s) => s.slug === selected);
  const visited = new Set(lines.map((l) => l.service));

  const enter = (slug: string) => {
    setSelected(slug);
    try {
      window.history.replaceState(null, '', `?service=${slug}#etal`);
    } catch {
      /* rien */
    }
    requestAnimationFrame(() => {
      document.getElementById('etal')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      headingRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <>
      <ol className="market-steps" aria-label="Comment ça marche">
        <li>
          <span aria-hidden="true">
            <Icon name="bag" />
          </span>
          <b>1.</b> Entrez dans un rayon
        </li>
        <li>
          <span aria-hidden="true">
            <Icon name="cart" />
          </span>
          <b>2.</b> Prenez les livrables qu’il vous faut
        </li>
        <li>
          <span aria-hidden="true">
            <Icon name="file" />
          </span>
          <b>3.</b> Passez à la caisse : devis gratuit
        </li>
      </ol>

      <h2 className="sr-only">Les rayons</h2>
      <ul className="market-grid">
        {services.map((s, i) => {
          const mine = lines.filter((l) => l.service === s.slug);
          const isOn = s.slug === selected;
          const n = FEATURES[s.slug]?.length ?? 0;
          return (
            <li key={s.slug} className={`market-card${isOn ? ' on' : ''}${visited.has(s.slug) ? ' visited' : ''}`}>
              <button type="button" className="market-enter" aria-pressed={isOn} aria-controls="etal" onClick={() => enter(s.slug)}>
                <span className="market-card-top">
                  <span className="icon">
                    <Icon name={s.icon as IconName} />
                  </span>
                  <span className="market-aisle">Rayon {i + 1}</span>
                  {mine.length > 0 && (
                    <span className="market-badge">
                      <Icon name="cart" /> {mine.length}
                      <span className="sr-only"> dans le chariot</span>
                    </span>
                  )}
                </span>
                <span className="market-title">{s.title}</span>
                <span className="market-summary">{s.summary}</span>
                {mine.length > 0 && (
                  <span className="market-goods" aria-hidden="true">
                    {mine.slice(0, 6).map((l) => (
                      <span key={l.id} className="chariot-good">
                        <Icon name={l.icon} />
                      </span>
                    ))}
                  </span>
                )}
                <span className="market-cta">
                  {isOn ? 'Vous êtes dans ce rayon' : mine.length ? 'Retourner dans le rayon' : 'Entrer dans le rayon'}
                  <Icon name="arrow" />
                </span>
              </button>
              <p className="market-foot">
                <span>{n} articles</span>
                <Link href={`/services/${s.slug}/`}>
                  En savoir plus<span className="sr-only"> : {s.title}</span>
                </Link>
              </p>
            </li>
          );
        })}
      </ul>

      <section id="etal" className="etal" aria-labelledby="etal-title">
        {current ? (
          <>
            <div className="etal-head">
              <span className="icon">
                <Icon name={current.icon as IconName} />
              </span>
              <div>
                <p className="eyebrow">Rayon {current.shortTitle}</p>
                <h2 className="h2" id="etal-title" ref={headingRef} tabIndex={-1}>
                  Qu’est-ce qu’il vous faut ?
                </h2>
              </div>
            </div>
            <FeatureStall service={current.slug} title={current.shortTitle} hideSummary />
            <nav className="etal-next" aria-label="Autres rayons">
              <span className="muted">Besoin d’autre chose ?</span>
              <div className="choices">
                {services
                  .filter((s) => s.slug !== current.slug)
                  .map((s) => (
                    <button key={s.slug} type="button" className="aisle-chip" onClick={() => enter(s.slug)}>
                      <Icon name={s.icon as IconName} /> {s.shortTitle}
                    </button>
                  ))}
              </div>
            </nav>
          </>
        ) : (
          <div className="etal-empty">
            <span className="chariot-illu" aria-hidden="true">
              <Icon name="cart" />
            </span>
            <h2 className="h3" id="etal-title" ref={headingRef} tabIndex={-1}>
              Choisissez un rayon pour voir ses articles
            </h2>
            <p className="muted">Prenez autant de services que vous voulez : tout va dans le même chariot, et vous passez une seule fois à la caisse.</p>
          </div>
        )}
      </section>

      <CheckoutLane />
    </>
  );
}

/** Variante qui lit ?service= dans l'URL (à placer dans un <Suspense>). */
export function ServicesMarketFromUrl({ services }: { services: MarketService[] }) {
  return <ServicesMarket services={services} initial={useSearchParams().get('service') ?? ''} />;
}
