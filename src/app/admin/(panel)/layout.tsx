import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { AdminNav } from '@/features/admin/AdminNav';
import { logout } from '@/server/actions/auth';
import { requireAdmin } from '@/server/auth/dal';
import { requestStats } from '@/server/queries/requests';

export const metadata: Metadata = { title: { default: 'Administration', template: '%s — Administration' }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const session = await requireAdmin();
  const { byStatus } = await requestStats();

  return (
    <div className="admin">
      <a className="skip" href="#admin-main">
        Aller au contenu
      </a>
      <aside className="admin-side">
        <Link href="/admin" className="admin-brand" aria-label="Tableau de bord">
          <Logo />
        </Link>
        <AdminNav newCount={byStatus.nouveau ?? 0} />
        <div className="admin-side-foot">
          <p>
            Connecté : <b>{session.name}</b>
          </p>
          <div className="admin-side-actions">
            <ThemeToggle />
            <Link className="btn btn-ghost btn-sm" href="/" target="_blank">
              Voir le site<span className="sr-only"> (nouvel onglet)</span>
            </Link>
            <form action={logout}>
              <button type="submit" className="btn btn-ghost btn-sm">
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main id="admin-main" className="admin-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
