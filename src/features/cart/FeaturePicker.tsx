'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cartTotal, FEATURES, formatPrice, priceLabel, resolveCart } from '@/content/features';
import { flyToCart } from './fly';
import { cart, useCart } from './store';

/** L'étal d'un service : les livrables à mettre dans le chariot de ce service. */
export function FeatureStall({ service, title, hideSummary = false }: { service: string; title: string; hideSummary?: boolean }) {
  const features = FEATURES[service] ?? [];
  const ids = useCart();
  const [announce, setAnnounce] = useState('');
  const all = resolveCart(ids);
  const mine = all.filter((l) => l.service === service);

  return (
    <div className="stall">
      <ul className="feature-grid">
        {features.map((f) => {
          const on = ids.includes(f.id);
          return (
            <li key={f.id} className={`feature-card${on ? ' on' : ''}`}>
              <span className="feature-icon" aria-hidden="true">
                <Icon name={f.icon} />
                {on && (
                  <span className="feature-tick">
                    <Icon name="check" />
                  </span>
                )}
              </span>
              <div className="feature-text">
                <b>{f.label}</b>
                <span className="muted">{f.text}</span>
              </div>
              <div className="feature-foot">
                <span className="feature-price">{priceLabel(f)}</span>
                <button
                  type="button"
                  className={`btn btn-sm${on ? ' btn-ghost' : ''}`}
                  aria-pressed={on}
                  onClick={(e) => {
                    const icon = e.currentTarget.closest('.feature-card')?.querySelector('.feature-icon');
                    cart.toggle(f.id);
                    if (!on) flyToCart(icon);
                    setAnnounce(on ? `${f.label} retiré du chariot.` : `${f.label} ajouté au chariot.`);
                  }}
                >
                  <Icon name={on ? 'check' : 'cart'} />
                  {on ? 'Dans le chariot' : 'Ajouter'}
                  <span className="sr-only"> : {f.label}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {!hideSummary && (
        <div className="stall-summary">
          <p>
            {all.length === 0 ? (
              <>Votre chariot est vide : prenez les articles du rayon {title} qui vous intéressent.</>
            ) : (
              <>
                <b>
                  {all.length} article{all.length > 1 ? 's' : ''}
                </b>{' '}
                dans votre chariot{mine.length !== all.length ? ` (dont ${mine.length} de ce rayon)` : ''}
                {cartTotal(all) ? <> · dès <b>{formatPrice(cartTotal(all))}</b></> : null}
              </>
            )}
          </p>
          <div className="btns">
            <Link className="btn btn-ghost btn-sm" href="/services/">
              <Icon name="bag" /> Autres rayons
            </Link>
            {all.length > 0 ? (
              <Link className="btn btn-sm" href="/devis/">
                Passer à la caisse <Icon name="arrow" />
              </Link>
            ) : (
              <Link className="btn btn-sm" href={`/devis/?service=${service}`}>
                Demander un devis <Icon name="arrow" />
              </Link>
            )}
          </div>
        </div>
      )}
      <p className="sr-only" role="status">
        {announce}
      </p>
    </div>
  );
}

/** Section « Remplissez votre chariot » de la page d'un service. */
export function FeaturePicker({ service, title }: { service: string; title: string }) {
  if (!FEATURES[service]?.length) return null;
  return (
    <section className="section band" id="composer" aria-labelledby="composer-title">
      <div className="container">
        <div className="section-head split">
          <div>
            <p className="eyebrow">Faites votre marché</p>
            <h2 className="h2" id="composer-title">
              Remplissez votre chariot
            </h2>
          </div>
          <p className="muted">
            Prenez les articles du rayon « {title} » qu’il vous faut. Votre chariot vous suit dans tout le magasin : ajoutez d’autres services, puis passez à la caisse.
          </p>
        </div>
        <FeatureStall service={service} title={title} />
      </div>
    </section>
  );
}
