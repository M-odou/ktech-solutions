'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Apparition douce des blocs `.reveal` au défilement.
 * Sans JavaScript ou avec « réduire les animations », le contenu reste visible.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    root.classList.add('js-reveal');
    const items = document.querySelectorAll<HTMLElement>('.reveal:not(.in)');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
