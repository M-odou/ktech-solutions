#!/usr/bin/env python3
"""Génère les pages statiques du site KTech Solutions.
Usage : python3 _build/build.py   (depuis le dossier site/)
Chaque page est écrite dans <slug>/index.html pour des URLs propres (/services/, /contact/…)."""
import json, os, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

# ------------------------------------------------------------------ icônes
I = {
 'formation': '<path d="M22 9 12 4 2 9l10 5 10-5Z"/><path d="M6 11v5c3.5 2.5 8.5 2.5 12 0v-5"/><path d="M22 9v6"/>',
 'dev': '<path d="m8 6-6 6 6 6"/><path d="m16 6 6 6-6 6"/><path d="m14 4-4 16"/>',
 'design': '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.9-.8-1.3-.8-2.2 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 7 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7.5" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
 'print': '<path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
 'event': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9.5 15 2 2 3.5-3.5"/>',
 'arrow': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
 'users': '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
 'layers': '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
 'target': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
 'hands': '<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4"/><path d="M10 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M13 10V5.5a1.5 1.5 0 0 1 3 0V12"/><path d="M16 9a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L3.6 15a1.6 1.6 0 0 1 2.6-1.8L7 14"/>',
 'compass': '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
 'check': '<path d="M20 6 9 17l-5-5"/>',
 'phone': '<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
 'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 'pin': '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'close': '<path d="M18 6 6 18M6 6l12 12"/>',
 'spark': '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
 'building': '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/><path d="M10 21v-3h4v3"/>',
 'rocket': '<path d="M5 15c-1.5 1.5-2 4-2 6 2 0 4.5-.5 6-2"/><path d="M9 15 15 9"/><path d="M14 4c3-1 6-1 6-1s0 3-1 6l-6 6-4-4 5-7Z"/><path d="M9 11H5l3-3h4"/><path d="M13 15v4l3-3v-4"/>',
 'student': '<circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 'shield': '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
 'bolt': '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
 'eye': '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 'chat': '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
}
SOC = {
 'linkedin': '<path fill="currentColor" stroke="none" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V21h-4V9.5Z"/>',
 'instagram': '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
 'facebook': '<path fill="currentColor" stroke="none" d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3C16.7 2.2 15.6 2 14.4 2 11.8 2 10 3.6 10 6.5v2H7.3v3.6H10V22h4v-9.9h2.9l.4-3.6H14Z"/>',
 'tiktok': '<path fill="currentColor" stroke="none" d="M16.6 2h-3.4v13.4a2.9 2.9 0 1 1-2.1-2.8V9.1a6.3 6.3 0 1 0 5.5 6.3V8.6a8 8 0 0 0 4.4 1.4V6.6a4.5 4.5 0 0 1-4.4-4.6Z"/>',
 'whatsapp': '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/>',
}

def ic(name, cls=''):
    paths = I.get(name) or SOC[name]
    return f'<svg{" class=%s" % chr(34)+cls+chr(34) if cls else ""} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths}</svg>'

ARROW = ic('arrow')

def mark(bg='#0A1A3A'):
    return (f'<svg class="brand-mark" viewBox="0 0 34 34" aria-hidden="true"><rect width="34" height="34" rx="9" fill="{bg}"/>'
            '<path d="M11.5 9v16" stroke="#F7F5F0" stroke-width="3.2" stroke-linecap="round"/>'
            '<path d="M23 9.5 15.5 17 23 24.5" stroke="#5B8CFF" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
            '<circle cx="23.6" cy="9.2" r="2.7" fill="#FFB020"/></svg>')

# ------------------------------------------------------------------ données
SITE = 'KTech Solutions'
SIGNATURE = 'Former les talents, concevoir des solutions et connecter les opportunités.'
NAV = [('', 'Accueil'), ('services/', 'Nos services'), ('formations/', 'Formations'),
       ('realisations/', 'Réalisations'), ('a-propos/', 'À propos'), ('contact/', 'Contact')]

# Coordonnées : à compléter dès que les informations officielles sont fournies.
CONTACT = {
  'phone': None,        # ex. '+221 77 000 00 00'
  'email': None,        # ex. 'contact@ktech-solutions.sn'
  'address': None,      # ex. 'Dakar, Sénégal'
  'hours': 'Du lundi au vendredi, 9h – 18h',
  'whatsapp': None,     # ex. '221770000000' (format international, sans +)
  'socials': {'linkedin': '#', 'instagram': '#', 'facebook': '#', 'tiktok': '#'},
}

SERVICES = [
 dict(slug='formation', icon='formation', title='Formation et coaching numérique',
      short='Des parcours concrets pour maîtriser les métiers du numérique et renforcer les compétences de vos équipes.',
      tags=['Marketing digital', 'UI/UX Design', 'Développement web & mobile', 'Design graphique', 'Montage vidéo'],
      needs=['Vos équipes doivent monter en compétences sur des outils et métiers numériques.',
             'Vous voulez vous reconvertir ou lancer une activité dans le digital.',
             'Vous cherchez un accompagnement pratique, pas seulement théorique.'],
      offers=['Marketing digital et réseaux sociaux', 'UI/UX Design', 'Développement web et mobile',
              'Design graphique', 'Montage vidéo et création de contenu', 'Coaching et renforcement des compétences'],
      benefits=[('Compétences immédiatement utiles', 'Chaque module débouche sur une réalisation concrète.'),
                ('Programmes adaptés', 'Contenu ajusté à votre niveau, votre secteur et vos objectifs.'),
                ('Suivi après la formation', 'Un accompagnement pour appliquer les acquis sur le terrain.')],
      steps=['Évaluation des besoins', 'Programme sur mesure', 'Sessions pratiques', 'Suivi et évaluation']),
 dict(slug='developpement', icon='dev', title='Développement de solutions numériques',
      short='Sites web, applications et outils métiers conçus pour simplifier vos opérations et accélérer votre croissance.',
      tags=['Sites web', 'Applications web & mobiles', 'Solutions métiers', 'Automatisation'],
      needs=['Votre présence en ligne ne reflète pas votre sérieux ni votre offre.',
             'Des tâches répétitives ou des fichiers dispersés ralentissent votre activité.',
             'Vous avez une idée d’application et cherchez un partenaire technique.'],
      offers=['Conception de sites web', 'Applications web et mobiles', 'Solutions métiers sur mesure',
              'Automatisation et digitalisation des processus', 'Conseil technologique'],
      benefits=[('Des outils pensés pour vous', 'Développés à partir de vos processus réels.'),
                ('Performance mobile', 'Des interfaces rapides, même sur des connexions limitées.'),
                ('Évolutivité', 'Une architecture qui grandit avec votre organisation.')],
      steps=['Cadrage fonctionnel', 'Maquettes et validation', 'Développement et tests', 'Mise en ligne et maintenance']),
 dict(slug='design', icon='design', title='Conception graphique et identité visuelle',
      short='Des identités de marque cohérentes et des visuels qui inspirent confiance au premier regard.',
      tags=['Logos', 'Branding', 'Supports de communication', 'Design UI/UX'],
      needs=['Votre image ne correspond plus à votre niveau d’exigence.',
             'Vos supports manquent de cohérence d’un canal à l’autre.',
             'Vous lancez une marque et partez de zéro.'],
      offers=['Création de logos', 'Branding et identité de marque', 'Supports de communication',
              'Design UI/UX', 'Création de contenus visuels'],
      benefits=[('Une marque reconnaissable', 'Une identité claire, déclinable partout.'),
                ('Crédibilité renforcée', 'Une image professionnelle qui rassure vos interlocuteurs.'),
                ('Guide d’utilisation', 'Des règles simples pour rester cohérent dans le temps.')],
      steps=['Immersion dans votre marque', 'Pistes créatives', 'Affinage', 'Livraison et charte']),
 dict(slug='impression', icon='print', title='Impression numérique',
      short='Des supports imprimés soignés, du fichier à la livraison, pour toutes vos communications.',
      tags=['Flyers & affiches', 'Cartes de visite', 'Brochures', 'Supports publicitaires'],
      needs=['Vous avez besoin de supports imprimés de qualité dans des délais courts.',
             'Vous préparez un salon, un lancement ou un événement.',
             'Vous voulez un interlocuteur unique pour la création et l’impression.'],
      offers=['Flyers et affiches', 'Cartes de visite', 'Brochures et dépliants',
              'Supports publicitaires', 'Supports de communication événementielle'],
      benefits=[('Création et impression réunies', 'Un seul interlocuteur, du design au produit fini.'),
                ('Qualité contrôlée', 'Vérification des fichiers et des couleurs avant impression.'),
                ('Délais maîtrisés', 'Un calendrier clair, adapté à vos échéances.')],
      steps=['Brief et devis', 'Création ou vérification du fichier', 'Bon à tirer', 'Impression et livraison']),
 dict(slug='evenementiel', icon='event', title='Accompagnement événementiel',
      short='Un appui technique, numérique et créatif pour des événements réussis, avant, pendant et après.',
      tags=['Technique & numérique', 'Communication', 'Supports visuels', 'Couverture & contenus'],
      needs=['Vous organisez une conférence, un lancement, une formation ou un salon.',
             'Vous avez besoin d’une communication cohérente autour de l’événement.',
             'Vous voulez valoriser l’événement avec des contenus de qualité.'],
      offers=['Accompagnement technique et numérique', 'Communication événementielle',
              'Création de supports visuels', 'Couverture et production de contenus selon les prestations retenues'],
      benefits=[('Sérénité le jour J', 'Une équipe qui anticipe les aspects techniques.'),
                ('Visibilité prolongée', 'Des contenus réutilisables après l’événement.'),
                ('Cohérence de marque', 'Des supports alignés avec votre identité.')],
      steps=['Cadrage de l’événement', 'Plan de communication', 'Production des supports', 'Couverture et bilan']),
]

