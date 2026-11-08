'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Progression (0 → 1) d'un élément traversant l'écran ; null si « réduire les animations ». */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height + window.innerHeight;
      setProgress(Math.min(1, Math.max(0, (window.innerHeight - r.top) / total)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { ref, progress };
}

/**
 * Bandeau de mots qui glisse au rythme du défilement (aucun mouvement automatique :
 * pas besoin de bouton pause). La liste reste lisible par les lecteurs d'écran.
 */
export function ScrollMarquee({ items, label }: { items: string[]; label: string }) {
  const { ref, progress } = useScrollProgress<HTMLDivElement>();
  const shift = progress === null ? 0 : -progress * 40;
  return (
    <div className="marquee" ref={ref}>
      <ul className="sr-only" aria-label={label}>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      <div className="marquee-track" aria-hidden="true" style={{ transform: `translateX(${shift}%)` }}>
        {[...items, ...items, ...items].map((i, n) => (
          <span key={n}>
            {i}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Galerie en orbite : les visuels des réalisations tournent autour du titre pendant le défilement.
 * Décorative ; le titre central porte le lien vers les réalisations.
 */
export function OrbitGallery({ images, children }: { images: string[]; children: ReactNode }) {
  const { ref, progress } = useScrollProgress<HTMLElement>();
  const rot = progress === null ? 0 : progress * 140 - 40;
  const n = images.length || 1;
  return (
    <section className="orbit" ref={ref} aria-labelledby="orbit-title">
      <div className="orbit-stage">
        <div className="orbit-ring" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
          {images.map((src, i) => (
            <div
              key={src}
              className="orbit-item"
              style={{ transform: `rotate(${(360 / n) * i}deg) translateY(calc(var(--orbit-r) * -1)) rotate(${-(360 / n) * i - rot}deg)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- visuels décoratifs servis par /media */}
              <img src={src} alt="" loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className="orbit-center">{children}</div>
      </div>
    </section>
  );
}
