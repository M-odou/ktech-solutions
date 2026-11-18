'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Field } from '@/components/ui/Field';
import { Icon, type IconName } from '@/components/ui/Icon';
import { cartTotal, formatPrice, priceLabel, resolveCart, type CartLine } from '@/content/features';
import { whatsappUrl } from '@/lib/format';
import { FileDrop } from '../quote/FileDrop';
import { checkoutSchema, CONTACT_PREFS, TIMELINES, toFieldErrors, type FieldErrors } from '../requests/schema';
import { submitRequest } from '../requests/submit';
import { cart, useCart } from './store';

export type CheckoutService = { slug: string; shortTitle: string; icon: string };

type Form = { name: string; phone: string; email: string; contactPreference: string; timeline: string; message: string; consent: boolean };
const EMPTY: Form = { name: '', phone: '', email: '', contactPreference: 'WhatsApp', timeline: '', message: '', consent: false };
const ORDER = ['name', 'phone', 'email', 'message', 'consent'];
const TIMELINE_LABELS: Record<string, string> = {
  'Urgent (moins de 2 semaines)': 'Urgent',
  'Dans le mois': 'Ce mois-ci',
  'Dans 2 à 3 mois': 'Dans 2-3 mois',
  'Pas de date précise': 'Pas pressé',
};
const CONTACT_ICONS: Record<string, IconName> = { WhatsApp: 'whatsapp', 'Appel téléphonique': 'phone', 'E-mail': 'mail' };

/**
 * La caisse express : le ticket (le chariot) d'un côté, trois questions de l'autre.
 * Un seul écran, puis un ticket « validé » avec la référence de suivi.
 */