# Réalisations : exemples à remplacer par les projets réels de KTech Solutions.
CATS = [('dev', 'Développement'), ('graphique', 'Design graphique'), ('uiux', 'UI/UX Design'),
        ('formation', 'Formation'), ('evenementiel', 'Événementiel')]
CATL = dict(CATS)
WORKS = [
 dict(cat='dev uiux', art='art-a', title='Plateforme de gestion pour une PME logistique',
      context='Une entreprise de logistique gérait ses commandes et livraisons sur des tableurs partagés.',
      need='Centraliser les informations et suivre les livraisons en temps réel.',
      solution='Une application web responsive avec tableau de bord, suivi des statuts et accès par rôle.',
      deliverables='Maquettes UI/UX, application web, formation des utilisateurs.',
      results='Suivi des opérations centralisé et partagé entre les équipes.'),
 dict(cat='graphique', art='art-b', title='Identité visuelle d’un cabinet de conseil',
      context='Un cabinet en croissance souhaitait une image plus affirmée auprès de grands comptes.',
      need='Créer une identité crédible, sobre et déclinable sur tous les supports.',
      solution='Logo, palette, typographies et système graphique accompagnés d’une charte.',
      deliverables='Logo, charte graphique, papeterie, modèles de présentation.',
      results=''),
 dict(cat='uiux dev', art='art-c', title='Application mobile de prise de rendez-vous',
      context='Un réseau de centres de services recevait ses rendez-vous uniquement par téléphone.',
      need='Permettre la réservation en ligne, simplement, depuis un smartphone.',
      solution='Parcours utilisateur testé, interface mobile légère et notifications de rappel.',
      deliverables='Recherche utilisateur, prototype, application mobile.',
      results=''),
 dict(cat='formation', art='art-d', title='Parcours marketing digital pour entrepreneurs',
      context='Un programme d’accompagnement d’entrepreneurs souhaitait renforcer leur visibilité en ligne.',
      need='Former des porteurs de projets aux fondamentaux du marketing digital.',
      solution='Un parcours pratique en ateliers, avec plan d’action individuel pour chaque participant.',
      deliverables='Programme, supports pédagogiques, ateliers, évaluation finale.',
      results='Chaque participant repart avec un plan de communication opérationnel.'),
 dict(cat='evenementiel graphique', art='art-e', title='Communication d’un forum professionnel',
      context='Un forum réunissant entreprises et jeunes talents.',
      need='Créer une identité d’événement et gérer la communication avant et pendant le forum.',
      solution='Identité de l’événement, supports imprimés, visuels réseaux sociaux et couverture.',
      deliverables='Affiches, kakémonos, badges, visuels sociaux, contenus vidéo.',
      results=''),
 dict(cat='dev', art='art-f', title='Site institutionnel d’une organisation',
      context='Une organisation avait besoin d’un site clair pour présenter ses programmes.',
      need='Un site rapide, facile à mettre à jour par l’équipe interne.',
      solution='Site responsive avec gestion de contenu et optimisation pour les connexions mobiles.',
      deliverables='Arborescence, maquettes, site web, formation à la mise à jour.',
      results=''),
 dict(cat='formation uiux', art='art-g', title='Bootcamp UI/UX Design',
      context='Des jeunes diplômés souhaitaient se former aux métiers du design numérique.',
      need='Acquérir une méthode et constituer un premier portfolio.',
      solution='Un bootcamp intensif fondé sur un projet réel, de la recherche au prototype.',
      deliverables='Programme, mentorat, projets de fin de parcours.',
      results='Chaque participant termine avec un cas d’étude présentable.'),
 dict(cat='evenementiel dev', art='art-h', title='Dispositif numérique pour une conférence',
      context='Une conférence avec participants sur place et à distance.',
      need='Gérer les inscriptions et assurer une diffusion fluide.',
      solution='Page d’inscription, accompagnement technique et diffusion des contenus.',
      deliverables='Page d’événement, support technique, captations.',
      results=''),
]

COURSES = [
 ('Marketing digital', 'Stratégie, réseaux sociaux, publicité en ligne et mesure des résultats.', 'Débutant à intermédiaire', 'Présentiel ou en ligne'),
 ('UI/UX Design', 'Recherche utilisateur, wireframes, design d’interface et prototypage.', 'Débutant à intermédiaire', 'Présentiel ou en ligne'),
 ('Développement web', 'HTML, CSS, JavaScript et frameworks modernes pour créer des sites performants.', 'Débutant à avancé', 'Présentiel ou en ligne'),
 ('Développement mobile', 'Conception et publication d’applications mobiles multiplateformes.', 'Intermédiaire', 'Présentiel ou en ligne'),
 ('Design graphique', 'Principes visuels, identité de marque et maîtrise des outils de création.', 'Débutant à intermédiaire', 'Présentiel'),
 ('Montage vidéo & contenu', 'Tournage, montage et formats pour les réseaux sociaux.', 'Débutant', 'Présentiel'),
]

# ------------------------------------------------------------------ gabarit
def head(title, desc, pre, slug, extra=''):
    full = f'{title} | {SITE}' if title else f'{SITE} | Formation, solutions numériques et créativité'
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{full}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#0A1A3A">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE}">
<meta property="og:title" content="{full}">
<meta property="og:description" content="{desc}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{pre}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{pre}assets/style.css">
<script src="{pre}assets/main.js" defer></script>
{extra}</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
'''

def header(pre, cur):
    li = ''.join(f'<li><a href="{pre}{h}"{" aria-current=page" if h == cur else ""}>{t}</a></li>' for h, t in NAV)
    mli = ''.join(f'<li><a href="{pre}{h}"{" aria-current=page" if h == cur else ""}>{t}{ARROW}</a></li>' for h, t in NAV)
    return f'''<header class="header">
  <div class="container header-in">
    <a class="brand" href="{pre}" aria-label="{SITE}, accueil">{mark()}<span>KTech <small>Solutions</small></span></a>
    <nav class="nav" aria-label="Navigation principale"><ul>{li}</ul></nav>
    <a class="btn btn-sm btn-cta" href="{pre}contact/">Parlons de votre projet</a>
    <button class="menu-btn" aria-expanded="false" aria-controls="mobile-nav" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Navigation mobile">
    <ul>{mli}</ul>
    <a class="btn" href="{pre}contact/">Parlons de votre projet {ARROW}</a>
  </nav>
