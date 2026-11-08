'use client';

import { useActionState, useState } from 'react';
import { login } from '@/server/actions/auth';
import { SubmitButton } from './ActionForm';

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState(login, null);
  // Champ contrôlé : React 19 réinitialise les formulaires après une action, l'e-mail doit rester saisi.
  const [email, setEmail] = useState('');
  return (
    <form action={action} className="form">
      <input type="hidden" name="next" value={next} />
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input className="input" id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe</label>
        <input className="input" id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state && !state.ok && (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      )}
      <SubmitButton label="Se connecter" className="btn" />
    </form>
  );
}
