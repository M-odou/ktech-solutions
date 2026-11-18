'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cartTotal, FEATURES, formatPrice, priceLabel, resolveCart } from '@/content/features';
import { cart, useCart } from './store';

/** « L'étal » d'un service : le visiteur ajoute ou retire les fonctionnalités qu'il veut. */
export function FeaturePicker({ service, title }: { service: string; title: string }) {
  const features = FEATURES[service] ?? [];
  const ids = useCart();
  const [announce, setAnnounce] = useState('');
  if (features.length === 0) return null;

  const lines = resolveCart(ids);
  const here = lines.filter((l) => l.service === service);

  return (
    <section className="section band" id="composer" aria-labelledby="composer-title">
      <div className="container">
        <div className="section-head split">
          <div>
            <p className="eyebrow">Composez votre projet</p>
            <h2 className="h2" id="composer-title">
              Remplissez votre panier
            </h2>
          </div>
          <p className="muted">
            Choisissez les fonctionnalités que vous voulez pour votre projet « {title} ». Votre panier vous suit sur tout le site : ajoutez aussi des éléments
            d’autres services, puis validez pour recevoir votre devis.
          </p>
        </div>

        <ul className="feature-grid">
          {features.map((f) => {
            const on = ids.includes(f.id);
            return (
              <li key={f.id} className={`feature-card${on ? ' on' : ''}`}>
                <div className="feature-text">
                  <b>{f.label}</b>
                  <span className="muted">{f.text}</span>
                </div>
                <div className="feature-foot">
                  <span className="feature-price">{priceLabel(f)}</span>
                  <button
                    type="button"
                    className={`btn btn-sm${on ? '' : ' btn-ghost'}`}
                    aria-pressed={on}
                    onClick={() => {
                      cart.toggle(f.id);
                      setAnnounce(on ? `${f.label} retiré du panier.` : `${f.label} ajouté au panier.`);
                    }}
                  >
                    <Icon name={on ? 'check' : 'plus'} />
                    {on ? 'Dans le panier' : 'Ajouter'}
                    <span className="sr-only"> : {f.label}</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="feature-summary">
          <p>
            {lines.length === 0 ? (
              'Votre panier est vide pour le moment.'
            ) : (
              <>
                <b>
                  {lines.length} article{lines.length > 1 ? 's' : ''}
                </b>{' '}
                dans votre panier{here.length !== lines.length ? ` (dont ${here.length} ici)` : ''} · estimation de départ <b>{formatPrice(cartTotal(lines))}</b>
              </>
            )}
          </p>
          <div className="btns">
            {lines.length > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={cart.open}>
                <Icon name="cart" /> Voir mon panier
              </button>
            )}
            <Link className="btn btn-sm" href={`/devis/?service=${service}`}>
              {lines.length ? 'Valider mon panier' : 'Demander un devis'} <Icon name="arrow" />
            </Link>
          </div>
        </div>
        <p className="sr-only" role="status">
          {announce}
        </p>
      </div>
    </section>
  );
}
