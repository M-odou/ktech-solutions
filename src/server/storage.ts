import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { del, get, put } from '@vercel/blob';
import { env } from '@/server/env';

/**
 * Stockage des fichiers.
 * - `media/`   : fichiers publics (images de réalisations), servis par /media/…
 * - `private/` : documents joints aux demandes, téléchargeables uniquement par l'administration.
 *
 * Deux supports, choisis automatiquement :
 * - avec BLOB_READ_WRITE_TOKEN (Vercel) : Vercel Blob, en accès privé ; les fichiers ne sont lus
 *   que par le serveur (routes /media et /admin/fichiers), jamais exposés par une URL Blob directe ;
 * - sinon : disque local, dans STORAGE_DIR.
 */
const ROOT = path.resolve(env.STORAGE_DIR);
const useBlob = Boolean(env.BLOB_READ_WRITE_TOKEN);

/** Nom du fichier dans Vercel Blob : `media/…` ou `private/…`, sans remontée de dossier. */
function blobPath(bucket: Bucket, relative: string) {
  const clean = path.posix.normalize(relative).replace(/^\/+/, '');
  if (clean.startsWith('..') || clean.includes('/../') || clean === '.') throw new Error('Chemin de fichier invalide');
  return `${bucket}/${clean}`;
}

async function blobWrite(bucket: Bucket, relative: string, data: Buffer | string, contentType: string) {
  await put(blobPath(bucket, relative), data, { access: 'private', contentType, addRandomSuffix: false, allowOverwrite: true });
}
export type Bucket = 'media' | 'private';

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif', 'image/svg+xml': '.svg',
};
const DOC_TYPES: Record<string, string> = {
  ...IMAGE_TYPES,
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/zip': '.zip',
  'text/plain': '.txt',
};
// Les SVG peuvent contenir du script : jamais acceptés depuis les visiteurs.
delete (DOC_TYPES as Record<string, string>)['image/svg+xml'];

export const LIMITS = {
  requestFileMaxBytes: 10 * 1024 * 1024,
  requestMaxFiles: 5,
  imageMaxBytes: 8 * 1024 * 1024,
};

export const ACCEPTED_DOC_TYPES = Object.keys(DOC_TYPES);
export const ACCEPTED_IMAGE_TYPES = Object.keys(IMAGE_TYPES);

/** Résout un chemin relatif en refusant toute sortie du dossier du bucket. */
function resolveSafe(bucket: Bucket, relative: string) {
  const base = path.join(ROOT, bucket);
  const full = path.resolve(base, relative);
  if (!full.startsWith(base + path.sep)) throw new Error('Chemin de fichier invalide');
  return full;
}

export async function saveFile(bucket: Bucket, folder: string, file: File, kind: 'image' | 'document') {
  const types = kind === 'image' ? IMAGE_TYPES : DOC_TYPES;
  const max = kind === 'image' ? LIMITS.imageMaxBytes : LIMITS.requestFileMaxBytes;
  const ext = types[file.type];
  if (!ext) throw new Error(`Type de fichier non accepté : ${file.name}`);
  if (file.size > max) throw new Error(`Fichier trop volumineux : ${file.name}`);
  const relative = path.posix.join(folder, `${randomUUID()}${ext}`);
  if (useBlob) {
    await blobWrite(bucket, relative, Buffer.from(await file.arrayBuffer()), file.type);
    return relative;
  }
  const full = resolveSafe(bucket, relative);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, Buffer.from(await file.arrayBuffer()));
  return relative;
}

export async function writeRaw(bucket: Bucket, relative: string, data: string | Buffer) {
  if (useBlob) {
    await blobWrite(bucket, relative, data, contentTypeFor(relative));
    return relative;
  }
  const full = resolveSafe(bucket, relative);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, data);
  return relative;
}

export async function readStored(bucket: Bucket, relative: string): Promise<Buffer> {
  if (useBlob) {
    const result = await get(blobPath(bucket, relative), { access: 'private' });
    if (!result || result.statusCode !== 200) throw new Error('Fichier introuvable');
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  }
  return readFile(resolveSafe(bucket, relative));
}

export async function deleteStored(bucket: Bucket, relative: string) {
  if (useBlob) {
    await del(blobPath(bucket, relative));
    return;
  }
  await rm(resolveSafe(bucket, relative), { force: true });
}

export function contentTypeFor(file: string) {
  const ext = path.extname(file).toLowerCase();
  return Object.entries(DOC_TYPES).find(([, e]) => e === ext)?.[0] ?? (ext === '.svg' ? 'image/svg+xml' : 'application/octet-stream');
}