</header>
'''

def contact_value(key, fallback):
    v = CONTACT[key]
    return v if v else f'<span class="todo">{fallback}</span>'

def footer(pre):
    svc = ''.join(f'<li><a href="{pre}services/#{s["slug"]}">{s["title"].split(" et ")[0] if s["slug"]!="impression" else s["title"]}</a></li>' for s in SERVICES)
    nav = ''.join(f'<li><a href="{pre}{h}">{t}</a></li>' for h, t in NAV)
    soc = ''.join(f'<a href="{u}" aria-label="{n.capitalize()}">{ic(n)}</a>' for n, u in CONTACT['socials'].items())
    return f'''<footer class="footer on-dark">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a class="brand" href="{pre}">{mark('#16306A')}<span>KTech <small>Solutions</small></span></a>
        <p>Ingénieurs, professionnels du numérique et coachs-formateurs au service de la transformation digitale des entreprises, des organisations et des talents.</p>
        <div class="socials">{soc}</div>
      </div>
      <div><h3>Navigation</h3><ul>{nav}</ul></div>
      <div><h3>Services</h3><ul>{svc}</ul></div>
      <div><h3>Coordonnées</h3><ul>
        <li>{contact_value('address', 'Adresse à compléter')}</li>
        <li>{contact_value('phone', 'Téléphone à compléter')}</li>
        <li>{contact_value('email', 'E-mail à compléter')}</li>
        <li class="muted">{CONTACT['hours']}</li>
      </ul></div>
    </div>
    <p class="signature">Former les talents, concevoir des solutions et <span>connecter les opportunités.</span></p>
    <div class="footer-bottom">
      <span>© 2026 {SITE}. Tous droits réservés.</span>
      <nav aria-label="Informations légales"><a href="{pre}mentions-legales/">Mentions légales</a><a href="{pre}confidentialite/">Politique de confidentialité</a></nav>
    </div>
  </div>
</footer>
'''

def wa_float():
    if not CONTACT['whatsapp']:
        return ''
    return f'<a class="wa-float" href="https://wa.me/{CONTACT["whatsapp"]}" aria-label="Écrire sur WhatsApp" target="_blank" rel="noopener">{ic("whatsapp")}</a>\n'

def page(slug, title, desc, body, cur=None, extra=''):
    depth = 0 if slug == '' else slug.count('/')
    pre = '../' * depth
    html = head(title, desc, pre, slug, extra) + header(pre, cur if cur is not None else slug) + \
        f'<main id="contenu">\n{body.replace("{pre}", pre)}\n</main>\n' + footer(pre) + wa_float() + '</body>\n</html>\n'
    out = ROOT / slug / 'index.html'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding='utf-8')
    print('écrit', out.relative_to(ROOT))

# ------------------------------------------------------------------ composants
def cta_band(title='Vous avez une idée, un projet ou un défi numérique ?', sub='Construisons la solution ensemble.', btn='Parlons de votre projet', href='{pre}contact/'):
    return f'''<section class="section" aria-labelledby="cta-title">
  <div class="container">
    <div class="cta-band reveal">
      <div><h2 id="cta-title">{title} <span class="hl">{sub}</span></h2></div>
      <div class="btns"><a class="btn btn-light" href="{href}">{btn} {ARROW}</a></div>
    </div>
  </div>
</section>'''

def page_hero(crumb, eyebrow, h1, lead, extra=''):
    return f'''<section class="page-hero on-dark">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="container">
    <nav class="crumbs" aria-label="Fil d’Ariane"><a href="{{pre}}">Accueil</a><span aria-hidden="true">/</span><span aria-current="page">{crumb}</span></nav>
    <span class="eyebrow">{eyebrow}</span>
    <h1 class="h1" style="margin-top:16px;max-width:18ch">{h1}</h1>
    <p class="lead">{lead}</p>
    {extra}
  </div>
</section>'''

def work_card(w, h='h3'):
    cats = w['cat'].split()
    label = ' · '.join(CATL[c] for c in cats)
    attrs = ' '.join(f'data-{k}="{w[k]}"' for k in ('title', 'context', 'need', 'solution', 'deliverables', 'results', 'art'))
    return f'''<button type="button" class="work reveal" data-cat="{w["cat"]}" data-label="{label}" {attrs} aria-haspopup="dialog">
  <div class="work-media"><div class="art {w["art"]}"></div><span class="tag">{CATL[cats[0]]}</span></div>
  <div class="meta"><div><{h}>{w["title"]}</{h}><p>{w["need"]}</p></div><span class="arrow">{ARROW}</span></div>
</button>'''

def filters(gid):
    b = '<button type="button" class="filter" data-filter="all" aria-pressed="true">Tout</button>'
    b += ''.join(f'<button type="button" class="filter" data-filter="{k}" aria-pressed="false">{v}</button>' for k, v in CATS)
    return f'<div class="filters" role="group" aria-label="Filtrer les réalisations" data-filters="{gid}">{b}</div><p class="sr-only" id="{gid}-status" aria-live="polite"></p>'

CASE_DIALOG = f'''<dialog class="case" id="case" aria-labelledby="case-title">
  <button class="case-close" type="button" aria-label="Fermer">{ic('close')}</button>
  <div class="case-media"><div class="art"></div></div>
  <div class="case-body">
    <div><span class="eyebrow" data-k="cat"></span><h2 class="h3" id="case-title" data-k="title" style="margin-top:8px;font-size:1.75rem"></h2></div>
    <dl>
      <div><dt>Contexte</dt><dd data-k="context"></dd></div>
      <div><dt>Besoin du client</dt><dd data-k="need"></dd></div>
      <div><dt>Solution proposée</dt><dd data-k="solution"></dd></div>
      <div><dt>Livrables</dt><dd data-k="deliverables"></dd></div>
      <div><dt>Résultats</dt><dd data-k="results"></dd></div>
    </dl>
    <div><a class="btn" href="{{pre}}contact/">Un projet similaire ? Parlons-en {ARROW}</a></div>
  </div>
</dialog>'''

def svc_options(selected=None):
    o = '<option value="">Choisissez un service</option>'
    o += ''.join(f'<option value="{s["slug"]}">{s["title"]}</option>' for s in SERVICES)
    o += '<option value="autre">Autre / je ne sais pas encore</option>'
    return o

def success_box(title, text):
    return f'<div class="form-success" tabindex="-1" role="status"><h3>{title}</h3><p>{text}</p></div>'

# ================================================================== ACCUEIL
def home():
    svc_cards = ''
    for i, s in enumerate(SERVICES):
        feat = ' feature' if i == 0 else ''
        chips = ''.join(f'<li class="chip">{t}</li>' for t in s['tags'][:4])
        svc_cards += f'''<article class="svc{feat} reveal">
  <span class="num">0{i+1}</span>
  <span class="icon">{ic(s["icon"])}</span>
  <h3 class="h3">{s["title"]}</h3>
  <p>{s["short"]}</p>
  <ul aria-label="Exemples de prestations">{chips}</ul>
  <a class="link" href="{{pre}}services/#{s["slug"]}">Découvrir le service {ARROW}</a>
</article>'''

    whys = [('users', 'Une équipe pluridisciplinaire', 'Ingénieurs, designers, développeurs et formateurs réunis autour de votre projet.'),
            ('layers', 'Expertise technique et créative', 'La rigueur de l’ingénierie, la sensibilité du design, dans une même équipe.'),
            ('target', 'Une approche orientée résultats', 'Chaque décision part de vos objectifs et se mesure à leur aune.'),
            ('hands', 'Une pédagogie basée sur la pratique', 'On apprend en faisant : projets réels, ateliers et mises en situation.'),
            ('compass', 'Un accompagnement personnalisé', 'Un interlocuteur dédié qui vous suit avant, pendant et après le projet.')]
    why_li = ''.join(f'<li class="reveal"><span class="icon">{ic(a)}</span><div><h3 class="h3" style="font-size:1.15rem">{b}</h3><p>{c}</p></div></li>' for a, b, c in whys)

    steps = [('Comprendre votre besoin', 'Écoute, diagnostic et clarification de vos objectifs.'),
             ('Concevoir la meilleure approche', 'Une solution adaptée à votre contexte et à votre budget.'),
             ('Développer et mettre en œuvre', 'Production, tests et livraison dans les délais convenus.'),
             ('Accompagner et faire évoluer', 'Formation, suivi et améliorations continues.')]
    steps_li = ''.join(f'<li class="step reveal"><h3>{a}</h3><p>{b}</p></li>' for a, b in steps)

    works = ''.join(work_card(w) for w in WORKS[:6])

    courses = ''.join(f'''<article class="course reveal">
  <div class="top"><span class="icon">{ic("formation")}</span><span class="chip">{c[3]}</span></div>
  <h3 class="h3">{c[0]}</h3><p>{c[1]}</p>
  <dl><dt>Niveau</dt><dd>{c[2]}</dd></dl>
