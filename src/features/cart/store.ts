'use client';

import { useSyncExternalStore } from 'react';

/**
 * Panier du visiteur : liste d'identifiants de fonctionnalités (voir content/features.ts).
 * Conservé dans le navigateur (localStorage) pour suivre le visiteur de page en page,
 * synchronisé entre onglets. Lu via useSyncExternalStore : vide au rendu serveur, sans décalage d'hydratation.
 */
const KEY = 'ktech-panier';
const EMPTY: string[] = [];
const listeners = new Set<() => void>();

let cacheRaw: string | null = null;
let cacheValue: string[] = EMPTY;

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    /* stockage indisponible : on garde la valeur en mémoire */
    return cacheValue;
  }
  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cacheValue = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string').slice(0, 60) : EMPTY;
  } catch {
    cacheValue = EMPTY;
  }
  return cacheValue;
}

function write(next: string[]) {
  cacheValue = next;
  try {
    cacheRaw = JSON.stringify(next);
    localStorage.setItem(KEY, cacheRaw);
  } catch {
    /* le panier vaut pour la page en cours */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

export const cart = {
  add: (id: string) => {
    const cur = read();
    if (!cur.includes(id)) write([...cur, id]);
  },
  remove: (id: string) => write(read().filter((x) => x !== id)),
  toggle: (id: string) => (read().includes(id) ? cart.remove(id) : cart.add(id)),
  clear: () => write([]),
  removeMany: (ids: readonly string[]) => write(read().filter((x) => !ids.includes(x))),
  /** Ouvre le tiroir du panier (écouté par CartButton dans l'en-tête). */
  open: () => window.dispatchEvent(new Event('ktech:open-cart')),
};

export function useCart(): string[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}
