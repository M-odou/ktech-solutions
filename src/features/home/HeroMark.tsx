import type React from 'react';

/** Tracés du symbole (viewBox 330 × 330, centre 165). */
const LINES = ['M58 38 L292 272', 'M38 58 L272 292', 'M58 292 L292 58', 'M38 272 L272 38'];
const ENDS = [
  [58, 38], [292, 272], [38, 58], [272, 292], [58, 292], [292, 58], [38, 272], [272, 38],
];
const CHEVRONS = [
  { d: 'M118 82 L165 35 L212 82', c: 'ch-t' },
  { d: 'M248 118 L295 165 L248 212', c: 'ch-r' },
  { d: 'M212 248 L165 295 L118 248', c: 'ch-b' },
  { d: 'M82 212 L35 165 L82 118', c: 'ch-l' },
];

/**
 * Symbole KTech du bandeau, redessiné en SVG. Il se construit au chargement, en CSS seulement :
 * 1 · les circuits se tracent · 2 · les chevrons se placent · 3 · le cœur apparaît · 4 · l'anneau se referme.
 * Il « respire » ensuite doucement (orbites, halo).
 * Avec « réduire les animations », il est affiché complet et immobile.
 */
export function HeroMark() {
  return (
    <div className="mark" aria-hidden="true">
      <div className="mark-glow" />
      <div className="mark-orbit o1">
        <i />
      </div>
      <div className="mark-orbit o2">
        <i />
      </div>
      <Climb />
      <Build />
      <Mentor />
      <Launch />
      <svg viewBox="-12 -12 354 354" role="presentation">
        <defs>
          <linearGradient id="mark-grad" gradientUnits="userSpaceOnUse" x1="0" y1="165" x2="330" y2="165">
            <stop offset="0" stopColor="#2F69A1" />
            <stop offset=".5" stopColor="#2A837E" />
            <stop offset="1" stopColor="#219B53" />
          </linearGradient>
        </defs>

        <g className="mark-sketch">
          <circle cx="165" cy="165" r="168" />
          {LINES.map((d) => (
            <path key={d} d={d} />
          ))}
          {CHEVRONS.map((c) => (
            <path key={c.d} d={c.d} />
          ))}
          <rect x="128" y="128" width="74" height="74" rx="8" transform="rotate(45 165 165)" />
        </g>

        <circle className="mark-ring" cx="165" cy="165" r="168" pathLength={1} />
        <g className="mark-lines">
          {LINES.map((d) => (
            <path key={d} d={d} pathLength={1} />
          ))}
        </g>
        <g className="mark-ends">
          {ENDS.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="9" />
          ))}
        </g>
        {CHEVRONS.map((c) => (
          <path key={c.d} className={`mark-ch ${c.c}`} d={c.d} />
        ))}
        <g className="mark-core">
          <rect x="128" y="128" width="74" height="74" rx="8" transform="rotate(45 165 165)" />
        </g>
      </svg>
    </div>
  );
}

/** Escalier tracé : un point (la personne accompagnée) gravit les marches, qui s'allument une à une. */
function Climb() {
  return (
    <div className="mk-card mk-climb">
      <svg viewBox="0 0 72 44" role="presentation">
        <path className="mk-steps" d="M4 40 H20 V30 H36 V20 H52 V10 H68" />
        <path className="mk-steps-on" d="M4 40 H20 V30 H36 V20 H52 V10 H68" pathLength={1} />
        <circle className="mk-guide" cx="66" cy="6" r="3.2" />
        {/* la personne accompagnée : visible et immobile en haut si les animations sont réduites */}
        <circle className="mk-climber-still" cx="58" cy="6" r="3.6" />
        <circle className="mk-climber" r="3.6" cx="0" cy="0">
          <animateMotion
            dur="4.8s"
            begin="3s"
            repeatCount="indefinite"
            path="M6 36 H20 V26 H36 V16 H52 V6 H58"
            keyPoints="0;1;1"
            keyTimes="0;.62;1"
            calcMode="spline"
            keySplines=".6 0 .3 1;0 0 1 1"
          />
        </circle>
      </svg>
      <b>Monter en compétence</b>
    </div>
  );
}

/** Blocs qui viennent se poser un à un : on bâtit ensemble votre projet numérique. */
function Build() {
  return (
    <div className="mk-card mk-build">
      <span className="mk-bricks">
        {Array.from({ length: 6 }, (_, i) => (
          <i key={i} style={{ '--i': i } as React.CSSProperties} />
        ))}
      </span>
      <b>Bâtir votre projet</b>
    </div>
  );
}

/** Deux personnes reliées : une impulsion fait l'aller-retour entre le formateur et l'apprenant. */
function Mentor() {
  return (
    <div className="mk-card mk-mentor">
      <svg viewBox="0 0 72 24" role="presentation">
        <line className="mk-link" x1="12" y1="12" x2="60" y2="12" />
        <circle className="mk-person a" cx="8" cy="12" r="6" />
        <circle className="mk-person b" cx="64" cy="12" r="6" />
        <circle className="mk-pulse" r="2.6" cx="0" cy="0">
          <animateMotion dur="2.8s" begin="3.4s" repeatCount="indefinite" path="M14 12 H58" keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="spline" keySplines=".6 0 .4 1;.6 0 .4 1" />
        </circle>
      </svg>
      <b>Vous accompagner</b>
    </div>
  );
}

/** Barre de progression qui se remplit, puis la coche de mise en ligne. */
function Launch() {
  return (
    <div className="mk-card mk-launch">
      <span className="mk-progress">
        <i />
        <svg className="mk-check" viewBox="0 0 16 16" role="presentation">
          <circle cx="8" cy="8" r="8" />
          <path d="M4.6 8.3 L7 10.6 L11.4 5.8" />
        </svg>
      </span>
      <b>Mise en ligne</b>
    </div>
  );
}
