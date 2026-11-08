import type { FieldErrors } from './schema';

export type SubmitResult =
  | { ok: true; reference: string; rejected?: string[] }
  | { ok: false; errors?: FieldErrors; error?: string };

/**
 * Envoi d'une demande à /api/demandes.
 * XMLHttpRequest plutôt que fetch : permet d'afficher la progression de l'envoi des fichiers.
 */
export function submitRequest(data: FormData, onProgress?: (percent: number) => void): Promise<SubmitResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/demandes');
    xhr.responseType = 'json';
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const body = xhr.response ?? {};
      if (xhr.status >= 200 && xhr.status < 300 && body.ok) resolve({ ok: true, reference: body.reference, rejected: body.rejected });
      else resolve({ ok: false, errors: body.errors, error: body.error ?? 'L’envoi n’a pas abouti. Réessayez dans un instant.' });
    };
    xhr.onerror = () => resolve({ ok: false, error: 'Connexion interrompue. Vérifiez votre réseau et réessayez.' });
    xhr.send(data);
  });
}
