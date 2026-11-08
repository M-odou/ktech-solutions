'use client';

import { useActionState, useEffect, useRef, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import type { ActionState } from '@/server/actions/types';

/** Formulaire d'administration : action serveur + message de résultat annoncé. */
export function ActionForm({
  action,
  children,
  submitLabel = 'Enregistrer',
  className = 'admin-form',
  resetOnSuccess = false,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      <div className="admin-form-actions">
        <SubmitButton label={submitLabel} />
        <p className={`admin-feedback${state ? (state.ok ? ' ok' : ' ko') : ''}`} role="status" aria-live="polite">
          {state?.message}
        </p>
      </div>
    </form>
  );
}

export function SubmitButton({ label, className = 'btn btn-sm' }: { label: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-disabled={pending}>
      {pending ? 'Enregistrement…' : label}
    </button>
  );
}

/** Bouton de suppression avec confirmation explicite (nomme ce qui sera supprimé). */
export function ConfirmButton({ action, label = 'Supprimer', confirm }: { action: () => Promise<void>; label?: string; confirm: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
    >
      <SubmitDanger label={label} />
    </form>
  );
}

function SubmitDanger({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-sm btn-danger" disabled={pending}>
      {pending ? '…' : label}
    </button>
  );
}
