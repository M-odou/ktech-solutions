import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { CTA } from '@/config/site';
import { HeroField } from '@/features/home/HeroField';
import { ProjectRows } from '@/features/home/ProjectRows';
import { OrbitGallery, ScrollMarquee } from '@/features/home/ScrollEffects';
import { ServicesScroller } from '@/features/home/ServicesScroller';
import { mediaUrl, whatsappUrl } from '@/lib/format';
import { getFaqs, getProjects, getServices, getSettings } from '@/server/queries/content';

export default async function HomePage() {
  const [{ company, home }, services, projects, faqs] = await Promise.all([getSettings(), getServices(), getProjects(), getFaqs()]);
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const orbitImages = projects.flatMap((p) => p.images.slice(0, 2)).slice(0, 8).map((i) => mediaUrl(i.path));
  const firstName = home.founderName.split(' ')[0];
  const waCall = whatsappUrl(company.whatsapp, `Bonjour ${firstName}, je souhaite échanger sur un projet.`);
  const initials = home.founderName.split(' ').filter(Boolean).map((w) => w[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join('');

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroField />
        <div className="hero-glow" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-aside">
            <p>
              {company.tagline}. {home.heroIntro}
            </p>
            {waCall && (
              <a className="btn btn-ghost btn-sm" href={waCall} target="_blank" rel="noopener noreferrer">
                <Icon name="whatsapp" /> Échanger sur WhatsApp
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            )}
          </div>
          <div className="hero-main">
            <h1 className="display" id="hero-title">
              {home.heroTitle}
              <br />
              <span className="grad-text">{home.heroHighlight}</span>
            </h1>
            <div className="btns">
              <Link className="btn" href={CTA.href}>
                {CTA.primary} <Icon name="arrow" />
              </Link>
              <Link className="btn btn-ghost" href="/services/">
                Découvrir nos services
              </Link>
            </div>
          </div>
          {home.founderName && (
            <div className="founder">
              <span className="founder-avatar" aria-hidden="true">
                {initials}
              </span>
              <span>
                <b>{home.founderName}</b>
                <small>{home.founderRole}</small>
              </span>
            </div>
          )}
        </div>
      </section>

      {home.marquee.length > 0 && <ScrollMarquee items={home.marquee} label="Nos domaines d’expertise" />}

      {orbitImages.length > 2 && (
        <OrbitGallery images={orbitImages}>
          <h2 id="orbit-title">{home.orbitTitle}</h2>
          <p>{home.orbitSubtitle}</p>
          <Link className="link" href="/realisations/">
            Voir les réalisations <Icon name="arrow" />
          </Link>
        </OrbitGallery>
      )}

      <ServicesScroller services={services} />

      <section className="section band" aria-labelledby="method-title">
        <div className="container">
          <div className="section-head split">
            <div>
              <p className="eyebrow">Notre méthode</p>
              <h2 className="h2" id="method-title">
                {home.methodTitle}
              </h2>
            </div>
            <p className="lead">{home.methodLead}</p>
          </div>
          <ol className="steps">
            {home.steps.map((s) => (
              <li key={s.title} className="step reveal">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="section" aria-labelledby="work-title">
          <div className="container">
            <p className="eyebrow">Réalisations</p>
            <h2 className="h2" id="work-title" style={{ marginBottom: 32 }}>
              {home.projectsTitle}
            </h2>
          </div>
          <ProjectRows projects={featured} />
          <div className="container center">
            <Link className="btn btn-ghost" href="/realisations/">
              Toutes les réalisations <Icon name="arrow" />
            </Link>
          </div>
        </section>
      )}

      <section className="big-cta" aria-labelledby="cta-title">
        <div className="big-cta-glow" aria-hidden="true" />
        <div className="container">
          <p className="eyebrow">Votre prochaine étape</p>
          <h2 id="cta-title">
            {home.ctaTitle}
            <br />
            <span className="grad-text">{home.ctaHighlight}</span>
          </h2>
          <p className="lead">{home.ctaText}</p>
          <div className="btns">
            <Link className="btn" href={CTA.href}>
              {CTA.primary} <Icon name="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/formations/">
              Voir les formations
            </Link>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section" aria-labelledby="faq-title">
          <div className="container faq">
            <div>
              <p className="eyebrow">Questions fréquentes</p>
              <h2 className="h2" id="faq-title">
                Vous vous posez la question ?
              </h2>
              <p className="lead">
                Une autre question ?{' '}
                <Link className="text-link" href="/contact/">
                  Écrivez-nous
                </Link>
                .
              </p>
            </div>
            <div className="faq-list">
              {faqs.map((f) => (
                <details key={f.id}>
                  <summary>
                    {f.question}
                    <span className="faq-icon" aria-hidden="true" />
                  </summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
