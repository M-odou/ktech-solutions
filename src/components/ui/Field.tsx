import type { ReactNode } from 'react';

/**
 * Champ accessible : libellé toujours visible, aide et erreur reliées
 * au contrôle par aria-describedby, état aria-invalid.
 */
export function Field({
  id,
  label,
  optional,
  hint,
  error,
  invalid,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  invalid?: boolean;
  children: (a11y: { id: string; 'aria-invalid'?: true; 'aria-describedby'?: string }) => ReactNode;
}) {
  const describedBy = [hint && `${id}-hint`, invalid && error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${invalid ? ' invalid' : ''}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="opt"> (facultatif)</span>}
      </label>
      {children({ id, 'aria-invalid': invalid ? true : undefined, 'aria-describedby': describedBy })}
      {hint && (
        <span className="hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {invalid && error && (
        <span className="error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