export function Checkout({ services, whatsapp }: { services: CheckoutService[]; whatsapp: string }) {
  const lines = resolveCart(useCart());
  const [form, setForm] = useState<Form>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [showFiles, setShowFiles] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState<number | null>(null);
  const [serverError, setServerError] = useState('');
  const [done, setDone] = useState<{ reference: string; lines: CartLine[]; rejected?: string[] } | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const svc = (slug: string) => services.find((s) => s.slug === slug);
  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => Object.fromEntries(Object.entries(e).filter(([k]) => k !== key)));
  };

  const payload = () => ({ ...form, features: lines.map((l) => l.id), consent: form.consent ? 'on' : '' });

  const submit = async () => {
    const parsed = checkoutSchema.safeParse(payload());
    if (!parsed.success) {
      const e = toFieldErrors(parsed.error);
      setErrors(e);
      const first = ORDER.find((k) => e[k]);
      if (first) document.getElementById(`c-${first}`)?.focus();
      return;
    }
    const data = new FormData();
    data.set('kind', 'caisse');
    data.set('website', '');
    for (const [k, v] of Object.entries(payload())) {
      if (Array.isArray(v)) v.forEach((x) => data.append(k, x));
      else data.set(k, String(v));
    }
    files.forEach((f) => data.append('files', f));
    setServerError('');
    setSending(0);
    const res = await submitRequest(data, setSending);
    setSending(null);
    if (res.ok) {
      setDone({ reference: res.reference, lines, rejected: res.rejected });
      cart.clear();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => doneRef.current?.focus());
    } else if (res.errors) setErrors(res.errors);
    else setServerError(res.error ?? 'L’envoi n’a pas abouti.');
  };

  const groups = (list: CartLine[]) =>
    services
      .map((s) => ({ ...s, items: list.filter((l) => l.service === s.slug) }))
      .filter((g) => g.items.length > 0);

  const waCart = whatsappUrl(
    whatsapp,
    [
      `Bonjour KTech Solutions, je suis ${form.name || '…'}. Voici mon chariot :`,
      ...groups(lines).flatMap((g) => [`\n${g.shortTitle} :`, ...g.items.map((i) => `• ${i.label}`)]),
      form.message ? `\nMon projet : ${form.message}` : '',
    ].join('\n'),
  );

  /* ---------- après validation : le ticket validé ---------- */
  if (done) {
    const first = form.name.trim().split(' ')[0];
    const wa = whatsappUrl(whatsapp, `Bonjour KTech Solutions, je viens de valider mon chariot (réf. ${done.reference}).`);
    const icons = done.lines.slice(0, 8);
    return (
      <div className="paid" ref={doneRef} tabIndex={-1} role="status" aria-live="polite">
        <div className="paid-burst" aria-hidden="true">
          {(icons.length ? icons.map((l) => l.icon) : (['check', 'rocket', 'chat'] as IconName[])).map((ic, i) => (
            <span key={i} style={{ ['--i' as string]: i, ['--n' as string]: Math.max(icons.length, 3) }}>
              <Icon name={ic} />
            </span>
          ))}
        </div>
        <span className="done-badge" aria-hidden="true">
          <Icon name="check" />
        </span>
        <h2 className="h2">Merci {first} ! Votre chariot est entre de bonnes mains.</h2>
        <p className="lead">Nous préparons votre devis gratuit et nous vous contactons {form.contactPreference === 'E-mail' ? 'par e-mail' : form.contactPreference === 'WhatsApp' ? 'sur WhatsApp' : 'par téléphone'} très vite.</p>

        <div className="ticket ticket-paid">
          <div className="ticket-head">
            <b>KTech Solutions</b>
            <span>Ticket n° {done.reference}</span>
          </div>
          {done.lines.length > 0 ? (
            <ul className="ticket-lines">
              {done.lines.map((l) => (
                <li key={l.id}>
                  <span>{l.label}</span>
                  <span>{l.price ? formatPrice(l.price) : 'sur devis'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="ticket-note">Demande personnalisée</p>
          )}
          <p className="ticket-total">
            <span>Estimation</span>
            <b>{cartTotal(done.lines) ? formatPrice(cartTotal(done.lines)) : 'Sur devis'}</b>
          </p>
          <span className="stamp" aria-hidden="true">
            Validé
          </span>
        </div>

        {done.rejected && done.rejected.length > 0 && (
          <p className="form-error">Certains fichiers n’ont pas pu être joints : {done.rejected.join(', ')}. Vous pourrez nous les envoyer sur WhatsApp.</p>
        )}

        <ol className="paid-next">
          <li>
            <span aria-hidden="true">
              <Icon name="eye" />
            </span>
            <b>On étudie votre chariot</b>
          </li>
          <li>
            <span aria-hidden="true">
              <Icon name="chat" />
            </span>
            <b>On vous appelle pour en parler</b>
          </li>
          <li>
            <span aria-hidden="true">
              <Icon name="file" />
            </span>
            <b>Vous recevez votre devis</b>
          </li>
        </ol>

        <div className="btns">
          {wa && (
            <a className="btn btn-wa" href={wa} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" /> Nous écrire sur WhatsApp<span className="sr-only"> (nouvel onglet)</span>
            </a>
          )}
          <Link className="btn btn-ghost" href="/realisations/">
            Découvrir nos réalisations
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- la caisse ---------- */
  const total = cartTotal(lines);
  const empty = lines.length === 0;

  return (
    <div className="checkout">
      {/* Le ticket : ce qu'il y a dans le chariot */}
      <section className="ticket" aria-labelledby="ticket-title">
        <div className="ticket-head">
          <h2 id="ticket-title">
            <Icon name="cart" /> Votre chariot
          </h2>
          <span>
            {lines.length} article{lines.length > 1 ? 's' : ''}
          </span>
        </div>

        {empty ? (
          <div className="ticket-empty">
            <p>Votre chariot est vide.</p>
            <Link className="btn btn-sm" href="/services/">
              <Icon name="bag" /> Faire mes courses
            </Link>
            <p className="muted">Ou décrivez simplement votre besoin à droite : on s’occupe du reste.</p>
          </div>
        ) : (
          <>
            {groups(lines).map((g) => (
              <div key={g.slug} className="ticket-group">
                <p className="ticket-aisle">
                  <Icon name={(svc(g.slug)?.icon ?? 'layers') as IconName} /> {g.shortTitle}
                </p>
                <ul className="ticket-lines">
                  {g.items.map((l) => (
                    <li key={l.id}>
                      <span className="ticket-item">
                        <Icon name={l.icon} />
                        {l.label}
                      </span>
                      <span className="ticket-price">{l.price ? priceLabel(l).replace('dès ', '') : 'sur devis'}</span>
                      <button type="button" className="ticket-remove" onClick={() => cart.remove(l.id)} aria-label={`Retirer ${l.label}`}>
                        <Icon name="close" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="ticket-total">
              <span>Total de départ</span>
              <b>{total ? formatPrice(total) : 'Sur devis'}</b>
            </p>
            <p className="ticket-note">Rien à payer maintenant : c’est une estimation, votre devis détaillé est gratuit.</p>
            <Link className="link" href="/services/">
              <Icon name="plus" /> Ajouter d’autres articles
            </Link>
          </>
        )}
      </section>

      {/* Trois questions, et c'est tout */}
      <form
        className="pay"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        aria-labelledby="pay-title"
      >
        <h2 id="pay-title" className="pay-title">
          Plus qu’une petite étape
        </h2>
        <p className="muted">Pour vous envoyer votre devis, nous avons juste besoin de savoir qui vous êtes.</p>

        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" defaultValue="" />

        <Field id="c-name" label="Votre prénom et nom" invalid={!!errors.name} error={errors.name}>
          {(a) => <input className="input" autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} {...a} />}
        </Field>
        <Field id="c-phone" label="Votre numéro (WhatsApp de préférence)" invalid={!!errors.phone} error={errors.phone}>
          {(a) => <input className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="+221 77 000 00 00" value={form.phone} onChange={(e) => set('phone', e.target.value)} {...a} />}
        </Field>

        <fieldset className="choice-group">
          <legend>On vous répond par</legend>
          <div className="pay-chips">
            {CONTACT_PREFS.map((c) => (
              <label key={c} className="pay-chip">
                <input type="radio" name="contactPreference" value={c} checked={form.contactPreference === c} onChange={() => set('contactPreference', c)} />
                <span>
                  <Icon name={CONTACT_ICONS[c]} /> {c === 'Appel téléphonique' ? 'Appel' : c}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {form.contactPreference === 'E-mail' && (
          <Field id="c-email" label="Votre e-mail" invalid={!!errors.email} error={errors.email}>
            {(a) => <input className="input" type="email" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} {...a} />}
          </Field>
        )}

        <fieldset className="choice-group">
          <legend>
            Pour quand ? <span className="opt">(facultatif)</span>
          </legend>
          <div className="pay-chips">
            {TIMELINES.map((t) => (
              <label key={t} className="pay-chip">
                <input type="radio" name="timeline" value={t} checked={form.timeline === t} onChange={() => set('timeline', t)} onClick={() => form.timeline === t && set('timeline', '')} />
                <span>{TIMELINE_LABELS[t] ?? t}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          id="c-message"
          label={empty ? 'De quoi avez-vous besoin ?' : 'Un mot sur votre projet'}
          optional={!empty}
          hint={empty ? undefined : 'Votre activité, une idée, un exemple qui vous plaît…'}
          invalid={!!errors.message}
          error={errors.message}
        >
          {(a) => <textarea className="input" rows={3} maxLength={2000} value={form.message} onChange={(e) => set('message', e.target.value)} {...a} />}
        </Field>

        {showFiles ? (
          <FileDrop files={files} onChange={setFiles} />
        ) : (
          <button type="button" className="link-btn pay-attach" onClick={() => setShowFiles(true)}>
            <Icon name="plus" /> Joindre un document (logo, cahier des charges…)
          </button>
        )}

        <label className={`consent${errors.consent ? ' invalid' : ''}`}>
          <input
            id="c-consent"
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set('consent', e.target.checked)}
            aria-describedby={errors.consent ? 'c-consent-error' : undefined}
            aria-invalid={errors.consent ? true : undefined}
          />
          <span>
            J’accepte que KTech Solutions utilise ces informations pour me répondre (
            <Link href="/confidentialite/" target="_blank">
              confidentialité
            </Link>
            ).
          </span>
        </label>
        {errors.consent && (
          <p className="error" id="c-consent-error">
            {errors.consent}
          </p>
        )}

        {serverError && (
          <div className="form-error" role="alert">
            <p>{serverError}</p>
            {waCart && !empty && (
              <a className="btn btn-wa btn-sm" href={waCart} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" /> Envoyer mon chariot sur WhatsApp<span className="sr-only"> (nouvel onglet)</span>
              </a>
            )}
          </div>
        )}

        <button type="submit" className="btn pay-btn" disabled={sending !== null} aria-disabled={sending !== null}>
          <Icon name="cart" />
          {sending !== null ? (files.length ? `Envoi… ${sending} %` : 'Envoi…') : empty ? 'Envoyer ma demande' : 'Valider mon chariot'}
        </button>
        <p className="pay-reassure">
          <span>
            <Icon name="check" /> Gratuit
          </span>
          <span>
            <Icon name="check" /> Sans engagement
          </span>
          <span>
            <Icon name="check" /> Données protégées
          </span>
        </p>
      </form>
    </div>
  );
}
