import type { Metadata } from 'next';
import { ActionForm } from '@/features/admin/ActionForm';
import { changePassword } from '@/server/actions/auth';

export const metadata: Metadata = { title: 'Mon compte' };

export default function AccountPage() {
  return (
    <>
      <header className="admin-head">
        <h1>Mon compte</h1>
        <p className="muted">Changez votre mot de passe. Pour ajouter un administrateur : npm run admin:create.</p>
      </header>
      <section className="admin-card narrow" aria-labelledby="pw-title">
        <h2 id="pw-title">Mot de passe</h2>
        <ActionForm action={changePassword} submitLabel="Changer le mot de passe" resetOnSuccess>
          <div className="field">
            <label htmlFor="current">Mot de passe actuel</label>
            <input className="input" id="current" name="current" type="password" autoComplete="current-password" required />
          </div>
          <div className="field">
            <label htmlFor="next">Nouveau mot de passe</label>
            <input className="input" id="next" name="next" type="password" autoComplete="new-password" minLength={10} required aria-describedby="next-h" />
            <span className="hint" id="next-h">
              10 caractères minimum.
            </span>
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirmer le nouveau mot de passe</label>
            <input className="input" id="confirm" name="confirm" type="password" autoComplete="new-password" required />
          </div>
        </ActionForm>
      </section>
    </>
  );
}
