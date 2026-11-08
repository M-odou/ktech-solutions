'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

const read = (): Theme => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
};

/** Bascule clair / sombre, mémorisée dans le navigateur. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, read, () => 'dark' as Theme);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={next === 'light' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={next === 'light' ? 'Mode clair' : 'Mode sombre'}
      onClick={() => {
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem('theme', next);
        } catch {
          /* stockage indisponible : le choix vaut pour la session */
        }
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {theme === 'dark' ? (
          <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
          </g>
        ) : (
          <path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8Z" />
        )}
      </svg>
    </button>
  );
}
