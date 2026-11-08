import type { Metadata } from 'next';
import Link from 'next/link';
import { SECTIONS, type SectionKey } from '@/content/settings';

export const metadata: Metadata = { title: 'Textes des pages' };

export default function SectionsPage() {
  return (
    <>
      <header className="admin-head">
        <h1>Textes des pages</h1>
        <p className="muted">Coordonnées, textes d’accueil, pages Formations, À propos, Contact, devis et mentions légales.</p>
      </header>
      <ul className="section-list">
        {(Object.keys(SECTIONS) as SectionKey[]).map((k) => (
          <li key={k}>
            <Link href={`/admin/contenus/${k}`} className="admin-card link-card">
              <b>{SECTIONS[k].label}</b>
              <span className="muted">{SECTIONS[k].description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
