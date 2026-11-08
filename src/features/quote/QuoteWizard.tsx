'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ChoiceCard, ChoiceGroup, ChoicePill } from '@/components/ui/Choice';
import { Field } from '@/components/ui/Field';
import { Icon, type IconName } from '@/components/ui/Icon';
import { formatBytes, whatsappUrl } from '@/lib/format';
import { BUDGETS, CONTACT_PREFS, GOALS, quoteSchema, TIMELINES, toFieldErrors, type FieldErrors } from '../requests/schema';
import { submitRequest } from '../requests/submit';
import { FileDrop } from './FileDrop';

export type QuoteService = { slug: string; title: string; shortTitle: string; summary: string; icon: string; offers: string[] };

type Data = {
  service: string;
  projectTypes: string[];
  description: string;
  goals: string[];
  budget: string;
  timeline: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  contactPreference: string;
  consent: boolean;
};

const EMPTY: Data = {
  service: '', projectTypes: [], description: '', goals: [], budget: '', timeline: '',
  name: '', phone: '', email: '', company: '', contactPreference: 'WhatsApp', consent: false,
};

const STEPS = [
  { title: 'Votre besoin', fields: ['service'] },
  { title: 'Votre projet', fields: ['projectTypes', 'description', 'goals'] },
  { title: 'Budget et délais', fields: ['budget', 'timeline'] },
  { title: 'Documents', fields: [] },
  { title: 'Vos coordonnées', fields: ['name', 'phone', 'email', 'company', 'contactPreference'] },
  { title: 'Récapitulatif', fields: ['consent'] },
] as const;

const DRAFT_KEY = 'ktech-devis-brouillon';
const LABELS: Record<string, string> = {
  service: 'Service', description: 'Description du projet', budget: 'Budget', timeline: 'Délai', name: 'Nom', phone: 'Téléphone',
  email: 'E-mail', contactPreference: 'Moyen de contact', consent: 'Consentement', files: 'Documents',
};

/** Erreurs de l'étape courante, avec les messages du schéma partagé client/serveur. */
function validateStep(step: number, data: Data): FieldErrors {
  const parsed = quoteSchema.safeParse({ ...data, consent: data.consent ? 'on' : '' });
  if (parsed.success) return {};
  const all = toFieldErrors(parsed.error);
  const fields: readonly string[] = STEPS[step].fields;
  return Object.fromEntries(Object.entries(all).filter(([k]) => fields.includes(k)));
}

// Brouillon (sans les fichiers) : lu via useSyncExternalStore pour éviter tout décalage d'hydratation.
const readDraft = () => {
  try {
    return sessionStorage.getItem(DRAFT_KEY);
  } catch {
    return null;
  }
};
const noopSubscribe = () => () => {};

