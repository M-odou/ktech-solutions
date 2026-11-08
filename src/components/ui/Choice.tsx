import type { ReactNode } from 'react';

/**
 * Groupe de choix accessible (fieldset + legend), en cartes ou en pastilles.
 * Les contrôles natifs (radio / checkbox) assurent clavier et lecteurs d'écran.
 */
export function ChoiceGroup({
  legend,
  hint,
  error,
  errorId,
  variant = 'cards',
  children,
}: {
  legend: ReactNode;
  hint?: string;
  error?: string;
  errorId?: string;
  variant?: 'cards' | 'pills';
  children: ReactNode;
}) {
  return (
    <fieldset className={`choice-group${error ? ' invalid' : ''}`} aria-describedby={error ? errorId : undefined}>
      <legend>{legend}</legend>
      {hint && <p className="hint">{hint}</p>}
      <div className={variant === 'cards' ? 'choice-cards' : 'choices'}>{children}</div>
      {error && (
        <p className="error" id={errorId}>
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ChoiceCard({
  type,
  name,
  value,
  checked,
  onChange,
  title,
  text,
  icon,
}: {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  text?: string;
  icon?: ReactNode;
}) {
  return (
    <label className="choice-card">
      <input type={type} name={name} value={value} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="choice-card-body">
        {icon && <span className="icon">{icon}</span>}
        <span className="choice-card-title">{title}</span>
        {text && <span className="choice-card-text">{text}</span>}
      </span>
    </label>
  );
}

export function ChoicePill({
  type,
  name,
  value,
  checked,
  onChange,
  label,
}: {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="choice">
      <input type={type} name={name} value={value} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