</article>''' for c in COURSES[:3])

    jsonld = {"@context": "https://schema.org", "@type": "Organization", "name": SITE,
              "description": "Formation, développement de solutions numériques, design, impression et accompagnement événementiel.",
              "slogan": SIGNATURE, "areaServed": "Afrique de l’Ouest"}
    extra = f'<script type="application/ld+json">{json.dumps(jsonld, ensure_ascii=False)}</script>\n'

    body = f'''
<section class="hero on-dark" aria-labelledby="hero-title">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div>
      <span class="pill"><b>KTech</b> Partenaire de votre transformation numérique</span>
      <h1 class="display" id="hero-title">Le numérique prend tout son sens quand il <span class="hl">crée des opportunités.</span></h1>
      <p class="lead">Nous accompagnons les entreprises, les entrepreneurs et les talents dans leurs ambitions numériques grâce à la formation, au développement de solutions digitales et à la créativité.</p>
      <div class="btns">
        <a class="btn" href="#expertises">Découvrir nos expertises {ARROW}</a>
        <a class="btn btn-ghost" href="{{pre}}contact/">Démarrer un projet</a>
      </div>
      <div class="trust">
        <span>{ic("check")} Formation pratique</span>
        <span>{ic("check")} Solutions sur mesure</span>
        <span>{ic("check")} Accompagnement de bout en bout</span>
      </div>
    </div>
    <div class="visual" role="img" aria-label="Composition illustrant le code, le design, la formation et la croissance réunis">
      <svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="rgba(91,140,255,.45)" stroke-width=".3"><path d="M40 30 C55 30 60 20 75 22"/><path d="M30 55 C35 70 30 75 35 80"/><path d="M60 65 C70 70 75 72 82 75"/></g></svg>
      <div class="v-card v-code" aria-hidden="true">
        <div class="dots"><i></i><i></i><i></i></div>
        <div><span class="k">const</span> projet = {{</div>
        <div>&nbsp;&nbsp;besoin: <span class="s">'clarifié'</span>,</div>
        <div>&nbsp;&nbsp;design: <span class="s">'validé'</span>,</div>
        <div>&nbsp;&nbsp;equipe: <span class="s">'formée'</span>,</div>
        <div>}}</div>
        <div><span class="c">// prêt à grandir</span></div>
        <div><span class="k">lancer</span>(projet);</div>
      </div>
      <div class="v-card v-design" aria-hidden="true">
        <div class="sw"><i style="background:#0A1A3A"></i><i style="background:#2563EB"></i><i style="background:#FFB020"></i><i style="background:#E7E9EE"></i></div>
        <div class="ph"></div>
        <small>Identité visuelle · v2</small>
      </div>
      <div class="v-card v-learn" aria-hidden="true">
        <div class="row"><div class="av"><i></i><i></i><i></i></div><span>Atelier UI/UX en cours</span></div>
        <div class="bar"><i></i></div>
        <div class="row" style="justify-content:space-between;font-size:12px;color:#A9B4CC"><span>Module 3 / 4</span><span>Projet pratique</span></div>
      </div>
      <div class="v-card v-stat" aria-hidden="true">
        <span style="font-size:12px;color:#A9B4CC">Visibilité</span>
        <b>En hausse</b>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0 35 L20 30 L40 32 L60 20 L80 14 L100 4" fill="none" stroke="#5B8CFF" stroke-width="2.5" stroke-linecap="round"/></svg>
      </div>
      <span class="v-node" style="left:62%;top:46%" aria-hidden="true"></span>
    </div>
  </div>
</section>

<section class="section" id="expertises" aria-labelledby="exp-title">
  <div class="container">
    <div class="section-head split">
      <div><span class="eyebrow">Nos expertises</span><h2 class="h2" id="exp-title" style="margin-top:12px">Cinq pôles, une même exigence : faire avancer vos projets.</h2></div>
      <p class="lead">De la montée en compétences au produit fini, nous couvrons toute la chaîne numérique pour que vous n’ayez qu’un seul partenaire.</p>
    </div>
    <div class="svc-grid reveal-group">{svc_cards}</div>
  </div>
</section>

<section class="section on-dark" aria-labelledby="why-title">
  <div class="container why">
    <div class="sticky">
      <span class="eyebrow">Pourquoi KTech Solutions ?</span>
      <h2 class="h2" id="why-title" style="margin-top:12px">Un partenaire technologique qui s’engage à vos côtés.</h2>
      <p class="lead" style="margin-top:16px">Nous ne livrons pas seulement des projets. Nous transmettons les compétences pour que vous restiez autonomes.</p>
      <blockquote class="quote">« {SIGNATURE} »<span>La signature KTech Solutions</span></blockquote>
    </div>
    <ul class="why-list">{why_li}</ul>
  </div>
</section>

<section class="section" aria-labelledby="app-title">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Notre approche</span><h2 class="h2" id="app-title">Une méthode claire, en quatre étapes.</h2></div>
    <ol class="steps reveal-group">{steps_li}</ol>
  </div>
</section>

<section class="section surface" aria-labelledby="work-title">
  <div class="container">
    <div class="section-head split">
      <div><span class="eyebrow">Nos réalisations</span><h2 class="h2" id="work-title" style="margin-top:12px">Des projets qui parlent pour nous.</h2></div>
      <div><p class="lead">Sites, applications, identités, formations et événements : un aperçu de notre travail.</p><a class="link" href="{{pre}}realisations/" style="margin-top:12px">Voir toutes les réalisations {ARROW}</a></div>
    </div>
    {filters('home-works')}
    <div><div class="work-grid three" id="home-works">{works}</div><p class="empty" hidden>Aucune réalisation dans cette catégorie pour le moment.</p></div>
  </div>
</section>

<section class="section" aria-labelledby="form-title">
  <div class="container">
    <div class="section-head split">
      <div><span class="eyebrow">Nos formations</span><h2 class="h2" id="form-title" style="margin-top:12px">Apprendre les métiers du numérique, par la pratique.</h2></div>
      <div><p class="lead">Des programmes pour les particuliers, les entrepreneurs et les équipes en entreprise.</p><a class="link" href="{{pre}}formations/" style="margin-top:12px">Voir toutes les formations {ARROW}</a></div>
    </div>
    <div class="grid g-3 reveal-group">{courses}</div>
  </div>
</section>

{cta_band()}
{CASE_DIALOG}
'''
    page('', '', 'KTech Solutions accompagne entreprises, entrepreneurs et talents : formation numérique, développement web et mobile, design, impression et événementiel.', body, cur='', extra=extra)

# ================================================================== SERVICES
def services():
    anchors = ''.join(f'<a href="#{s["slug"]}">{s["title"]}</a>' for s in SERVICES)
    poles = ''
    for i, s in enumerate(SERVICES):
        needs = ''.join(f'<li>{n}</li>' for n in s['needs'])
        offers = ''.join(f'<li>{n}</li>' for n in s['offers'])
        bens = ''.join(f'<div class="benefit"><b>{a}</b><p>{b}</p></div>' for a, b in s['benefits'])
        steps = ''.join(f'<li>{x}</li>' for x in s['steps'])
        poles += f'''<article class="pole" id="{s["slug"]}" aria-labelledby="t-{s["slug"]}">
  <div class="pole-side reveal">
    <span class="icon">{ic(s["icon"])}</span>
    <span class="eyebrow">Pôle 0{i+1}</span>
    <h2 class="h2" id="t-{s["slug"]}" style="margin-top:8px">{s["title"]}</h2>
    <p class="lead">{s["short"]}</p>
    <div class="btns"><a class="btn" href="{{pre}}contact/?service={s["slug"]}">Demander un devis {ARROW}</a></div>
  </div>
  <div class="grid">
    <div class="cols-2">
      <div class="block reveal"><h3>Les besoins auxquels il répond</h3><ul class="checks">{needs}</ul></div>
      <div class="block reveal"><h3>Nos prestations</h3><ul class="checks">{offers}</ul></div>
    </div>
    <div class="block reveal"><h3>Vos bénéfices</h3><div class="benefits">{bens}</div></div>
    <div class="block reveal"><h3>Les étapes de réalisation</h3><ol class="inline-steps">{steps}</ol></div>
  </div>
