# KTech Solutions — site web

Site vitrine de KTech Solutions : formation numérique, développement de solutions digitales,
identité visuelle, impression numérique et accompagnement événementiel.

> Former les talents, concevoir des solutions et connecter les opportunités.

## Contenu du dépôt

| Dossier | Description |
|---|---|
| `index.html` | **Version principale.** Page unique au style studio sombre : hero 3D animé, services interactifs, réalisations filtrables, formations, FAQ, formulaire de contact. Un seul fichier, aucune dépendance. |
| `version-multipage/` | Version claire en 6 pages (Accueil, Services, Formations, Réalisations, À propos, Contact) + pages légales + page *design system*. |

## Voir le site en local

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000 (version principale) ou http://localhost:8000/version-multipage/.

## Mettre en ligne

Le site est 100 % statique : GitHub Pages (Settings → Pages → branche `main`, dossier `/`), Netlify ou Vercel fonctionnent sans configuration.

## À compléter avant la mise en ligne

- Coordonnées : adresse, téléphone / WhatsApp, e-mail (badges « À compléter »).
- Liens des réseaux sociaux (actuellement `#`).
- Réalisations : les projets affichés sont des exemples à remplacer par les vrais projets.
- Formulaires : ils valident les champs mais n'envoient rien. Brancher un service (Formspree, Getform…) ou une API :
  - version principale : gestionnaire `submit` en bas de `index.html` ;
  - version multipage : constante `FORM_ENDPOINT` dans `version-multipage/assets/main.js`.
- Mentions légales et politique de confidentialité.

Dans la version multipage, le contenu se modifie dans `version-multipage/_build/build.py`, puis :

```bash
cd version-multipage && python3 _build/build.py
```

## Charte

| Rôle | Couleur |
|---|---|
| Bleu nuit | `#0A1A3A` |
| Bleu électrique | `#2563EB` / `#5B8CFF` sur fond sombre |
| Blanc cassé | `#F7F5F0` |
| Gris clair | `#E7E9EE` |
| Accent ambre | `#FFB020` |

Typographie : Manrope (Google Fonts). Contrastes vérifiés WCAG AA.
