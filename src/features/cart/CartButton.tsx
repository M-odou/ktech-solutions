'use client';

import { Icon } from '@/components/ui/Icon';
import { cart, useCart } from './store';

/** Accès au chariot depuis l'en-tête (le tiroir est rendu par CartDock). */
export function CartButton() {
  const count = useCart().length;
  return (
    <button
      type="button"
      className="cart-btn"
      data-cart-target
      onClick={cart.open}
      aria-haspopup="dialog"
      aria-label={count ? `Mon chariot, ${count} article${count > 1 ? 's' : ''}` : 'Mon chariot, vide'}
    >
      <Icon name="cart" />
      {count > 0 && (
        <span className="cart-count" aria-hidden="true">
          {count}
        </span>
      )}
    </button>
  );
}