</article>'''
    body = page_hero('Nos services', 'Nos services', 'Cinq expertises pour réussir votre transformation numérique.',
                     'Formation, développement, design, impression et événementiel : choisissez un pôle ou combinez-les. Chaque prestation est adaptée à votre contexte.',
                     f'<div class="anchors" aria-label="Accès rapide aux pôles">{anchors}</div>')
    body += f'<div class="container">{poles}</div>' + cta_band('Vous ne savez pas par où commencer ?', 'Un échange de 30 minutes suffit pour y voir clair.', 'Demander un devis')
    page('services/', 'Nos services', 'Formation numérique, développement web et mobile, identité visuelle, impression et accompagnement événementiel : découvrez les cinq pôles de KTech Solutions.', body)

# ================================================================== FORMATIONS
def formations():
    courses = ''.join(f'''<article class="course reveal">
  <div class="top"><span class="icon">{ic("formation")}</span><span class="chip">{c[3]}</span></div>
  <h3 class="h3">{c[0]}</h3><p>{c[1]}</p>
  <dl><dt>Niveau</dt><dd>{c[2]}</dd><dt>Format</dt><dd>Parcours ou atelier</dd></dl>
</article>''' for c in COURSES)
    objectives = ['Maîtriser les outils et méthodes professionnels du domaine choisi.',
                  'Réaliser un projet concret, présentable à un client ou un employeur.',
                  'Gagner en autonomie et en confiance dans sa pratique.',
                  'Savoir apprendre en continu dans un secteur qui évolue vite.']
    aud = [('student', 'Étudiants et jeunes diplômés', 'Pour acquérir des compétences recherchées et construire un portfolio.'),
           ('rocket', 'Entrepreneurs', 'Pour gérer soi-même sa communication et sa présence en ligne.'),
           ('users', 'Professionnels en reconversion', 'Pour se former à un nouveau métier du numérique.'),
           ('building', 'Entreprises et organisations', 'Pour renforcer les compétences des équipes.')]
    aud_html = ''.join(f'<div class="aud reveal"><span class="icon">{ic(a)}</span><b>{b}</b><p>{c}</p></div>' for a, b, c in aud)
    methods = [('hands', 'Apprentissage par la pratique', 'L’essentiel du temps est consacré à des exercices et projets réels.'),
               ('users', 'Petits groupes', 'Des effectifs réduits pour un suivi individuel de chaque participant.'),
               ('chat', 'Coaching et retours', 'Des retours réguliers d’un formateur expert pour progresser vite.')]
    meth = ''.join(f'<div class="block reveal"><span class="icon" style="margin-bottom:16px">{ic(a)}</span><h3 style="font-size:1.1rem;letter-spacing:-.01em;text-transform:none;color:var(--texte)">{b}</h3><p class="muted">{c}</p></div>' for a, b, c in methods)
    ateliers = ['Créer sa première campagne sur les réseaux sociaux', 'Du wireframe au prototype cliquable',
                'Construire et publier un site web', 'Concevoir un logo et sa déclinaison',
                'Monter une vidéo courte pour les réseaux', 'Automatiser une tâche répétitive']
    at = ''.join(f'<li class="chip" style="font-size:.875rem;padding:8px 14px">{a}</li>' for a in ateliers)
    domains = ''.join(f'<label class="choice"><input type="checkbox" name="domaines" value="{c[0]}"><span>{c[0]}</span></label>' for c in COURSES)

    body = page_hero('Formations', 'Formations', 'Développez les compétences numériques qui comptent.',
                     'Des formations pratiques en marketing digital, design, développement et création de contenu, pour les particuliers comme pour les équipes.',
                     f'<div class="btns" style="margin-top:32px"><a class="btn" href="#demande">Demander un programme {ARROW}</a><a class="btn btn-ghost" href="#domaines">Voir les domaines</a></div>')
    body += f'''
<section class="section" id="domaines" aria-labelledby="d-title">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Domaines de formation</span><h2 class="h2" id="d-title">Six domaines, du premier pas au niveau avancé.</h2></div>
    <div class="grid g-3 reveal-group">{courses}</div>
  </div>
</section>

<section class="section surface" aria-labelledby="o-title">
  <div class="container split">
    <div class="reveal"><span class="eyebrow">Objectifs pédagogiques</span><h2 class="h2" id="o-title" style="margin:12px 0 16px">Repartir avec des compétences, et la preuve qu’on les maîtrise.</h2><p class="lead">Chaque parcours est construit autour d’objectifs mesurables et se termine par une réalisation concrète.</p></div>
    <ul class="checks reveal" style="gap:16px;font-size:1.05rem">{''.join(f'<li>{o}</li>' for o in objectives)}</ul>
  </div>
</section>

<section class="section on-dark" aria-labelledby="a-title">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Publics concernés</span><h2 class="h2" id="a-title">Des formations pour chaque parcours.</h2></div>
    <div class="audience reveal-group">{aud_html}</div>
  </div>
</section>

<section class="section" aria-labelledby="m-title">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Méthodes d’apprentissage</span><h2 class="h2" id="m-title">On apprend mieux en faisant.</h2></div>
    <div class="methods reveal-group">{meth}</div>
    <div class="block reveal" style="margin-top:24px"><h3>Exemples d’ateliers pratiques</h3><ul style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px">{at}</ul></div>
  </div>
</section>

<section class="section" aria-labelledby="e-title" style="padding-top:0">
  <div class="container">
    <div class="panel split reveal">
      <div><span class="eyebrow">Formation en entreprise</span><h2 class="h2" id="e-title" style="margin:12px 0 16px">Un programme conçu pour vos équipes.</h2><p class="lead">Nous construisons avec vous un parcours adapté à vos outils, vos enjeux et votre planning, dans vos locaux ou à distance.</p></div>
      <ul class="checks" style="gap:14px">
        <li>Diagnostic des compétences avant la formation</li>
        <li>Contenus adaptés à votre secteur et vos cas réels</li>
        <li>Sessions en intra-entreprise ou à distance</li>
        <li>Évaluation et bilan remis à l’organisation</li>
      </ul>
    </div>
  </div>
</section>

<section class="section surface" id="demande" aria-labelledby="f-title">
  <div class="container split" style="align-items:start">
    <div class="reveal"><span class="eyebrow">Demande de programme</span><h2 class="h2" id="f-title" style="margin:12px 0 16px">Parlons de votre projet de formation.</h2><p class="lead">Dites-nous qui souhaite se former et sur quoi. Nous revenons vers vous avec une proposition de programme.</p></div>
    <div class="card reveal">
      <form class="form" novalidate>
        <div class="form-row">
          <div class="field"><label for="f-nom">Nom et prénom</label><input class="input" id="f-nom" name="nom" autocomplete="name" required><span class="error">Indiquez votre nom pour que nous puissions vous répondre.</span></div>
          <div class="field"><label for="f-email">E-mail</label><input class="input" id="f-email" name="email" type="email" autocomplete="email" required><span class="error">Vérifiez l’adresse, par exemple nom@domaine.com.</span></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="f-tel">Téléphone <span class="opt">(facultatif)</span></label><input class="input" id="f-tel" name="telephone" type="tel" autocomplete="tel"></div>
          <div class="field"><label for="f-profil">Vous êtes</label><select class="input" id="f-profil" name="profil" required><option value="">Choisissez votre profil</option><option>Particulier</option><option>Entrepreneur</option><option>Entreprise ou organisation</option></select><span class="error">Choisissez votre profil.</span></div>
        </div>
        <fieldset class="field" style="border:0;padding:0"><legend style="font-size:.9rem;font-weight:600;margin-bottom:8px">Domaines qui vous intéressent</legend><div class="choices">{domains}</div></fieldset>
        <div class="field"><label for="f-msg">Votre besoin <span class="opt">(facultatif)</span></label><textarea class="input" id="f-msg" name="message" placeholder="Nombre de participants, niveau, période souhaitée…"></textarea></div>
        <p class="form-error" hidden style="color:var(--err)">L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez.</p>
        <div><button class="btn" type="submit">Envoyer ma demande {ARROW}</button></div>
        <p class="form-note">Vos informations servent uniquement à répondre à votre demande.</p>
      </form>
      {success_box('Merci, votre demande est bien reçue.', 'Notre équipe pédagogique vous recontacte rapidement avec une proposition de programme.')}
    </div>
  </div>
