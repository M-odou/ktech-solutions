import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { LoginForm } from '@/features/admin/LoginForm';
import { getSession } from '@/server/auth/dal';

export const metadata: Metadata = { title: 'Connexion — Administration', robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  if (await getSession()) redirect('/admin');
  const { next } = await searchParams;
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <Logo priority />
        <h1>Administration</h1>
        <p className="muted">Connectez-vous pour gérer le contenu du site et suivre les demandes.</p>
        <LoginForm next={typeof next === 'string' ? next : ''} />
      </div>
    </main>
  );
}
