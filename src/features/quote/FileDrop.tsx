'use client';

import { useId, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { formatBytes } from '@/lib/format';

export const MAX_FILES = 5;
export const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png,.webp';
const ALLOWED_EXT = ACCEPT.split(',');

/** Zone de dépôt : glisser-déposer ou parcourir, avec contrôles immédiats et retrait possible. */
export function FileDrop({ files, onChange }: { files: File[]; onChange: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const hintId = useId();

  const add = (list: FileList | null) => {
    if (!list) return;
    const issues: string[] = [];
    const next = [...files];
    for (const f of Array.from(list)) {
      const ext = '.' + (f.name.split('.').pop() ?? '').toLowerCase();
      if (!ALLOWED_EXT.includes(ext)) issues.push(`« ${f.name} » : format non accepté.`);
      else if (f.size > MAX_SIZE) issues.push(`« ${f.name} » : dépasse 10 Mo.`);
      else if (next.length >= MAX_FILES) issues.push(`« ${f.name} » : ${MAX_FILES} fichiers maximum.`);
      else if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    setProblems(issues);
    onChange(next);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="filedrop-wrap">
      <div
        className={`filedrop${over ? ' over' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
      >
        <span className="icon">
          <Icon name="layers" />
        </span>
        <p>
          <b>Glissez vos fichiers ici</b> ou
        </p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => inputRef.current?.click()} aria-describedby={hintId}>
          Parcourir mes fichiers
        </button>
        <input ref={inputRef} type="file" multiple accept={ACCEPT} className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => add(e.target.files)} />
        <p className="hint" id={hintId}>
          Cahier des charges, logo, photos, exemples… PDF, Word, Excel, PowerPoint, images ou ZIP — {MAX_FILES} fichiers, 10 Mo chacun.
        </p>
      </div>

      {problems.length > 0 && (
        <ul className="form-error" role="alert">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="file-list" aria-label="Fichiers sélectionnés">
          {files.map((f, i) => (
            <li key={f.name + f.size}>
              <span className="file-name">{f.name}</span>
              <span className="file-size">{formatBytes(f.size)}</span>
              <button type="button" className="link-btn" onClick={() => onChange(files.filter((_, j) => j !== i))} aria-label={`Retirer ${f.name}`}>
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
