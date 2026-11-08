import type { ReactNode } from 'react';

/** Champs d'administration simples, libellés toujours visibles. */
export function TextInput({ name, label, defaultValue, help, required, type = 'text', placeholder }: { name: string; label: string; defaultValue?: string | number; help?: string; required?: boolean; type?: string; placeholder?: string }) {
  const id = `f-${name}`;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {!required && <span className="opt"> (facultatif)</span>}
      </label>
      <input className="input" id={id} name={name} type={type} defaultValue={defaultValue} required={required} placeholder={placeholder} aria-describedby={help ? `${id}-h` : undefined} />
      {help && (
        <span className="hint" id={`${id}-h`}>
          {help}
        </span>
      )}
    </div>
  );
}

export function TextArea({ name, label, defaultValue, help, required, rows = 4 }: { name: string; label: string; defaultValue?: string; help?: string; required?: boolean; rows?: number }) {
  const id = `f-${name}`;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {!required && <span className="opt"> (facultatif)</span>}
      </label>
      <textarea className="input" id={id} name={name} rows={rows} defaultValue={defaultValue} required={required} aria-describedby={help ? `${id}-h` : undefined} />
      {help && (
        <span className="hint" id={`${id}-h`}>
          {help}
        </span>
      )}
    </div>
  );
}

export function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="toggle">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="admin-grid">{children}</div>;
}

export const linesOf = (items: string[]) => items.join('\n');
export const pairsOf = (items: { title: string; text: string }[]) => items.map((p) => `${p.title} | ${p.text}`).join('\n');