export function QuoteWizard({
  services,
  initialService,
  whatsapp,
  successText,
}: {
  services: QuoteService[];
  initialService?: string;
  whatsapp: string;
  successText: string;
}) {
  const valid = initialService && services.some((s) => s.slug === initialService) ? initialService : '';
  const [data, setData] = useState<Data>({ ...EMPTY, service: valid });
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState(valid ? 1 : 0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState<number | null>(null);
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState<{ reference: string; rejected?: string[] } | null>(null);
  const [draftDismissed, setDraftDismissed] = useState(false);
  const draft = useSyncExternalStore(noopSubscribe, readDraft, () => null);
  const [edited, setEdited] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const service = services.find((s) => s.slug === data.service);
  const set = <K extends keyof Data>(key: K, value: Data[K]) => {
    setEdited(true);
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== key)));
  };
  const toggle = (key: 'projectTypes' | 'goals', value: string, on: boolean) =>
    set(key, on ? [...data[key], value] : data[key].filter((v) => v !== value));

  // Sauvegarde du brouillon à chaque modification.
  useEffect(() => {
    if (!edited || done) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ data: { ...data, consent: false }, step: Math.min(step, 4) }));
    } catch {
      /* stockage indisponible */
    }
  }, [data, step, done, edited]);

  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus());

  const goTo = (target: number) => {
    setErrors({});
    setServerError('');
    setStep(target);
    focusHeading();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => {
    const e = validateStep(step, data);
    if (Object.keys(e).length) {
      setErrors(e);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    goTo(step + 1);
  };

  const submit = async () => {
    const e = validateStep(5, data);
    if (Object.keys(e).length) {
      setErrors(e);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    const form = new FormData();
    form.set('kind', 'devis');
    form.set('website', '');
    for (const [k, v] of Object.entries(data)) {
      if (Array.isArray(v)) v.forEach((x) => form.append(k, x));
      else if (k === 'consent') form.set(k, v ? 'on' : '');
      else form.set(k, String(v));
    }
    files.forEach((f) => form.append('files', f));
    setServerError('');
    setSending(0);
    const res = await submitRequest(form, setSending);
    setSending(null);
    if (res.ok) {
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* rien */
      }
      setDone({ reference: res.reference, rejected: res.rejected });
      requestAnimationFrame(() => doneRef.current?.focus());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (res.errors) {
      setErrors(res.errors);
      const firstStep = STEPS.findIndex((s) => (s.fields as readonly string[]).some((f) => res.errors?.[f]));
      if (firstStep >= 0 && firstStep !== step) setStep(firstStep);
      requestAnimationFrame(() => summaryRef.current?.focus());
    } else setServerError(res.error ?? 'L’envoi n’a pas abouti.');
  };

  if (done) {
    const wa = whatsappUrl(whatsapp, `Bonjour KTech Solutions, je viens d’envoyer ma demande de devis ${done.reference}.`);
    return (
      <div className="wizard-done" ref={doneRef} tabIndex={-1} role="status">
        <span className="done-badge" aria-hidden="true">
          <Icon name="check" />
        </span>
        <h2>Merci {data.name.split(' ')[0]}, votre demande est bien envoyée.</h2>
        <p className="done-ref">
          Référence : <b>{done.reference}</b>
        </p>
        <p className="lead">{successText}</p>
        {done.rejected && done.rejected.length > 0 && (
          <p className="form-error">Certains fichiers n’ont pas pu être joints : {done.rejected.join(', ')}. Vous pourrez nous les transmettre lors de notre échange.</p>
        )}
        <ol className="done-steps">
          <li>
            <b>Étude de votre demande</b>Notre équipe analyse votre besoin et vos documents.
          </li>
          <li>
            <b>Premier échange</b>Nous vous contactons par {data.contactPreference.toLowerCase()} pour préciser les détails.
          </li>
          <li>
            <b>Proposition</b>Vous recevez une proposition claire, adaptée à votre budget.
          </li>
        </ol>
        <div className="btns">
          {wa && (
            <a className="btn" href={wa} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> Suivre sur WhatsApp<span className="sr-only"> (nouvel onglet)</span>
            </a>
          )}
          <Link className="btn btn-ghost" href="/realisations/">
            Voir nos réalisations
          </Link>
        </div>
      </div>
    );
  }

  const errorEntries = Object.entries(errors);
  const progress = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="wizard">
      {draft && !draftDismissed && !edited && (
        <div className="draft-banner" role="region" aria-label="Demande en cours">
          <p>Vous avez une demande en cours. Voulez-vous la reprendre ?</p>
          <div className="btns">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                try {
                  const saved = JSON.parse(draft) as { data: Data; step: number };
                  setEdited(true);
                  setData({ ...EMPTY, ...saved.data, consent: false });
                  setDraftDismissed(true);
                  goTo(saved.step ?? 0);
                } catch {
                  setDraftDismissed(true);
                }
              }}
            >
              Reprendre
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                try {
                  sessionStorage.removeItem(DRAFT_KEY);
                } catch {
                  /* rien */
                }
                setDraftDismissed(true);
              }}
            >
              Recommencer
            </button>
          </div>
        </div>
      )}

      <div className="wizard-progress">
        <p>
          Étape {step + 1} sur {STEPS.length} · <b>{STEPS[step].title}</b>
        </p>
        <div className="bar" role="progressbar" aria-label="Avancement de la demande" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
          <i style={{ width: `${Math.max(progress, 4)}%` }} />
        </div>
        <ol className="wizard-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} aria-current={i === step ? 'step' : undefined} className={i < step ? 'done' : undefined}>
              {i < step ? (
                <button type="button" onClick={() => goTo(i)}>
                  <span aria-hidden="true">{i + 1}</span> {s.title}
                  <span className="sr-only"> (terminée, modifier)</span>
                </button>
              ) : (
                <span>
                  <span aria-hidden="true">{i + 1}</span> {s.title}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <form
        className="wizard-panel"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step === STEPS.length - 1) void submit();
          else next();
        }}
      >
        <h2 ref={headingRef} tabIndex={-1} className="wizard-title">
          {[
            'Quel est votre besoin ?',
            service ? `Parlez-nous de votre projet — ${service.shortTitle}` : 'Parlez-nous de votre projet',
            'Quel cadre pour ce projet ?',
            'Avez-vous des documents à partager ?',
            'Comment vous recontacter ?',
            'Vérifiez votre demande avant l’envoi',
          ][step]}
        </h2>

        {errorEntries.length > 0 && (
          <div className="error-summary" ref={summaryRef} tabIndex={-1} role="alert">
            <p>
              <b>Quelques informations à compléter :</b>
            </p>
            <ul>
              {errorEntries.map(([k, msg]) => (
                <li key={k}>
                  <a href={`#q-${k}`}>{LABELS[k] ? `${LABELS[k]} : ` : ''}{msg}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Champ piège anti-robots, invisible et ignoré des lecteurs d'écran */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" defaultValue="" />

        {step === 0 && (
          <ChoiceGroup legend={<span id="q-service">Choisissez le domaine qui correspond le mieux à votre projet.</span>} error={errors.service} errorId="e-service">
            {services.map((s) => (
              <ChoiceCard
                key={s.slug}
                type="radio"
                name="service"
                value={s.slug}
                checked={data.service === s.slug}
                onChange={() => {
                  if (data.service !== s.slug) set('projectTypes', []);
                  set('service', s.slug);
                }}
                title={s.title}
                text={s.summary}
                icon={<Icon name={s.icon as IconName} />}
              />
            ))}
            <ChoiceCard
              type="radio"
              name="service"
              value="autre"
              checked={data.service === 'autre'}
              onChange={() => {
                set('projectTypes', []);
                set('service', 'autre');
              }}
              title="Autre / je ne sais pas encore"
              text="Décrivez votre idée, nous vous orientons vers la bonne solution."
              icon={<Icon name="compass" />}
            />
          </ChoiceGroup>
        )}

        {step === 1 && (
          <div className="wizard-fields">
            {service && service.offers.length > 0 && (
              <ChoiceGroup legend="Qu’est-ce qui vous intéresse ?" hint="Plusieurs choix possibles (facultatif)." variant="pills">
                {service.offers.map((o) => (
                  <ChoicePill key={o} type="checkbox" name="projectTypes" value={o} checked={data.projectTypes.includes(o)} onChange={(on) => toggle('projectTypes', o, on)} label={o} />
                ))}
              </ChoiceGroup>
            )}
            <Field id="q-description" label="Décrivez votre projet" hint="Votre activité, ce que vous souhaitez obtenir, ce qui existe déjà… Quelques phrases suffisent." invalid={!!errors.description} error={errors.description}>
              {(a) => (
                <>
                  <textarea className="input" rows={6} value={data.description} onChange={(e) => set('description', e.target.value)} maxLength={4000} {...a} />
                  <span className="counter" aria-live="polite">
                    {data.description.trim().length < 20 ? `Encore ${20 - data.description.trim().length} caractères minimum` : `${data.description.length} / 4000`}
                  </span>
                </>
              )}
            </Field>
            <ChoiceGroup legend="Vos objectifs principaux" hint="Facultatif — cela nous aide à proposer la bonne approche." variant="pills">
              {GOALS.map((g) => (
                <ChoicePill key={g} type="checkbox" name="goals" value={g} checked={data.goals.includes(g)} onChange={(on) => toggle('goals', g, on)} label={g} />
              ))}
            </ChoiceGroup>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-fields">
            <ChoiceGroup legend={<span id="q-budget">Votre budget indicatif</span>} hint="Une fourchette suffit : elle nous permet de proposer une solution réaliste." error={errors.budget} errorId="e-budget" variant="pills">
              {BUDGETS.map((b) => (
                <ChoicePill key={b} type="radio" name="budget" value={b} checked={data.budget === b} onChange={() => set('budget', b)} label={b} />
              ))}
            </ChoiceGroup>
            <ChoiceGroup legend={<span id="q-timeline">Pour quand ?</span>} error={errors.timeline} errorId="e-timeline" variant="pills">
              {TIMELINES.map((t) => (
                <ChoicePill key={t} type="radio" name="timeline" value={t} checked={data.timeline === t} onChange={() => set('timeline', t)} label={t} />
              ))}
            </ChoiceGroup>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-fields">
            <p className="muted">
              Facultatif. Un cahier des charges, votre logo, des photos ou des exemples qui vous plaisent nous aident à mieux comprendre votre projet.
            </p>
            <FileDrop files={files} onChange={setFiles} />
          </div>
        )}

        {step === 4 && (
          <div className="wizard-fields">
            <div className="form-row">
              <Field id="q-name" label="Nom et prénom" invalid={!!errors.name} error={errors.name}>
                {(a) => <input className="input" autoComplete="name" value={data.name} onChange={(e) => set('name', e.target.value)} {...a} />}
              </Field>
              <Field id="q-phone" label="Téléphone / WhatsApp" hint="Avec l’indicatif, ex. +221 77 000 00 00" invalid={!!errors.phone} error={errors.phone}>
                {(a) => <input className="input" type="tel" inputMode="tel" autoComplete="tel" value={data.phone} onChange={(e) => set('phone', e.target.value)} {...a} />}
              </Field>
            </div>
            <div className="form-row">
              <Field id="q-email" label="E-mail" optional={data.contactPreference !== 'E-mail'} invalid={!!errors.email} error={errors.email}>
                {(a) => <input className="input" type="email" autoComplete="email" value={data.email} onChange={(e) => set('email', e.target.value)} {...a} />}
              </Field>
              <Field id="q-company" label="Entreprise ou organisation" optional>
                {(a) => <input className="input" autoComplete="organization" value={data.company} onChange={(e) => set('company', e.target.value)} {...a} />}
              </Field>
            </div>
            <ChoiceGroup legend={<span id="q-contactPreference">Comment préférez-vous être recontacté ?</span>} error={errors.contactPreference} errorId="e-contactPreference" variant="pills">
              {CONTACT_PREFS.map((c) => (
                <ChoicePill key={c} type="radio" name="contactPreference" value={c} checked={data.contactPreference === c} onChange={() => set('contactPreference', c)} label={c} />
              ))}
            </ChoiceGroup>
          </div>
        )}

        {step === 5 && (
          <div className="wizard-fields">
            <div className="recap">
              {[
                { step: 0, title: 'Votre besoin', rows: [['Service', service?.title ?? 'Autre / à définir']] },
                { step: 1, title: 'Votre projet', rows: [['Ce qui vous intéresse', data.projectTypes.join(', ') || '—'], ['Description', data.description], ['Objectifs', data.goals.join(', ') || '—']] },
                { step: 2, title: 'Budget et délais', rows: [['Budget', data.budget], ['Délai', data.timeline]] },
                { step: 3, title: 'Documents', rows: [['Fichiers', files.length ? files.map((f) => `${f.name} (${formatBytes(f.size)})`).join(', ') : 'Aucun']] },
                { step: 4, title: 'Vos coordonnées', rows: [['Nom', data.name], ['Téléphone', data.phone], ['E-mail', data.email || '—'], ['Entreprise', data.company || '—'], ['Contact préféré', data.contactPreference]] },
              ].map((g) => (
                <section key={g.title} className="recap-group" aria-label={g.title}>
                  <header>
                    <h3>{g.title}</h3>
                    <button type="button" className="link-btn" onClick={() => goTo(g.step)}>
                      Modifier<span className="sr-only"> : {g.title}</span>
                    </button>
                  </header>
                  <dl>
                    {g.rows.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
            <label className={`consent${errors.consent ? ' invalid' : ''}`} id="q-consent">
              <input type="checkbox" checked={data.consent} onChange={(e) => set('consent', e.target.checked)} aria-describedby={errors.consent ? 'e-consent' : undefined} />
              <span>
                J’accepte que KTech Solutions utilise ces informations pour répondre à ma demande (voir la{' '}
                <Link href="/confidentialite/" target="_blank">
                  politique de confidentialité
                </Link>
                ).
              </span>
            </label>
            {errors.consent && (
              <p className="error" id="e-consent">
                {errors.consent}
              </p>
            )}
            {serverError && (
              <p className="form-error" role="alert">
                {serverError}
              </p>
            )}
          </div>
        )}

        <div className="wizard-actions">
          {step > 0 ? (
            <button type="button" className="btn btn-ghost" onClick={() => goTo(step - 1)} disabled={sending !== null}>
              Retour
            </button>
          ) : (
            <span />
          )}
          <div className="btns">
            {step === 3 && files.length === 0 && (
              <button type="button" className="link-btn" onClick={() => goTo(4)}>
                Passer cette étape
              </button>
            )}
            <button type="submit" className="btn" disabled={sending !== null} aria-disabled={sending !== null}>
              {sending !== null ? (files.length ? `Envoi… ${sending} %` : 'Envoi…') : step === STEPS.length - 1 ? 'Envoyer ma demande' : 'Continuer'}
              {sending === null && <Icon name="arrow" />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
