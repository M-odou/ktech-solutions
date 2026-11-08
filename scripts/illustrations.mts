/**
 * Illustrations SVG originales (aux couleurs KTech) pour les galeries des projets types.
 * Elles sont remplacées par les vraies photos depuis le back-office.
 */
const C = { navy: '#1F3346', deep: '#0F1A24', green: '#219B53', greenL: '#6FD39B', blue: '#2F69A1', blueL: '#8DB8E8', teal: '#2A837E', paper: '#F2F5F7', line: '#DDE3E8' };

const frame = (body: string, bg: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${C.green}"/><stop offset=".5" stop-color="${C.teal}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient></defs>
<rect width="1600" height="1000" fill="${bg}"/>${body}</svg>`;

const browser = (x: number, y: number, w: number, h: number, inner: string) =>
  `<g transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="18" fill="${C.paper}"/>
<rect width="${w}" height="54" rx="18" fill="#E6EBEF"/><rect y="36" width="${w}" height="18" fill="#E6EBEF"/>
<circle cx="34" cy="27" r="8" fill="#C9D2D9"/><circle cx="60" cy="27" r="8" fill="#C9D2D9"/><circle cx="86" cy="27" r="8" fill="#C9D2D9"/>
<g transform="translate(0 54)">${inner}</g></g>`;

const phone = (x: number, y: number, inner: string, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect width="300" height="620" rx="44" fill="${C.deep}"/><rect x="14" y="14" width="272" height="592" rx="32" fill="${C.paper}"/>
<g transform="translate(14 14)">${inner}</g></g>`;

const dashboard = `<rect x="40" y="40" width="360" height="34" rx="8" fill="${C.navy}"/><rect x="40" y="96" width="220" height="22" rx="6" fill="${C.green}"/>
<rect x="40" y="160" width="300" height="200" rx="14" fill="#fff"/><rect x="370" y="160" width="300" height="200" rx="14" fill="#fff"/><rect x="700" y="160" width="300" height="200" rx="14" fill="#fff"/>
<text x="70" y="240" font-family="Poppins, Arial" font-size="56" font-weight="600" fill="${C.navy}">128</text><text x="70" y="290" font-family="Poppins, Arial" font-size="22" fill="#5B6773">Livraisons</text>
<text x="400" y="240" font-family="Poppins, Arial" font-size="56" font-weight="600" fill="${C.green}">94 %</text><text x="400" y="290" font-family="Poppins, Arial" font-size="22" fill="#5B6773">À l’heure</text>
<path d="M730 320 L790 280 L850 300 L910 230 L970 210" fill="none" stroke="${C.blue}" stroke-width="8" stroke-linecap="round"/>
<rect x="40" y="390" width="960" height="260" rx="14" fill="#fff"/>
${[0, 1, 2, 3].map((i) => `<rect x="70" y="${425 + i * 56}" width="420" height="18" rx="6" fill="${C.line}"/><rect x="760" y="${420 + i * 56}" width="${[150, 110, 170, 90][i]}" height="28" rx="14" fill="${[C.greenL, C.blueL, C.greenL, '#F2C27B'][i]}"/>`).join('')}`;

const siteHero = `<rect width="1100" height="700" fill="${C.navy}"/><rect x="60" y="120" width="560" height="54" rx="10" fill="#fff"/><rect x="60" y="196" width="420" height="54" rx="10" fill="url(#g)"/>
<rect x="60" y="290" width="480" height="18" rx="6" fill="#7C8FA2"/><rect x="60" y="322" width="380" height="18" rx="6" fill="#7C8FA2"/><rect x="60" y="390" width="210" height="60" rx="30" fill="#fff"/>
<circle cx="860" cy="300" r="170" fill="url(#g)" opacity=".85"/><circle cx="860" cy="300" r="100" fill="${C.navy}"/>`;

const appScreens = (accent: string) => `<rect width="272" height="150" fill="${accent}"/><rect x="24" y="60" width="160" height="22" rx="6" fill="#fff"/><rect x="24" y="96" width="110" height="16" rx="6" fill="#ffffffaa"/>
${[0, 1, 2, 3].map((i) => `<rect x="24" y="${180 + i * 92}" width="224" height="74" rx="14" fill="#fff"/><circle cx="60" cy="${217 + i * 92}" r="18" fill="${i % 2 ? C.blueL : C.greenL}"/><rect x="92" y="${206 + i * 92}" width="120" height="12" rx="5" fill="${C.line}"/><rect x="92" y="${226 + i * 92}" width="80" height="10" rx="5" fill="${C.line}"/>`).join('')}
<rect x="24" y="540" width="224" height="40" rx="20" fill="${C.navy}"/>`;

const SCENES: Record<string, (() => { svg: string; alt: string })[]> = {
  web: [
    () => ({ svg: frame(browser(250, 150, 1100, 700, dashboard), C.deep), alt: 'Tableau de bord de l’application web sur ordinateur' }),
    () => ({ svg: frame(phone(420, 190, appScreens(C.teal)) + phone(880, 190, appScreens(C.blue)), '#14232F'), alt: 'Écrans mobiles de l’application' }),
    () => ({ svg: frame(browser(250, 150, 1100, 700, siteHero), '#E8EEF1'), alt: 'Page d’accueil du site' }),
  ],
  mobile: [
    () => ({ svg: frame(phone(330, 190, appScreens(C.teal)) + phone(650, 190, appScreens(C.green)) + phone(970, 190, appScreens(C.blue)), C.deep), alt: 'Trois écrans de l’application mobile' }),
    () => ({ svg: frame(`<rect x="200" y="200" width="1200" height="600" rx="24" fill="#fff"/>${[0, 1, 2, 3].map((i) => `<rect x="${250 + i * 290}" y="260" width="250" height="480" rx="18" fill="${C.paper}" stroke="${C.line}" stroke-width="3"/><rect x="${275 + i * 290}" y="290" width="200" height="20" rx="6" fill="${C.navy}"/>`).join('')}<path d="M500 500 H540 M790 500 H830 M1080 500 H1120" stroke="${C.green}" stroke-width="8" stroke-linecap="round"/>`, '#E8EEF1'), alt: 'Parcours utilisateur en quatre écrans' }),
    () => ({ svg: frame(phone(650, 190, appScreens(C.navy)), '#132A20'), alt: 'Écran de confirmation de rendez-vous' }),
  ],
  brand: [
    () => ({ svg: frame(`<circle cx="800" cy="500" r="220" fill="none" stroke="url(#g)" stroke-width="56"/><text x="800" y="560" text-anchor="middle" font-family="Poppins, Arial" font-size="180" font-weight="600" fill="#fff">K</text>`, C.deep), alt: 'Logotype de l’identité visuelle' }),
    () => ({ svg: frame([C.navy, C.blue, C.teal, C.green, C.paper].map((c, i) => `<rect x="${170 + i * 260}" y="260" width="220" height="360" rx="18" fill="${c}"/><text x="${190 + i * 260}" y="680" font-family="Poppins, Arial" font-size="26" fill="#5B6773">${c}</text>`).join(''), '#F2F5F7'), alt: 'Palette de couleurs de la charte' }),
    () => ({ svg: frame(`<rect x="300" y="250" width="560" height="340" rx="16" fill="#fff" transform="rotate(-6 580 420)"/><rect x="740" y="380" width="560" height="340" rx="16" fill="${C.navy}" transform="rotate(5 1020 550)"/><rect x="800" y="440" width="200" height="26" rx="6" fill="url(#g)" transform="rotate(5 1020 550)"/>`, '#1A2A36'), alt: 'Cartes de visite et papeterie' }),
  ],
  training: [
    () => ({ svg: frame(`<rect x="200" y="160" width="1200" height="620" rx="20" fill="#fff"/><rect x="260" y="230" width="500" height="44" rx="10" fill="${C.navy}"/><rect x="260" y="300" width="380" height="24" rx="8" fill="${C.green}"/>${[0, 1, 2].map((i) => `<rect x="${260 + i * 370}" y="400" width="330" height="300" rx="16" fill="${C.paper}"/><text x="${290 + i * 370}" y="470" font-family="Poppins, Arial" font-size="40" font-weight="600" fill="url(#g)">0${i + 1}</text>`).join('')}`, C.deep), alt: 'Support pédagogique de l’atelier' }),
    () => ({ svg: frame(`<rect x="250" y="200" width="1100" height="600" rx="20" fill="#14232F"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${330 + i * 160}" y="${700 - [180, 240, 210, 320, 300, 420][i]}" width="100" height="${[180, 240, 210, 320, 300, 420][i]}" rx="10" fill="${i > 3 ? C.greenL : '#3A5166'}"/>`).join('')}`, C.deep), alt: 'Progression des indicateurs de visibilité' }),
    () => ({ svg: frame(`${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${380 + (i % 3) * 420}" cy="${330 + Math.floor(i / 3) * 340}" r="110" fill="${[C.green, C.teal, C.blue][i % 3]}" opacity=".9"/><rect x="${300 + (i % 3) * 420}" y="${460 + Math.floor(i / 3) * 340}" width="160" height="18" rx="6" fill="#ffffff55"/>`).join('')}`, '#102019'), alt: 'Participants de la session' }),
  ],
  event: [
    () => ({ svg: frame(`<rect x="420" y="120" width="480" height="680" rx="10" fill="${C.navy}"/><rect x="460" y="170" width="400" height="300" rx="8" fill="url(#g)"/><rect x="460" y="510" width="320" height="40" rx="8" fill="#fff"/><rect x="460" y="570" width="240" height="24" rx="8" fill="#7C8FA2"/><rect x="960" y="220" width="300" height="580" rx="10" fill="#fff"/><rect x="995" y="260" width="230" height="160" rx="8" fill="${C.green}"/>`, '#E8EEF1'), alt: 'Affiche et kakémono de l’événement' }),
    () => ({ svg: frame([0, 1, 2].map((i) => `<rect x="${260 + i * 380}" y="250" width="320" height="460" rx="20" fill="#fff"/><rect x="${260 + i * 380}" y="250" width="320" height="120" rx="20" fill="url(#g)"/><circle cx="${420 + i * 380}" cy="450" r="60" fill="${C.line}"/><rect x="${330 + i * 380}" y="540" width="180" height="22" rx="6" fill="${C.navy}"/>`).join(''), C.deep), alt: 'Badges des participants' }),
    () => ({ svg: frame(`${[0, 1, 2].map((i) => `<rect x="${250 + i * 380}" y="260" width="340" height="340" rx="20" fill="${[C.navy, C.green, C.blue][i]}"/><rect x="${280 + i * 380}" y="520" width="200" height="22" rx="6" fill="#ffffffcc"/>`).join('')}`, '#14232F'), alt: 'Visuels pour les réseaux sociaux' }),
  ],
};

export function illustrationsFor(art: string) {
  return (SCENES[art] ?? SCENES.web).map((make) => make());
}
