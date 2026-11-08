import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { CTA } from '@/config/site';

export default function NotFound() {
  return (
    <main className="notfound container">
      <Link href="/" aria-label="KTech Solutions, retour à l’accueil" className="notfound-logo">
        <Logo />
      </Link>
      <p className="eyebrow">Erreur 404</p>
      <h1 className="h1">Cette page est introuvable.</h1>
      <p className="lead">Elle a peut-être été déplacée. Revenez à l’accueil ou parlez-nous directement de votre projet.</p>
      <div className="btns">
        <Link className="btn" href="/">
          Retour à l’accueil
        </Link>
        <Link className="btn btn-ghost" href={CTA.href}>
          {CTA.primary}
        </Link>
      </div>
    </main>
  );
}
