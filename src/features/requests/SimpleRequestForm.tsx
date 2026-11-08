'use client';

import { useRef, useState } from 'react';
import { ChoiceGroup, ChoicePill } from '@/components/ui/Choice';
import { Field } from '@/components/ui/Field';
import type { FieldErrors } from './schema';
import { submitRequest } from './submit';

/**
 * Formulaire court (demande de formation ou message), enregistré dans le back-office.
 * Validation finale côté serveur (schémas partagés), erreurs affichées sous chaque champ.
 */
export function SimpleRequestForm({ kind, domains = [] }: { kind: 'formation' | 'message'; domains?: string[] }) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [profile, setProfile] = useState('');
  const [chosen, setChosen] = useState<string[]>([]);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const p = kind === 'formation' ? 'f' : 'm';

  const clear = (name: string) => errors[name] && setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== name)));

  if (state === 'done') {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status">
        <h3>Merci, votre {kind === 'formation' ? 'demande' : 'message'} est bien reçu{kind === 'formation' ? 'e' : ''}.</h3>
        <p>
          Référence <b>{reference}</b>. Nous revenons vers vous rapidement.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="form"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        form.set('kind', kind);
        setState('sending');
        const res = await submitRequest(form);
        if (res.ok) {
          setReference(res.reference);
          setState('done');
          requestAnimationFrame(() => successRef.current?.focus());
        } else {
          setErrors(res.errors ?? {});
          setState(res.errors ? 'idle' : 'error');
          const first = res.errors ? Object.keys(res.errors)[0] : null;
          if (first) requestAnimationFrame(() => (formRef.current?.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus());
        }
      }}
    >
      <p className="form-note">Tous les champs sont obligatoires, sauf mention contraire.</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" defaultValue="" />
      <div className="form-row">
        <Field id={`${p}-name`} label="Nom et prénom" invalid={!!errors.name} error={errors.name}>
          {(a) => <input className="input" name="name" autoComplete="name" onChange={() => clear('name')} {...a} />}
        </Field>
        <Field id={`${p}-phone`} label="Téléphone / WhatsApp" hint="Avec l’indicatif, ex. +221 77 000 00 00" invalid={!!errors.phone} error={errors.phone}>
          {(a) => <input className="input" name="phone" type="tel" inputMode="tel" autoComplete="tel" onChange={() => clear('phone')} {...a} />}
        </Field>
      </div>
      <Field id={`${p}-email`} label="E-mail" optional invalid={!!errors.email} error={errors.email}>
        {(a) => <input className="input" name="email" type="email" autoComplete="email" onChange={() => clear('email')} {...a} />}
      </Field>

      {kind === 'formation' && (
        <>
          <ChoiceGroup legend="Vous êtes" error={errors.profile} errorId={`${p}-e-profile`} variant="pills">
            {['Particulier', 'Entrepreneur', 'Entreprise ou organisation'].map((v) => (
              <ChoicePill key={v} type="radio" name="profile" value={v} checked={profile === v} onChange={() => { setProfile(v); clear('profile'); }} label={v} />
            ))}
          </ChoiceGroup>
          {domains.length > 0 && (
            <ChoiceGroup legend="Domaines qui vous intéressent" hint="Facultatif, plusieurs choix possibles." variant="pills">
              {domains.map((d) => (
                <ChoicePill key={d} type="checkbox" name="domains" value={d} checked={chosen.includes(d)} onChange={(on) => setChosen((c) => (on ? [...c, d] : c.filter((x) => x !== d)))} label={d} />
              ))}
            </ChoiceGroup>
          )}
        </>
      )}

      <Field
        id={`${p}-message`}
        label={kind === 'formation' ? 'Votre besoin' : 'Votre message'}
        optional={kind === 'formation'}
        hint={kind === 'formation' ? 'Nombre de participants, niveau, période souhaitée…' : undefined}
        invalid={!!errors.message}
        error={errors.message}
      >
        {(a) => <textarea className="input" name="message" rows={5} onChange={() => clear('message')} {...a} />}
      </Field>

      {state === 'error' && (
        <p className="form-error" role="alert">
          L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez.
        </p>
      )}
      <div>
        <button className="btn" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Envoi…' : 'Envoyer'}
        </button>
      </div>
      <p className="form-note">Vos informations servent uniquement à répondre à votre demande.</p>
    </form>
  );
}
