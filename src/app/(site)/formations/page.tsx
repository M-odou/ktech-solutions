import type { Metadata } from 'next';
import { Checks, PageHero, SectionHead } from '@/components/sections/Blocks';
import { Icon, type IconName } from '@/components/ui/Icon';
import { SimpleRequestForm } from '@/features/requests/SimpleRequestForm';
import { getCourses, getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'Formations',
  description: 'Formations pratiques en marketing digital, UI/UX design, développement web et mobile, design graphique et montage vidéo.',
  alternates: { canonical: '/formations/' },
};

const AUDIENCE_ICONS: IconName[] = ['student', 'rocket', 'users', 'building'];
const METHOD_ICONS: IconName[] = ['hands', 'users', 'chat'];

export default async function FormationsPage() {
  const [{ formations: page }, courses] = await Promise.all([getSettings(), getCourses()]);

  return (
    <>
      <PageHero crumbs={[{ label: 'Formations' }]} eyebrow="Formations" title={page.title} lead={page.lead}>
        <div className="btns">
          <a className="btn" href="#demande">
            Demander un programme <Icon name="arrow" />
          </a>
          <a className="btn btn-ghost" href="#domaines">
            Voir les domaines
          </a>
        </div>
      </PageHero>

      <section className="section" id="domaines" aria-labelledby="d-title">
        <div className="container">
          <SectionHead id="d-title" eyebrow="Domaines de formation" title="Du premier pas au niveau avancé." />
          <div className="grid g-3">
            {courses.map((c) => (
              <article key={c.id} className="course reveal">
                <div className="top">
                  <span className="icon">
                    <Icon name="formation" />
                  </span>
                  <span className="chip">{c.mode}</span>
                </div>
                <h3 className="h3">{c.title}</h3>
                <p>{c.description}</p>
                <dl>
                  <dt>Niveau</dt>
                  <dd>{c.level}</dd>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" aria-labelledby="o-title">
        <div className="container split">
          <div className="reveal">
            <p className="eyebrow">Objectifs pédagogiques</p>
            <h2 className="h2" id="o-title">
              Repartir avec des compétences, et la preuve qu’on les maîtrise.
            </h2>
          </div>
          <Checks items={page.objectives} className="lg reveal" />
        </div>
      </section>

      <section className="section" aria-labelledby="a-title">
        <div className="container">
          <SectionHead id="a-title" eyebrow="Publics concernés" title="Des formations pour chaque parcours." />
          <div className="audience">
            {page.audience.map((a, i) => (
              <div className="aud reveal" key={a.title}>
                <span className="icon">
                  <Icon name={AUDIENCE_ICONS[i % AUDIENCE_ICONS.length]} />
                </span>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" aria-labelledby="m-title">
        <div className="container">
          <SectionHead id="m-title" eyebrow="Méthodes d’apprentissage" title="On apprend mieux en faisant." />
          <div className="methods">
            {page.methods.map((m, i) => (
              <div className="block reveal" key={m.title}>
                <span className="icon">
                  <Icon name={METHOD_ICONS[i % METHOD_ICONS.length]} />
                </span>
                <h3 className="h3-plain">{m.title}</h3>
                <p className="muted">{m.text}</p>
              </div>
            ))}
          </div>
          {page.workshops.length > 0 && (
            <div className="block reveal" style={{ marginTop: 24 }}>
              <h3 className="block-title">Exemples d’ateliers pratiques</h3>
              <ul className="chips">
                {page.workshops.map((w) => (
                  <li className="chip" key={w}>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section" aria-labelledby="e-title">
        <div className="container">
          <div className="panel split reveal">
            <div>
              <p className="eyebrow">Formation en entreprise</p>
              <h2 className="h2" id="e-title">
                {page.companyTitle}
              </h2>
              <p className="lead">{page.companyText}</p>
            </div>
            <Checks className="lg" items={page.companyPoints} />
          </div>
        </div>
      </section>

      <section className="section band" id="demande" aria-labelledby="f-title">
        <div className="container split" style={{ alignItems: 'start' }}>
          <div className="reveal">
            <p className="eyebrow">Demande de programme</p>
            <h2 className="h2" id="f-title">
              Parlons de votre projet de formation.
            </h2>
            <p className="lead">Dites-nous qui souhaite se former et sur quoi : nous revenons vers vous avec une proposition de programme.</p>
          </div>
          <div className="card">
            <SimpleRequestForm kind="formation" domains={courses.map((c) => c.title)} />
          </div>
        </div>
      </section>
    </>
  );
}
