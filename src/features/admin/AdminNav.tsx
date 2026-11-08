'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Tableau de bord', exact: true },
  { href: '/admin/demandes', label: 'Demandes' },
  { href: '/admin/realisations', label: 'Réalisations' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/formations', label: 'Formations' },
  { href: '/admin/faq', label: 'Questions fréquentes' },
  { href: '/admin/contenus', label: 'Textes des pages' },
  { href: '/admin/compte', label: 'Mon compte' },
];

export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname() ?? '';
  return (
    <nav aria-label="Administration">
      <ul className="admin-nav">
        {LINKS.map((l) => {
          const current = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          return (
            <li key={l.href}>
              <Link href={l.href} aria-current={current ? 'page' : undefined}>
                {l.label}
                {l.href === '/admin/demandes' && newCount > 0 && (
                  <span className="badge">
                    {newCount}
                    <span className="sr-only"> nouvelle{newCount > 1 ? 's' : ''}</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
