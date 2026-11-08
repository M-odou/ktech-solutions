'use client';

import { useState } from 'react';

export type GalleryImage = { src: string; alt: string };

/**
 * Galerie intégrée à la page (pas de fenêtre modale) : grande image + vignettes.
 * Vignettes = boutons (clavier), flèches gauche/droite pour naviguer, compteur annoncé.
 */
export function Gallery({ images, title }: { images: GalleryImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  if (!images.length) return null;
  const current = images[index];
  const go = (i: number) => setIndex((i + images.length) % images.length);

  return (
    <div
      className="gallery"
      role="region"
      aria-roledescription="galerie"
      aria-label={`Galerie : ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      <figure className="gallery-main">
        {/* eslint-disable-next-line @next/next/no-img-element -- fichiers servis par /media */}
        <img key={current.src} src={current.src} alt={current.alt || `${title} — visuel ${index + 1}`} decoding="async" />
        {images.length > 1 && (
          <>
            <button type="button" className="gallery-nav prev" aria-label="Visuel précédent" onClick={() => go(index - 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" className="gallery-nav next" aria-label="Visuel suivant" onClick={() => go(index + 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </>
        )}
        <figcaption>
          <span aria-live="polite">
            {index + 1} / {images.length}
          </span>
          {current.alt && <span>{current.alt}</span>}
        </figcaption>
      </figure>
      {images.length > 1 && (
        <ul className="gallery-thumbs">
          {images.map((img, i) => (
            <li key={img.src}>
              <button type="button" aria-label={`Afficher le visuel ${i + 1}${img.alt ? ` : ${img.alt}` : ''}`} aria-current={i === index ? 'true' : undefined} onClick={() => go(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element -- vignette */}
                <img src={img.src} alt="" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
