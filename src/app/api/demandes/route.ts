import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { messageSchema, quoteSchema, toFieldErrors, trainingSchema } from '@/features/requests/schema';
import { getServices } from '@/server/queries/content';
import { addRequestFile, createRequest } from '@/server/queries/requests';
import { LIMITS, saveFile } from '@/server/storage';

/**
 * Réception des demandes du site (devis, formation, message).
 * Route Handler plutôt que Server Action : accepte des pièces jointes jusqu'à 5 × 10 Mo.
 */
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  // Champ piège invisible : les robots le remplissent, les humains non.
  if (String(form.get('website') ?? '') !== '') return NextResponse.json({ ok: true, reference: '—' });

  const kind = String(form.get('kind') ?? '');
  const raw = Object.fromEntries([...form.keys()].map((k) => [k, form.getAll(k).length > 1 ? form.getAll(k) : form.get(k)]));
  const arr = (k: string) => form.getAll(k).map(String).filter(Boolean);

  try {
    if (kind === 'devis') {
      const parsed = quoteSchema.safeParse({ ...raw, projectTypes: arr('projectTypes'), goals: arr('goals') });
      if (!parsed.success) return NextResponse.json({ errors: toFieldErrors(parsed.error) }, { status: 422 });

      const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
      if (files.length > LIMITS.requestMaxFiles) {
        return NextResponse.json({ errors: { files: `${LIMITS.requestMaxFiles} fichiers maximum.` } }, { status: 422 });
      }

      const v = parsed.data;
      const services = await getServices();
      const serviceLabel = services.find((s) => s.slug === v.service)?.title ?? 'Autre / à définir';
      const request = await createRequest({
        kind: 'devis',
        subject: serviceLabel,
        details: {
          Service: serviceLabel,
          'Types de projet': v.projectTypes,
          'Description du projet': v.description,
          Objectifs: v.goals,
          Budget: v.budget,
          Délai: v.timeline,
        },
        name: v.name,
        phone: v.phone,
        email: v.email,
        company: v.company,
        contactPreference: v.contactPreference,
      });

      const rejected: string[] = [];
      for (const file of files) {
        try {
          const storedPath = await saveFile('private', `requests/${request.reference}`, file, 'document');
          await addRequestFile(request.id, { originalName: file.name.slice(0, 200), storedPath, mime: file.type, size: file.size });
        } catch {
          rejected.push(file.name);
        }
      }
      revalidatePath('/admin', 'layout');
      return NextResponse.json({ ok: true, reference: request.reference, rejected });
    }

    if (kind === 'formation') {
      const parsed = trainingSchema.safeParse({ ...raw, domains: arr('domains') });
      if (!parsed.success) return NextResponse.json({ errors: toFieldErrors(parsed.error) }, { status: 422 });
      const v = parsed.data;
      const request = await createRequest({
        kind: 'formation',
        subject: v.domains.length ? `Formation : ${v.domains.join(', ')}` : 'Demande de programme de formation',
        details: { Profil: v.profile, Domaines: v.domains, Besoin: v.message },
        name: v.name,
        phone: v.phone,
        email: v.email,
      });
      revalidatePath('/admin', 'layout');
      return NextResponse.json({ ok: true, reference: request.reference });
    }

    if (kind === 'message') {
      const parsed = messageSchema.safeParse(raw);
      if (!parsed.success) return NextResponse.json({ errors: toFieldErrors(parsed.error) }, { status: 422 });
      const v = parsed.data;
      const request = await createRequest({
        kind: 'message',
        subject: 'Message depuis la page Contact',
        details: { Message: v.message },
        name: v.name,
        phone: v.phone,
        email: v.email,
      });
      revalidatePath('/admin', 'layout');
      return NextResponse.json({ ok: true, reference: request.reference });
    }

    return NextResponse.json({ error: 'Type de demande inconnu.' }, { status: 400 });
  } catch (e) {
    console.error('[demandes] échec d’enregistrement', e);
    return NextResponse.json({ error: 'Enregistrement impossible pour le moment.' }, { status: 500 });
  }
}
