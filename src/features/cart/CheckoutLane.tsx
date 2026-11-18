'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cartTotal, formatPrice, resolveCart } from '@/content/features';
import { cart, useCart } from './store';

/**
 * L'allée du supermarché : le chariot avance vers la caisse à mesure qu'il se remplit,
 * puis roule jusqu'à la caisse quand le visiteur valide (avant d'ouvrir /devis/).
 */
export function CheckoutLane() {
  const lines = resolveCart(useCart());
  const count = lines.length;
  const total = cartTotal(lines);
  const router = useRouter();
  const [walking, setWalking] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const onBump = () => setBump((n) => n + 1);
    window.addEventListener('ktech:cart-bump', onBump);
    return () => window.removeEventListener('ktech:cart-bump', onBump);
  }, []);

  useEffect(() => {
    router.prefetch('/devis/');
  }, [router]);

  // Avancement dans l'allée (0 à 100 %) : un pas par article, la caisse au bout.
  const progress = walking ? 100 : count === 0 ? 0 : Math.min(18 + count * 11, 80);
  const goods = lines.slice(-3);

  const checkout = () => {
    if (!count) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/devis/');
      return;
    }
    setWalking(true);
    setTimeout(() => router.push('/devis/'), 1100);
  };

  return (
    <div className={`lane${walking ? ' walking' : ''}${count ? '' : ' empty'}`} role="region" aria-label="Allée vers la caisse">
      <div className="lane-road" aria-hidden="true">
        <span className="lane-end lane-start">
          <Icon name="bag" />
          <span>Rayons</span>
        </span>
        <div className="lane-track">
          <i className="lane-fill" style={{ width: `${progress}%` }} />
          <span className="lane-cart" style={{ left: `calc(${progress}% - ${progress * 0.52}px)` }}>
            <span className="lane-goods">
              {goods.map((l) => (
                <span key={l.id} className="chariot-good">
                  <Icon name={l.icon} />
                </span>
              ))}
            </span>
            <span className="chariot-cart" data-cart-target key={`b${bump}`}>
              <Icon name="cart" />
              {count > 0 && <span className="cart-count">{count}</span>}
            </span>
          </span>
        </div>
        <span className="lane-end lane-till">
          <Icon name="file" />
          <span>Caisse</span>
        </span>
      </div>

      <div className="lane-info">
        <p>
          {count === 0 ? (
            <>
              Votre chariot vous attend<span className="lane-long"> : entrez dans un rayon et ajoutez ce qu’il vous faut</span>.
            </>
          ) : (
            <>
              <b>
                {count} article{count > 1 ? 's' : ''}
              </b>
              <span className="lane-long"> dans le chariot</span>
              <span className="lane-price">
                <span className="lane-long"> · </span>
                {total ? <>dès <b>{formatPrice(total)}</b></> : 'sur devis'}
              </span>
            </>
          )}
        </p>
        <div className="btns">
          {count > 0 && (
            <button type="button" className="btn btn-ghost btn-sm lane-see" onClick={cart.open}>
              Voir mon chariot
            </button>
          )}
          <button type="button" className="btn btn-sm" onClick={checkout} disabled={!count || walking} aria-disabled={!count || walking}>
            {walking ? 'En route…' : 'Passer à la caisse'} <Icon name="arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}
