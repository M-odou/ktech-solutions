'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cartTotal, formatPrice, mainService, priceLabel, resolveCart } from '@/content/features';
import { whatsappUrl } from '@/lib/format';
import { cart, useCart } from './store';

export type CartService = { slug: string; shortTitle: string };

/** Bouton panier de l'en-tête + tiroir latéral (dialog natif : focus piégé, Échap pour fermer). */
export function CartButton({ services, whatsapp }: { services: CartService[]; whatsapp: string }) {
  const ids = useCart();
  const lines = resolveCart(ids);
  const count = lines.length;
  const total = cartTotal(lines);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bump, setBump] = useState(false);
  const pathname = usePathname();

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    window.addEventListener('ktech:open-cart', open);
    return () => window.removeEventListener('ktech:open-cart', open);
  }, []);

  // Petite animation du badge à chaque ajout.
  const [lastCount, setLastCount] = useState(count);
  if (count !== lastCount) {
    setLastCount(count);
    if (count > lastCount) setBump(true);
  }
  useEffect(() => {
    if (!bump) return;
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [bump]);

  // Fermeture à chaque changement de page.
  useEffect(() => close(), [pathname]);

  const groups = services
    .map((s) => ({ slug: s.slug, title: s.shortTitle, items: lines.filter((l) => l.service === s.slug) }))
    .filter((g) => g.items.length > 0);
  const main = mainService(lines);

  const waText = [
    'Bonjour KTech Solutions, voici mon panier :',
    ...groups.flatMap((g) => [`\n${g.title} :`, ...g.items.map((i) => `• ${i.label}`)]),
    `\nEstimation de départ : ${formatPrice(total)}`,
  ].join('\n');
  const wa = count ? whatsappUrl(whatsapp, waText) : null;

  return (
    <>
      <button type="button" className={`cart-btn${bump ? ' bump' : ''}`} onClick={open} aria-haspopup="dialog" aria-label={count ? `Mon panier, ${count} article${count > 1 ? 's' : ''}` : 'Mon panier, vide'}>
        <Icon name="cart" />
        {count > 0 && (
          <span className="cart-count" aria-hidden="true">
            {count}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        className="cart-drawer"
        aria-labelledby="cart-title"
        onClick={(e) => {
          // Clic sur le fond (hors du contenu) : fermeture.
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="cart-in">
          <header className="cart-head">
            <h2 id="cart-title">
              Mon panier {count > 0 && <span className="muted">({count})</span>}
            </h2>
            <button type="button" className="theme-toggle" onClick={close} aria-label="Fermer le panier">
              <Icon name="close" />
            </button>
          </header>

          {count === 0 ? (
            <div className="cart-empty">
              <span className="icon">
                <Icon name="cart" />
              </span>
              <p>
                <b>Votre panier est vide.</b>
              </p>
              <p className="muted">Parcourez nos services et ajoutez les fonctionnalités que vous voulez pour votre projet, comme au marché.</p>
              <Link className="btn btn-sm" href="/services/" onClick={close}>
                Voir les services <Icon name="arrow" />
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-body">
                {groups.map((g) => (
                  <section key={g.slug} className="cart-group" aria-label={g.title}>
                    <h3>
                      <Link href={`/services/${g.slug}/#composer`} onClick={close}>
                        {g.title}
                      </Link>
                    </h3>
                    <ul>
                      {g.items.map((item) => (
                        <li key={item.id}>
                          <span className="cart-line">
                            <b>{item.label}</b>
                            <span className="muted">{priceLabel(item)}</span>
                          </span>
                          <button type="button" className="cart-remove" onClick={() => cart.remove(item.id)} aria-label={`Retirer ${item.label} du panier`}>
                            <Icon name="trash" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
                <Link className="link" href="/services/" onClick={close}>
                  <Icon name="plus" /> Ajouter d’autres fonctionnalités
                </Link>
              </div>

              <footer className="cart-foot">
                <p className="cart-total">
                  <span>Estimation de départ</span>
                  <b>{formatPrice(total)}</b>
                </p>
                <p className="cart-note">Prix indicatifs « à partir de ». Votre devis final est établi gratuitement selon votre projet.</p>
                <Link className="btn" href={`/devis/${main ? `?service=${main}` : ''}`} onClick={close}>
                  Valider mon panier <Icon name="arrow" />
                </Link>
                <div className="cart-actions">
                  {wa && (
                    <a className="link" href={wa} target="_blank" rel="noopener noreferrer">
                      <Icon name="whatsapp" /> Envoyer sur WhatsApp<span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  )}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      if (window.confirm('Vider tout le panier ?')) cart.clear();
                    }}
                  >
                    Vider le panier
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
