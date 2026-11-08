import type { RequestKind, RequestStatus } from '@/server/db/schema';

export const STATUS_LABEL: Record<RequestStatus, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  devis_envoye: 'Devis envoyé',
  gagne: 'Gagné',
  perdu: 'Perdu',
  archive: 'Archivé',
};

export const KIND_LABEL: Record<RequestKind, string> = { devis: 'Devis', formation: 'Formation', message: 'Message' };
