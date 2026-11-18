'use client';

/**
 * Animation « l'article tombe dans le chariot » : une copie de l'icône vole
 * de la carte jusqu'au chariot visible (flottant, sinon celui de l'en-tête).
 * Désactivée si l'utilisateur préfère réduire les animations.
 */
export function flyToCart(from: Element | null | undefined) {
  if (!from) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.dispatchEvent(new Event('ktech:cart-bump'));
    return;
  }
  // On attend le rendu suivant : le chariot flottant peut apparaître avec le premier article.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      // Le chariot de l'allée ou le chariot flottant d'abord, celui de l'en-tête sinon.
      const targets = [...document.querySelectorAll<HTMLElement>('[data-cart-target]')].sort(
        (x, y) => Number(Boolean(x.closest('.header'))) - Number(Boolean(y.closest('.header'))),
      );
      const target = targets.find((t) => {
        const r = t.getBoundingClientRect();
        return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight;
      });
      if (!target) return;
      const a = from.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const ghost = from.cloneNode(true) as HTMLElement;
      ghost.classList.add('fly-ghost');
      ghost.setAttribute('aria-hidden', 'true');
      Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
      document.body.appendChild(ghost);
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const anim = ghost.animate(
        [
          { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 90}px) scale(.85) rotate(-12deg)`, opacity: 1, offset: 0.45 },
          { transform: `translate(${dx}px, ${dy}px) scale(.3) rotate(8deg)`, opacity: 0.2 },
        ],
        { duration: 750, easing: 'cubic-bezier(.45, 0, .55, 1)' },
      );
      const done = () => {
        ghost.remove();
        window.dispatchEvent(new Event('ktech:cart-bump'));
      };
      anim.onfinish = done;
      anim.oncancel = done;
    }),
  );
}