</section>
'''
    page('formations/', 'Formations', 'Formations pratiques en marketing digital, UI/UX design, développement web et mobile, design graphique et montage vidéo, pour particuliers et entreprises.', body)

# ================================================================== RÉALISATIONS
def realisations():
    works = ''.join(work_card(w, 'h2') for w in WORKS)
    body = page_hero('Réalisations', 'Réalisations', 'Des projets concrets, des résultats visibles.',
                     'Développement, design, formation, événementiel : découvrez comment nous accompagnons nos clients. Ouvrez une réalisation pour voir le contexte, la solution et les livrables.')
    body += f'''
<section class="section" aria-label="Portfolio">
  <div class="container">
    {filters('works')}
    <div><div class="work-grid three" id="works">{works}</div><p class="empty" hidden>Aucune réalisation dans cette catégorie pour le moment.</p></div>
  </div>
</section>
{cta_band('Votre projet pourrait être le prochain.', 'Parlons-en.')}
{CASE_DIALOG}'''
    page('realisations/', 'Réalisations', 'Portfolio de KTech Solutions : sites web, applications, identités visuelles, formations et accompagnements événementiels.', body)

# ================================================================== À PROPOS
def apropos():
    values = [('Innovation', 'Chercher en permanence de meilleures façons de faire.'),
              ('Excellence', 'Viser un haut niveau de qualité dans chaque livrable.'),
              ('Collaboration', 'Construire avec nos clients, jamais à leur place.'),
              ('Transmission', 'Partager nos savoirs pour rendre chacun autonome.'),
              ('Engagement', 'Tenir nos promesses, du premier échange au suivi.'),
              ('Créativité', 'Oser des idées qui distinguent nos clients.')]
    vals = ''.join(f'<div class="value reveal"><span class="n">0{i+1}</span><b>{a}</b><p>{b}</p></div>' for i, (a, b) in enumerate(values))
    team = [('Ingénierie & développement', 'Ingénieurs et développeurs web et mobile.'),
            ('Design & créativité', 'Designers UI/UX, graphistes et créateurs de contenu.'),
            ('Formation & coaching', 'Coachs-formateurs issus du terrain.'),
            ('Conseil & accompagnement', 'Chefs de projet et consultants en transformation digitale.')]
    person = '<svg viewBox="0 0 100 110" aria-hidden="true"><circle cx="50" cy="34" r="22" fill="currentColor"/><path d="M6 110c0-26 20-44 44-44s44 18 44 44Z" fill="currentColor"/></svg>'
    tm = ''.join(f'<div class="member reveal"><div class="ph">{person}<span class="chip">Photo à venir</span></div><b>{a}</b><p>{b}</p></div>' for a, b in team)
    steps = [('Écouter', 'Comprendre votre contexte, vos contraintes et vos ambitions.'),
             ('Co-construire', 'Imaginer la solution avec vous, étape par étape.'),
             ('Réaliser', 'Produire avec rigueur, en toute transparence.'),
             ('Transmettre', 'Vous rendre autonomes et rester disponibles.')]
    st = ''.join(f'<li class="step reveal"><h3>{a}</h3><p>{b}</p></li>' for a, b in steps)
    body = page_hero('À propos', 'À propos', 'Des talents au service de la transformation numérique.',
                     'KTech Solutions réunit ingénieurs, professionnels du numérique et coachs-formateurs autour d’une conviction : le numérique doit créer des opportunités pour tous.')
    body += f'''
<section class="section" aria-labelledby="h-title">
  <div class="container story">
    <div class="reveal"><span class="eyebrow">Notre histoire</span><h2 class="h2" id="h-title" style="margin-top:12px">Né d’un constat : les compétences numériques ouvrent des portes.</h2></div>
    <div class="reveal lead" style="color:var(--texte-2)">
      <p>KTech Solutions est née de la rencontre entre des ingénieurs, des créatifs et des formateurs qui partageaient une même observation : beaucoup d’organisations et de talents ont des idées fortes, mais manquent d’outils, de compétences ou d’accompagnement pour les concrétiser.</p>
      <p>Nous avons donc réuni sous un même toit la formation, le développement de solutions, le design, l’impression et l’accompagnement événementiel, pour offrir un partenaire unique, capable de suivre un projet de l’idée à sa réussite.</p>
    </div>
  </div>
</section>

<section class="section surface" aria-label="Mission et vision">
  <div class="container mv">
    <div class="card reveal"><span class="icon">{ic("target")}</span><h3 class="h3">Notre mission</h3><p class="muted">Rendre les compétences et les solutions numériques accessibles, valoriser les talents locaux et accompagner les organisations dans leur développement.</p></div>
    <div class="card reveal" style="background:var(--nuit);color:var(--texte-inv);border-color:var(--nuit)"><span class="icon" style="background:rgba(91,140,255,.14);color:var(--elec-l)">{ic("eye")}</span><h3 class="h3">Notre vision</h3><p style="color:var(--texte-inv-2)">Devenir un acteur de référence de l’innovation et de la transformation numérique en Afrique.</p></div>
  </div>
</section>

<section class="section" aria-labelledby="v-title">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Nos valeurs</span><h2 class="h2" id="v-title">Six valeurs qui guident chacune de nos décisions.</h2></div>
    <div class="values">{vals}</div>
  </div>
</section>

<section class="section surface" aria-labelledby="t-title">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Notre équipe</span><h2 class="h2" id="t-title">Une équipe pluridisciplinaire.</h2><p class="lead">Des profils complémentaires mobilisés selon les besoins de chaque projet.</p></div>
    <div class="team reveal-group">{tm}</div>
  </div>
</section>

<section class="section" aria-labelledby="w-title">
  <div class="container">
    <div class="section-head"><span class="eyebrow">Notre approche de travail</span><h2 class="h2" id="w-title">Proches de vous, exigeants avec nous-mêmes.</h2></div>
    <ol class="steps reveal-group">{st}</ol>
  </div>
</section>
{cta_band('Envie de construire quelque chose ensemble ?', 'Nous sommes à l’écoute.')}'''
    page('a-propos/', 'À propos', 'Histoire, mission, vision, valeurs et équipe de KTech Solutions, partenaire de la transformation numérique en Afrique.', body)

# ================================================================== CONTACT
def contact():
    wa = (f'<a class="btn btn-wa" href="https://wa.me/{CONTACT["whatsapp"]}" target="_blank" rel="noopener">{ic("whatsapp")} Écrire sur WhatsApp</a>'
          if CONTACT['whatsapp'] else f'<span class="btn btn-wa" aria-disabled="true" style="opacity:.6;cursor:not-allowed">{ic("whatsapp")} WhatsApp (numéro à venir)</span>')
    soc = ''.join(f'<a href="{u}" aria-label="{n.capitalize()}">{ic(n)}</a>' for n, u in CONTACT['socials'].items())
    body = page_hero('Contact', 'Contact', 'Parlons de votre projet.',
                     'Décrivez votre besoin en quelques lignes. Nous vous répondons rapidement pour fixer un premier échange, sans engagement.')
    body += f'''
