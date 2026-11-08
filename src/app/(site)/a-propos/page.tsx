import type { Metadata } from 'next';
import { CtaBand, PageHero, SectionHead } from '@/components/sections/Blocks';
import { Icon, type IconName } from '@/components/ui/Icon';
import { getSettings } from '@/server/queries/content';

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Histoire, mission, vision, valeurs et équipe de KTech Solutions.',
  alternates: { canonical: '/a-propos/' },
};

const TEAM_ICONS: IconName[] = ['dev', 'design', 'formation', 'compass'];

export default async function AboutPage() {
  const { about, company } = await getSettings();
  return (
    <>
      <PageHero crumbs={[{ label: 'À propos' }]} eyebrow="À propos" title={about.title} lead={about.lead} />

      <section className="section" aria-labelledby="h-title">
        <div className="container story">
          <div className="reveal">
            <p className="eyebrow">Notre histoire</p>
            <h2 className="h2" id="h-title">
              {about.storyTitle}
            </h2>
          </div>
          <div className="reveal lead">
            {about.story.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" aria-labelledby="mv-title">
        <h2 className="sr-only" id="mv-title">
          Mission et vision
        </h2>
        <div className="container mv">
          <div className="card reveal">
            <span className="icon">
              <Icon name="target" />
            </span>
            <h3 className="h3">Notre mission</h3>
            <p className="muted">{about.mission}</p>
          </div>
          <div className="card accent reveal">
            <span className="icon">
              <Icon name="eye" />
            </span>
            <h3 className="h3">Notre vision</h3>
            <p className="muted">{about.vision}</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="v-title">
        <div className="container">
          <SectionHead id="v-title" eyebrow="Nos valeurs" title="Les valeurs qui guident chacune de nos décisions." />
          <ul className="values">
            {about.values.map((v, i) => (
              <li className="value reveal" key={v.title}>
                <span className="n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section band" aria-labelledby="t-title">
        <div className="container">
          <SectionHead id="t-title" eyebrow="Notre équipe" title="Une équipe pluridisciplinaire." lead="Des profils complémentaires mobilisés selon les besoins de chaque projet." />
          <ul className="team">
            {about.team.map((t, i) => (
              <li className="member reveal" key={t.title}>
                <span className="icon">
                  <Icon name={TEAM_ICONS[i % TEAM_ICONS.length]} />
                </span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="w-title">
        <div className="container">
          <SectionHead id="w-title" eyebrow="Notre approche" title="Proches de vous, exigeants avec nous-mêmes." />
          <ol className="steps">
            {about.approach.map((a) => (
              <li className="step reveal" key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand title="Envie de construire quelque chose ensemble ?" sub="Nous sommes à l’écoute." whatsapp={company.whatsapp} />
    </>
  );
}
