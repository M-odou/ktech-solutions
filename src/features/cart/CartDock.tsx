'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cartTotal, formatPrice, priceLabel, resolveCart } from '@/content/features';
import { whatsappUrl } from '@/lib/format';
import { cart, useCart } from './store';

export type CartService = { slug: string; shortTitle: string; icon: string };

/** Vrai sur la page « supermarché » (/services/), qui affiche sa propre allée vers la caisse. */
export const isMarketPage = (pathname: string) => pathname === '/services' || pathname === '/services/';

/**
 * Le chariot qui suit le visiteur (flottant en bas de l'écran) et son contenu :
 * un seul chariot pour tout le magasin, rangé par rayon (service), puis la caisse (/devis/).
 */
export function CartDock({ services, whatsapp }: { services: CartService[]; whatsapp: string }) {
  const lines = resolveCart(useCart());
  const count = lines.length;
  const total = cartTotal(lines);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bump, setBump] = useState(0);
  const pathname = usePathname() ?? '/';

  const open = () => dialogRef.current?.showModal();
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    const onBump = () => setBump((n) => n + 1);
    window.addEventListener('ktech:open-cart', open);
    window.addEventListener('ktech:cart-bump', onBump);
    return () => {
      window.removeEventListener('ktech:open-cart', open);
      window.removeEventListener('ktech:cart-bump', onBump);
    };
  }, []);

  useEffect(() => close(), [pathname]);

  const aisles = services
    .map((s) => {
      const items = lines.filter((l) => l.service === s.slug);
      return { ...s, items, total: cartTotal(items) };
    })
    .filter((g) => g.items.length > 0);

  const waText = [
    'Bonjour KTech Solutions, voici mon chariot :',
    ...aisles.flatMap((g) => [`\n${g.shortTitle} :`, ...g.items.map((i) => `• ${i.label}`)]),
    `\nEstimation de départ : ${formatPrice(total)}`,
  ].join('\n');
  const wa = count ? whatsappUrl(whatsapp, waText) : null;

  // Masqué au supermarché (allée dédiée) et à la caisse (le devis affiche le chariot).
  const visible = count > 0 && !isMarketPage(pathname) && !pathname.startsWith('/devis');
  const lastIcons = lines.slice(-4);

  return (
    <>
      {visible && (
        <aside className="chariot-dock" aria-label="Mon chariot">
          <button type="button" className="chariot" onClick={open} aria-haspopup="dialog">
            <span className="chariot-cart" data-cart-target key={`b${bump}`}>
              <Icon name="cart" />
              <span className="cart-count" aria-hidden="true">
                {count}
              </span>
            </span>
            <span className="chariot-goods" aria-hidden="true">
              {lastIcons.map((l) => (
                <span key={l.id} className="chariot-good">
                  <Icon name={l.icon} />
                </span>
              ))}
              {count > lastIcons.length && <span className="chariot-more">+{count - lastIcons.length}</span>}
            </span>
            <span className="chariot-text">
              <b>
                Mon chariot · {count} article{count > 1 ? 's' : ''}
              </b>
              <span>{total ? `dès ${formatPrice(total)}` : 'Sur devis'}</span>
            </span>
          </button>
        </aside>
      )}

      <dialog
        ref={dialogRef}
        className="cart-drawer"
        aria-labelledby="cart-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="cart-in">
          <header className="cart-head">
            <h2 id="cart-title">
              <Icon name="cart" /> Mon chariot {count > 0 && <span className="muted">({count})</span>}
            </h2>
            <button type="button" className="theme-toggle" onClick={close} aria-label="Fermer">
              <Icon name="close" />
            </button>
          </header>

          {count === 0 ? (
            <div className="cart-empty">
              <span className="chariot-illu" aria-hidden="true">
                <Icon name="cart" />
              </span>
              <p>
                <b>Votre chariot est vide.</b>
              </p>
              <p className="muted">Entrez dans nos rayons, prenez les services et les livrables qu’il vous faut, puis passez à la caisse.</p>
              <Link className="btn btn-sm" href="/services/" onClick={close}>
                Entrer dans le magasin <Icon name="arrow" />
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-body">
                {aisles.map((g) => (
                  <section key={g.slug} className="chariot-card" aria-labelledby={`rayon-${g.slug}`}>
                    <header>
                      <span className="icon">
                        <Icon name={g.icon as IconName} />
                      </span>
                      <div>
                        <h3 id={`rayon-${g.slug}`}>Rayon {g.shortTitle}</h3>
                        <p className="muted">
                          {g.items.length} article{g.items.length > 1 ? 's' : ''}
                          {g.total ? ` · dès ${formatPrice(g.total)}` : ''}
                        </p>
                      </div>
                      <Link className="link chariot-card-more" href={`/services/?service=${g.slug}`} onClick={close}>
                        <Icon name="plus" />
                        <span className="sr-only">Ajouter des articles du rayon {g.shortTitle}</span>
                      </Link>
                    </header>
                    <ul>
                      {g.items.map((item) => (
                        <li key={item.id}>
                          <span className="good-icon" aria-hidden="true">
                            <Icon name={item.icon} />
                          </span>
                          <span className="cart-line">
                            <b>{item.label}</b>
                            <span className="muted">{priceLabel(item)}</span>
                          </span>
                          <button type="button" className="cart-remove" onClick={() => cart.remove(item.id)} aria-label={`Retirer ${item.label}`}>
                            <Icon name="trash" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
                <Link className="link" href="/services/" onClick={close}>
                  <Icon name="bag" /> Continuer mes courses
                </Link>
              </div>

              <footer className="cart-foot">
                <p className="cart-total">
                  <span>
                    Total de départ · {aisles.length} service{aisles.length > 1 ? 's' : ''}
                  </span>
                  <b>{total ? formatPrice(total) : 'Sur devis'}</b>
                </p>
                <p className="cart-note">Prix indicatifs « à partir de ». À la caisse, rien n’est payé : vous recevez un devis gratuit et détaillé.</p>
                <Link className="btn" href="/devis/" onClick={close}>
                  <Icon name="cart" /> Passer à la caisse <Icon name="arrow" />
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
                      if (window.confirm('Vider tout le chariot ?')) cart.clear();
                    }}
                  >
                    Vider le chariot
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