<section class="section">
  <div class="container contact-grid">
    <div class="card reveal">
      <h2 class="h3" style="margin-bottom:24px">Votre demande</h2>
      <form class="form" novalidate>
        <div class="form-row">
          <div class="field"><label for="c-nom">Nom et prénom</label><input class="input" id="c-nom" name="nom" autocomplete="name" required><span class="error">Indiquez votre nom pour que nous puissions vous répondre.</span></div>
          <div class="field"><label for="c-email">E-mail</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required><span class="error">Vérifiez l’adresse, par exemple nom@domaine.com.</span></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="c-tel">Téléphone</label><input class="input" id="c-tel" name="telephone" type="tel" autocomplete="tel" inputmode="tel" required pattern="[0-9+ ().-]{{8,}}"><span class="hint">Avec l’indicatif, ex. +221…</span><span class="error">Indiquez un numéro valide, avec l’indicatif.</span></div>
          <div class="field"><label for="c-ent">Entreprise <span class="opt">(facultatif)</span></label><input class="input" id="c-ent" name="entreprise" autocomplete="organization"></div>
        </div>
        <div class="field"><label for="service">Service recherché</label><select class="input" id="service" name="service" required>{svc_options()}</select><span class="error">Choisissez un service, ou « Autre ».</span></div>
        <div class="field"><label for="c-msg">Description du projet</label><textarea class="input" id="c-msg" name="message" required minlength="10" placeholder="Votre objectif, vos délais, votre budget si vous l’avez déjà en tête…"></textarea><span class="error">Décrivez votre projet en quelques mots (10 caractères minimum).</span></div>
        <p class="form-error" hidden style="color:var(--err)">L’envoi n’a pas abouti. Vérifiez votre connexion et réessayez.</p>
        <div><button class="btn" type="submit">Envoyer ma demande {ARROW}</button></div>
        <p class="form-note">Vos informations servent uniquement à répondre à votre demande.</p>
      </form>
      {success_box('Merci, votre message est bien envoyé.', 'Nous revenons vers vous rapidement pour organiser un premier échange.')}
    </div>
    <aside class="panel reveal" aria-label="Coordonnées">
      <h2 class="h3" style="margin-bottom:24px">Nos coordonnées</h2>
      <ul class="info-list">
        <li><span class="icon">{ic("pin")}</span><div><small>Adresse</small>{contact_value('address', 'À compléter')}</div></li>
        <li><span class="icon">{ic("phone")}</span><div><small>Téléphone</small>{contact_value('phone', 'À compléter')}</div></li>
        <li><span class="icon">{ic("mail")}</span><div><small>E-mail</small>{contact_value('email', 'À compléter')}</div></li>
        <li><span class="icon">{ic("clock")}</span><div><small>Horaires</small>{CONTACT['hours']}</div></li>
      </ul>
      <div style="margin-top:32px">{wa}</div>
      <div class="socials" style="margin-top:24px">{soc}</div>
    </aside>
  </div>
</section>'''
    page('contact/', 'Contact', 'Contactez KTech Solutions pour un devis, une formation ou un projet numérique : formulaire, téléphone, e-mail et WhatsApp.', body)

# ================================================================== LÉGAL
def legal():
    for slug, title, txt in [
        ('mentions-legales/', 'Mentions légales', 'Éditeur du site, hébergeur, responsable de publication et propriété intellectuelle : ces informations seront complétées avec les données officielles de KTech Solutions.'),
        ('confidentialite/', 'Politique de confidentialité', 'Les données transmises via nos formulaires servent uniquement à répondre à vos demandes. Elles ne sont ni vendues ni cédées. Vous pouvez demander leur consultation ou leur suppression à tout moment. La version complète de cette politique sera publiée avec les informations officielles de l’entreprise.')]:
        body = page_hero(title, 'Informations', title, txt)
        page(slug, title, f'{title} du site KTech Solutions.', body, cur='none')

# ================================================================== DESIGN SYSTEM
def design_system():
    sw = [('Bleu nuit', '#0A1A3A', '#F7F5F0', '--nuit', 'Texte principal, fonds sombres, confiance', '15.8:1 sur blanc cassé'),
          ('Bleu électrique', '#2563EB', '#FFFFFF', '--elec', 'Actions, liens, accents d’innovation', '5.2:1 avec blanc'),
          ('Bleu électrique clair', '#5B8CFF', '#0A1A3A', '--elec-l', 'Liens et accents sur fond nuit', '5.4:1 sur nuit'),
          ('Blanc cassé', '#F7F5F0', '#0A1A3A', '--creme', 'Fond principal, clarté', '15.8:1 avec nuit'),
          ('Gris clair', '#E7E9EE', '#0A1A3A', '--gris', 'Bordures, surfaces secondaires', '14.2:1 avec nuit'),
          ('Ambre (accent)', '#FFB020', '#0A1A3A', '--accent', 'Accent rare : badges, points de connexion', '9.4:1 avec nuit'),
          ('Gris texte', '#4B5568', '#FFFFFF', '--texte-2', 'Texte secondaire', '6.9:1 sur blanc cassé'),
          ('Bleu nuit 2', '#0F2350', '#F7F5F0', '--nuit-2', 'Cartes sur fond sombre', '—')]
    swh = ''.join(f'<div class="ds-swatch"><div class="c" style="background:{h};color:{fg}">{h}</div><div class="d"><b>{n}</b><br><code>{v}</code><p class="muted" style="margin-top:6px">{r}</p><p style="margin-top:4px;font-size:.75rem;font-weight:600;color:var(--ok)">Contraste {c}</p></div></div>' for n, h, fg, v, r, c in sw)
    ty = [('Display', 'var(--t-display)', '40 → 76 px · 700 · -0.035em · 1.04', 'Le numérique crée des opportunités.'),
          ('H1', 'var(--t-h1)', '36 → 60 px · 700 · -0.025em · 1.1', 'Titre de page'),
          ('H2', 'var(--t-h2)', '28 → 44 px · 700 · -0.025em · 1.1', 'Titre de section'),
          ('H3', 'var(--t-h3)', '19 → 24 px · 700 · -0.015em · 1.25', 'Titre de carte'),
          ('Lead', 'var(--t-lead)', '17 → 20 px · 400 · 1.55', 'Texte d’introduction, plus grand et plus aéré.'),
          ('Body', '1rem', '16 px · 400 · 1.6', 'Texte courant, optimisé pour la lecture sur mobile.'),
          ('Eyebrow', '.75rem', '12 px · 700 · +0.14em · majuscules', 'SURTITRE DE SECTION')]
    tyh = ''.join(f'<div><span class="ds-meta">{a} — {c}</span><span style="font-size:{b};font-weight:{"400" if a in ("Lead","Body") else "700"};letter-spacing:{"-.03em" if a not in ("Lead","Body","Eyebrow") else ".14em" if a=="Eyebrow" else "0"};line-height:1.15">{d}</span></div>' for a, b, c, d in ty)
    sp = ''.join(f'<div style="text-align:center"><i style="width:{v}px;height:{v}px"></i><span class="ds-meta">{v}</span></div>' for v in (4, 8, 12, 16, 24, 32, 48, 64))
    body = page_hero('Design system', 'Direction artistique', 'Design system KTech Solutions.',
                     'Les fondations visuelles du site : principes, palette, typographie, espacements, composants, interactions et rendus par écran. Document de référence pour la phase de développement.')
    body += f'''
<section class="section"><div class="container">
  <div class="section-head"><span class="eyebrow">01 · Direction artistique</span><h2 class="h2">Professionnel sans être froid. Technologique sans être compliqué.</h2></div>
  <div class="grid g-3">
    <div class="block"><h3>Éditorial</h3><p class="muted">Grands titres serrés, beaucoup d’air, une idée par section. La hiérarchie guide la lecture.</p></div>
    <div class="block"><h3>Technologique</h3><p class="muted">Bleu nuit et bleu électrique, grille fine, compositions de cartes évoquant code, design et données.</p></div>
    <div class="block"><h3>Humain</h3><p class="muted">Ton chaleureux, blanc cassé plutôt que blanc pur, formes arrondies, accent ambre comme « point de connexion ».</p></div>
  </div>
  <p class="muted" style="margin-top:24px">Le logo associe un « K » en deux traits, l’un blanc cassé (le socle, la formation), l’autre bleu électrique (l’élan, les solutions), reliés par un point ambre : la connexion des opportunités.</p>
</div></section>

<section class="section surface"><div class="container">
  <div class="section-head"><span class="eyebrow">02 · Palette</span><h2 class="h2">Couleurs et contrastes (WCAG AA vérifié).</h2><p class="lead">Répartition 60 / 30 / 10 : blanc cassé et gris clair, bleu nuit, puis bleu électrique. L’ambre reste sous 2 % de la surface.</p></div>
  <div class="grid g-4">{swh}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section-head"><span class="eyebrow">03 · Typographie</span><h2 class="h2">Manrope, une seule famille.</h2><p class="lead">Une seule police variable (400 à 800) limite le poids de la page. Échelle fluide qui s’adapte du mobile au grand écran.</p></div>
  <div class="ds-type">{tyh}</div>
</div></section>

