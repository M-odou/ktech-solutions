'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { CTA, NAV } from '@/config/site';
import { ThemeToggle } from './ThemeToggle';

const isCurrent = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export function Header() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermeture du menu à chaque changement de page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-in">
        <Link className="brand" href="/" aria-label="KTech Solutions, retour à l’accueil">
          <Logo priority />
        </Link>

        <nav className="nav" aria-label="Navigation principale">
          <ul>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <Link className="btn btn-sm btn-cta" href={CTA.href}>
            {CTA.primary}
          </Link>
          <button
            ref={btnRef}
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav id="mobile-nav" className={`mobile-nav${open ? ' open' : ''}`} aria-label="Navigation mobile" inert={!open}>
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
                {item.label}
                <Icon name="arrow" />
              </Link>
            </li>
          ))}
        </ul>
        <Link className="btn" href={CTA.href}>
          {CTA.primary} <Icon name="arrow" />
        </Link>
      </nav>
    </header>
  );
}
