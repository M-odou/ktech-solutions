'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';
import type { Service } from '@/server/db/schema';

/**
 * « Ce que nous faisons » : la liste des pôles s'allume au fil du défilement
 * (grand écran), avec un aperçu à droite. Survol et focus clavier activent aussi
 * un pôle. Sur mobile, chaque pôle s'affiche simplement avec sa description.
 */
export function ServicesScroller({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const count = services.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(min-width: 1000px)');
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!mq.matches) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const p = Math.min(0.999, Math.max(0, -r.top / span));
      setActive(Math.floor(p * count));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [count]);

  const s = services[active];
  if (!s) return null;

  return (
    <section className="svc-scroll" ref={ref} aria-labelledby="svc-title" style={{ ['--n' as string]: count }}>
      <div className="svc-sticky container">
        <p className="eyebrow">Ce que nous faisons</p>
        <h2 className="sr-only" id="svc-title">
          Nos pôles d’expertise
        </h2>
        <div className="svc-layout">
          <ol className="svc-list">
            {services.map((x, i) => (
              <li key={x.slug} className={i === active ? 'is-active' : undefined}>
                <Link href={`/services/${x.slug}/`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-describedby={`svc-d-${x.slug}`}>
                  {x.shortTitle}
                </Link>
                <p className="svc-desc" id={`svc-d-${x.slug}`}>
                  {x.summary}
                </p>
              </li>
            ))}
          </ol>
          <div className="svc-preview" aria-hidden="true">
            <div className="svc-card" key={s.slug}>
              <div className="svc-card-body">
                <span className="icon">
                  <Icon name={s.icon as IconName} />
                </span>
                <b>{s.title}</b>
                <p>{s.summary}</p>
                <span className="svc-tags">
                  {s.tags.slice(0, 4).map((t) => (
                    <em key={t}>{t}</em>
                  ))}
                </span>
              </div>
            </div>
            <span className="svc-count">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
