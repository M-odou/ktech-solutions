import { Icon } from '@/components/ui/Icon';
import type { Settings } from '@/content/settings';

const NETWORKS = [
  ['linkedin', 'LinkedIn'],
  ['instagram', 'Instagram'],
  ['facebook', 'Facebook'],
  ['tiktok', 'TikTok'],
] as const;

/** Affiche uniquement les réseaux dont l'URL est renseignée dans le back-office. */
export function Socials({ company }: { company: Settings['company'] }) {
  const links = NETWORKS.filter(([k]) => company[k]);
  if (!links.length) return null;
  return (
    <ul className="socials" aria-label="Réseaux sociaux">
      {links.map(([k, label]) => (
        <li key={k}>
          <a href={company[k]} target="_blank" rel="noopener noreferrer" aria-label={`${label} (nouvel onglet)`}>
            <Icon name={k} />
          </a>
        </li>
      ))}
    </ul>
  );
}