<section class="section surface"><div class="container">
  <div class="section-head"><span class="eyebrow">04 · Espacements, rayons, ombres</span><h2 class="h2">Une grille de 4 et 8 px.</h2></div>
  <div class="ds-space">{sp}</div>
  <table class="ds" style="margin-top:40px">
    <thead><tr><th>Jeton</th><th>Valeur</th><th>Usage</th></tr></thead>
    <tbody>
      <tr><td><code>--r-sm</code> / <code>--r</code> / <code>--r-lg</code></td><td>6 / 10 / 16 px</td><td>Badges · champs · cartes</td></tr>
      <tr><td><code>--r-pill</code></td><td>999 px</td><td>Boutons, filtres, puces</td></tr>
      <tr><td><code>--sh-1</code> → <code>--sh-3</code></td><td>3 niveaux</td><td>Bordure d’abord, ombre douce au survol, ombre forte pour les modales</td></tr>
      <tr><td><code>--section</code></td><td>72 → 128 px</td><td>Espace vertical entre sections</td></tr>
      <tr><td><code>--max</code></td><td>1200 px</td><td>Largeur maximale du contenu</td></tr>
      <tr><td>Points de rupture</td><td>640 · 700 · 900 · 1000 · 1080 px</td><td>Mobile first : 1 → 2 → 3/4 colonnes ; menu complet dès 1080 px</td></tr>
    </tbody>
  </table>
</div></section>

<section class="section"><div class="container">
  <div class="section-head"><span class="eyebrow">05 · Composants</span><h2 class="h2">Composants réutilisables.</h2></div>
  <div class="grid">
    <div class="block"><h3>Boutons</h3><div class="ds-row"><a class="btn" href="#">Action principale {ARROW}</a><a class="btn btn-ghost" href="#">Secondaire</a><a class="btn btn-sm" href="#">Petit</a><a class="link" href="#">Lien texte {ARROW}</a></div><p class="muted" style="margin-top:12px;font-size:.875rem">Hauteur minimale 48 px (cible tactile), libellés à l’infinitif ou à l’impératif, flèche qui glisse au survol.</p></div>
    <div class="block on-dark" style="background:var(--nuit)"><h3 style="color:var(--texte-inv-2)">Sur fond sombre</h3><div class="ds-row"><a class="btn btn-light" href="#">Clair {ARROW}</a><a class="btn btn-ghost" href="#">Contour</a><span class="pill"><b>KTech</b> Badge</span></div></div>
    <div class="block"><h3>Puces et filtres</h3><div class="ds-row"><span class="chip">Marketing digital</span><span class="chip">UI/UX</span><button class="filter" aria-pressed="true" type="button">Actif</button><button class="filter" aria-pressed="false" type="button">Inactif</button></div></div>
    <div class="block"><h3>Champs de formulaire</h3><div class="form-row">
      <div class="field"><label for="ds1">Champ normal</label><input class="input" id="ds1" placeholder="Format d’exemple"></div>
      <div class="field invalid"><label for="ds2">Champ en erreur</label><input class="input" id="ds2" value="nom@" aria-invalid="true"><span class="error">Vérifiez l’adresse, par exemple nom@domaine.com.</span></div>
    </div><p class="muted" style="margin-top:12px;font-size:.875rem">Libellé toujours visible, validation à la sortie du champ, erreur effacée dès la correction, message qui explique comment corriger.</p></div>
    <div class="grid g-3">
      <article class="svc"><span class="icon">{ic("dev")}</span><h3 class="h3">Carte service</h3><p>Icône, titre, description courte, lien.</p><a class="link" href="#">Découvrir {ARROW}</a></article>
      <article class="course"><div class="top"><span class="icon">{ic("formation")}</span><span class="chip">En ligne</span></div><h3 class="h3">Carte formation</h3><p>Niveau et format en pied de carte.</p><dl><dt>Niveau</dt><dd>Débutant</dd></dl></article>
      <li class="step" style="list-style:none;counter-reset:s"><h3>Carte étape</h3><p>Numéro, titre, description.</p></li>
    </div>
  </div>
</div></section>

<section class="section surface"><div class="container">
  <div class="section-head"><span class="eyebrow">06 · Interactions et micro-animations</span><h2 class="h2">Des mouvements utiles, jamais décoratifs.</h2></div>
  <table class="ds">
    <thead><tr><th>Interaction</th><th>Comportement</th><th>Durée</th></tr></thead>
    <tbody>
      <tr><td>Apparition au scroll</td><td>Fondu + translation de 20 px, décalage de 80 ms entre éléments d’un groupe</td><td>700 ms</td></tr>
      <tr><td>Survol carte</td><td>Élévation de 2 à 3 px, bordure plus marquée, ombre douce</td><td>250 ms</td></tr>
      <tr><td>Survol bouton</td><td>Couleur plus profonde, flèche +3 px</td><td>250 ms</td></tr>
      <tr><td>Réalisation</td><td>Zoom de l’image 1.04, flèche qui se remplit ; ouverture en fenêtre modale</td><td>600 / 250 ms</td></tr>
      <tr><td>Menu mobile</td><td>Burger qui devient croix, panneau en fondu ; fermeture par Échap</td><td>250 ms</td></tr>
      <tr><td>Hero</td><td>Cartes en flottement lent, lignes de connexion animées</td><td>7 s / 18 s</td></tr>
      <tr><td>Mouvement réduit</td><td>Toutes les animations désactivées si l’utilisateur le demande (prefers-reduced-motion)</td><td>—</td></tr>
    </tbody>
  </table>
  <p class="muted" style="margin-top:16px">Seules les propriétés <code>opacity</code> et <code>transform</code> sont animées : fluide même sur les téléphones d’entrée de gamme.</p>
</div></section>

<section class="section"><div class="container">
  <div class="section-head"><span class="eyebrow">07 · Rendus par écran</span><h2 class="h2">Desktop, tablette et mobile.</h2><p class="lead">Aperçus en direct de la page d’accueil (nécessite que le site soit servi par un serveur web).</p></div>
  <div class="frames">
    <div class="frame"><header><span>Desktop</span><span>1440 px</span></header><div class="vp" data-w="1440" data-h="900"><iframe src="{{pre}}" title="Aperçu desktop" loading="lazy" tabindex="-1"></iframe></div></div>
    <div class="frame"><header><span>Tablette</span><span>834 px</span></header><div class="vp" data-w="834" data-h="1112"><iframe src="{{pre}}" title="Aperçu tablette" loading="lazy" tabindex="-1"></iframe></div></div>
    <div class="frame"><header><span>Mobile</span><span>390 px</span></header><div class="vp" data-w="390" data-h="844"><iframe src="{{pre}}" title="Aperçu mobile" loading="lazy" tabindex="-1"></iframe></div></div>
  </div>
  <script>
  (function(){{function fit(){{document.querySelectorAll('.frame .vp').forEach(function(v){{var w=+v.dataset.w,h=+v.dataset.h,s=v.clientWidth/w,f=v.querySelector('iframe');f.style.width=w+'px';f.style.height=h+'px';f.style.transform='scale('+s+')';v.style.height=(h*s)+'px';}});}}addEventListener('resize',fit);addEventListener('load',fit);fit();}})();
  </script>
</div></section>

<section class="section surface"><div class="container">
  <div class="section-head"><span class="eyebrow">08 · SEO et performance</span><h2 class="h2">Pensé pour les connexions mobiles d’Afrique de l’Ouest.</h2></div>
  <ul class="checks" style="gap:12px;max-width:760px">
    <li>Aucune image lourde : illustrations en CSS et SVG, page d’accueil très légère.</li>
    <li>Une seule police variable chargée avec <code>display=swap</code> ; texte lisible immédiatement.</li>
    <li>JavaScript minimal, chargé en différé ; le site reste utilisable sans JavaScript.</li>
    <li>HTML sémantique : un H1 par page, H2 par section, H3 par carte ; landmarks et fil d’Ariane.</li>
    <li>Titres et descriptions uniques par page, balises Open Graph, données structurées Organization.</li>
    <li>URLs propres : /services/, /formations/, /realisations/, /a-propos/, /contact/.</li>
    <li>Navigation clavier complète, focus visible, lien d’évitement, contrastes AA.</li>
    <li>Photos futures : formats WebP/AVIF, attributs width/height et <code>loading="lazy"</code>.</li>
  </ul>
</div></section>
'''
    page('design-system/', 'Design system', 'Direction artistique, palette, typographie, composants et interactions du site KTech Solutions.', body, cur='none')

if __name__ == '__main__':
    (ROOT / 'assets').mkdir(exist_ok=True)
    (ROOT / 'assets' / 'favicon.svg').write_text(mark().replace(' class="brand-mark"', ' xmlns="http://www.w3.org/2000/svg"').replace(' aria-hidden="true"', ''), encoding='utf-8')
    home(); services(); formations(); realisations(); apropos(); contact(); legal(); design_system()
