'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { FEATURES, priceLabel, resolveCart } from '@/content/features';
import { CheckoutLane } from './CheckoutLane';
import { flyToCart } from './fly';
import { cart, useCart } from './store';

export type MarketService = { slug: string; title: string; shortTitle: string; summary: string; icon: string };

const smooth = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

/** Une étagère : les articles d'un service défilent à l'horizontale, un toucher pour ajouter. */
function Shelf({ service, index, onAnnounce }: { service: MarketService; index: number; onAnnounce: (t: string) => void }) {
  const ids = useCart();
  const items = FEATURES[service.slug] ?? [];
  const inCart = items.filter((f) => ids.includes(f.id)).length;
  const rowRef = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => rowRef.current?.scrollBy({ left: dir * rowRef.current.clientWidth * 0.8, behavior: smooth() });

  return (
    <section className="aisle" id={`rayon-${service.slug}`} aria-labelledby={`aisle-${service.slug}`}>
      <header className="aisle-head">
        <span className="icon">
          <Icon name={service.icon as IconName} />
        </span>
        <div className="aisle-title">
          <span className="market-aisle">Rayon {index + 1}</span>
          <h2 id={`aisle-${service.slug}`}>{service.shortTitle}</h2>
        </div>
        {inCart > 0 && (
          <span className="market-badge">
            <Icon name="cart" /> {inCart}
            <span className="sr-only"> dans le chariot</span>
          </span>
        )}
        <div className="aisle-nav">
          <button type="button" className="shelf-arrow" onClick={() => scroll(-1)} aria-label={`Défiler le rayon ${service.shortTitle} vers la gauche`}>
            <Icon name="arrow" />
          </button>
          <button type="button" className="shelf-arrow" onClick={() => scroll(1)} aria-label={`Défiler le rayon ${service.shortTitle} vers la droite`}>
            <Icon name="arrow" />
          </button>
        </div>
      </header>

      <ul className="shelf" ref={rowRef}>
        {items.map((f) => {
          const on = ids.includes(f.id);
          return (
            <li key={f.id}>
              <button
                type="button"
                className={`product${on ? ' on' : ''}`}
                aria-pressed={on}
                onClick={(e) => {
                  const icon = e.currentTarget.querySelector('.feature-icon');
                  cart.toggle(f.id);
                  if (!on) flyToCart(icon);
                  onAnnounce(on ? `${f.label} retiré du chariot.` : `${f.label} ajouté au chariot.`);
                }}
              >
                <span className="feature-icon" aria-hidden="true">
                  <Icon name={f.icon} />
                </span>
                <span className="product-name">{f.label}</span>
                <span className="product-price">{priceLabel(f)}</span>
                <span className="product-add" aria-hidden="true">
                  <Icon name={on ? 'check' : 'plus'} />
                </span>
              </button>
            </li>
          );
        })}
        <li className="shelf-more">
          <Link href={`/services/${service.slug}/`}>
            En savoir plus<span className="sr-only"> : {service.title}</span> <Icon name="arrow" />
          </Link>
        </li>
      </ul>
    </section>
  );
}

/**
 * Le supermarché : tous les rayons sur une page, les articles défilent sur leurs étagères.
 * Un toucher = dans le chariot. Le chariot suit en bas jusqu'à la caisse.
 */
export function ServicesMarket({ services, initial = '' }: { services: MarketService[]; initial?: string }) {
  const lines = resolveCart(useCart());
  const [announce, setAnnounce] = useState('');

  // Arrivée depuis « Compléter » : on va directement au bon rayon.
  useEffect(() => {
    if (initial) document.getElementById(`rayon-${initial}`)?.scrollIntoView({ behavior: smooth(), block: 'start' });
  }, [initial]);

  return (
    <>
      <nav className="aisle-chips" aria-label="Aller au rayon">
        {services.map((s) => {
          const n = lines.filter((l) => l.service === s.slug).length;
          return (
            <a key={s.slug} className="aisle-chip" href={`#rayon-${s.slug}`}>
              <Icon name={s.icon as IconName} /> {s.shortTitle}
              {n > 0 && <span className="aisle-chip-n">{n}</span>}
            </a>
          );
        })}
      </nav>

      {services.map((s, i) => (
        <Shelf key={s.slug} service={s} index={i} onAnnounce={setAnnounce} />
      ))}

      <p className="sr-only" role="status">
        {announce}
      </p>
      <CheckoutLane />
    </>
  );
}

/** Variante qui lit ?service= dans l'URL (à placer dans un <Suspense>). */
export function ServicesMarketFromUrl({ services }: { services: MarketService[] }) {
  return <ServicesMarket services={services} initial={useSearchParams().get('service') ?? ''} />;
}
