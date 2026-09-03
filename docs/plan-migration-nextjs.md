# Plan de migration — Site Groupe Baruck : maquette HTML → Next.js

Document de pilotage. Claude planifie et relit, Codex implémente étape par étape, Mohamed vérifie le rendu.
Chaque étape reçoit son propre brief (section 5 pour l'étape 1 ; les suivants sont produits après relecture de l'étape précédente).

---

## 1. État des lieux (mesuré le 2026-09-03)

**Pages** : `index.html` (263 l.), `a-propos.html` (267), `jeca.html` (184), `espoir-de-vie.html` (133), `studio-photo.html` (219), `hotesses-evenementielles.html` (115), et 4 pages « en construction » (`groupe`, `activites`, `projets-realisations`, `contact`).

**CSS** : `styles.css` (global, 366 l.) + 5 feuilles de page (`apropos.css`, `jeca.css`, `espoir-de-vie.css`, `service.css`, `construction.css`). Chaque page charge `styles.css` + sa feuille.
- Collisions avec le global : `jeca.css` redéfinit `.reveal` et `.vision-section` ; `jeca.css` et `espoir-de-vie.css` déclarent des variables sur `:root`. Aucune collision entre feuilles de page.
- Classes d'enveloppe posées sur `<body>` : `about-body`, `service-body`, `construction-body`, `jeca-page`, `edv-page` (+ `html.jeca-document`, redondant avec `html { scroll-behavior }` du global).

**JS** : `nav.js` (menu latéral, piège de focus, en-tête `scrolled`), `script.js` (accueil : carrousel, grille d'activités, menu dupliqué, reveal, formulaire démo, année), `jeca.js` (menu dupliqué, reveal, lightbox `<dialog>`, année), `espoir-de-vie.js` et `apropos.js` (reveal, année).

**Médias** : 66 fichiers. Noms avec espaces, parenthèses et accents (`WhatsApp Image … (1).jpeg`, `ileDeGorée.jpeg`). Fichiers lourds : `jeca.png` 1,1 Mo (utilisé sur l'accueil), `espoirvie.png` 1,5 Mo (accueil, à-propos), `studio-photo-hero.png` 1,9 Mo, `hotesses-evenementielles-hero.png` 1,9 Mo. Non utilisés : `jeca-cultures-v2.png` (3 Mo), `jeca-activites.jpg`, `jecaEdition2Images/image-presiJECA.png` (2 Mo), `president-fondateur-image-dans-sectionHero-delapageJECA.jpeg`, 6 photos WhatsApp (édition 1) et 4 (édition 2). Images externes Unsplash : 5 dans `script.js`, 3 dans `styles.css` (placeholders assumés).

**Déploiement** : GitHub Pages, site de projet `https://gaslandie.github.io/groupe-baruck/` (chemin `/groupe-baruck/`), workflow `pages.yml` qui publie la racine à chaque push sur `main`. Pas de domaine personnalisé. `main` a 4 commits locaux non poussés (Espoir de Vie).

**Outils** : Node 24.18, npm 11.16, Codex CLI 0.147 (gpt-5.5). npm : `next` 16.3.4, `react` 19.2.8.

---

## 2. Décisions d'architecture

| # | Décision | Pourquoi |
|---|----------|----------|
| 1 | **Next.js 16, App Router, TypeScript, React 19, npm, Tailwind CSS v4.** Pas de CSS-in-JS, pas de nouvelle dépendance sans accord. | Choix de Mohamed (2026-09-03), conforme au brief initial. Tailwind est installé par le scaffold ; les valeurs de la maquette (couleurs, polices, `clamp()`, dégradés) deviennent des tokens `@theme` ou des valeurs arbitraires, jamais des approximations. |
| 2 | **Export statique** (`output: "export"`, `trailingSlash: true`) déployé sur **GitHub Pages**, comme aujourd'hui. `basePath` = `/groupe-baruck` injecté par variable d'environnement en CI seulement. | Hébergement inchangé, gratuit, aucun nouveau compte. Le `basePath` disparaît le jour où le client prend un domaine (fichier `CNAME`). Le code reste 100 % compatible Vercel/Netlify si on veut plus tard des previews par branche ou un backend de formulaire (attention : le plan gratuit Vercel interdit l'usage commercial). |
| 3 | **Styles réécrits en Tailwind, page par page.** Les feuilles de la maquette ne sont pas importées : elles servent de spécification (valeurs exactes). `src/app/globals.css` contient `@import "tailwindcss"`, le bloc `@theme` (tokens globaux + `jeca-*` + `edv-*`), les `@keyframes` et un petit `@layer components` pour les motifs partagés (`reveal`, `eyebrow`, `button`, marquee). | Un seul système de style, pas de feuilles par page, donc plus de fuite CSS entre routes (dans l'App Router, le CSS d'une route reste chargé après navigation) ni de classe d'enveloppe à gérer. Le coût est un port de style par page, vérifié visuellement par Mohamed contre la maquette. |
| 4 | **Parité d'abord** : même rendu, même structure de sections, mêmes textes, mêmes comportements. Les classes changent (Tailwind), pas le résultat. Les améliorations sont listées à part et appliquées seulement quand un brief les nomme. | Mohamed valide page par page en comparant à la maquette. Une migration qui change le rendu en même temps est invérifiable. |
| 5 | **Images** : `<img>` natif + helper `asset()` qui ajoute le `basePath`. Fichiers déplacés dans `public/images/<domaine>/` avec des noms kebab-case ASCII. | En export statique, `next/image` tourne en `unoptimized` et n'ajoute pas le `basePath` : il n'apporte rien et piège. L'optimisation (WebP, tailles) sera une étape dédiée après la migration. |
| 6 | **Enveloppe de page** : chaque route rend `<PageShell variant="…">` (`home`, `about`, `service`, `jeca`, `edv`, `construction`) qui applique la palette et le style d'en-tête de la variante via des classes Tailwind. En-tête, menu latéral et pied de page sont des composants partagés paramétrés par des données. | Un seul `<body>` en App Router ; la variante remplace les anciennes classes posées sur `<body>` (`jeca-page`, `edv-page`, `about-body`…). |
| 7 | **Routes** : `/`, `/a-propos/`, `/jeca/`, `/espoir-de-vie/`, `/studio-photo/`, `/hotesses-evenementielles/`, `/groupe/`, `/activites/`, `/projets-realisations/`, `/contact/`. Les anciennes URL `*.html` reçoivent un stub de redirection (étape 9). | GitHub Pages ne fait pas de redirection serveur ; des liens `…/jeca.html` ont pu être partagés au client. |
| 8 | **Branche `next-migration`**, maquette déplacée dans `maquette/` (référence en lecture seule), supprimée à la fin. `main` continue de publier la maquette jusqu'à la bascule. | Le workflow publie `main` automatiquement : travailler sur `main` casserait le site que le client regarde. |
| 9 | **Méthode** : une étape = un brief = un commit = un compte rendu. Codex s'arrête. Contrôles limités au code (`lint`, `tsc`, `build`, greps). Mohamed regarde le rendu. Claude relit le code. | Règle établie sur Espoir de Vie. |

---

## 3. Arborescence cible

```
baruck/
├── AGENTS.md                      ← règles permanentes pour Codex (créé à l'étape 1)
├── plan-migration-nextjs.md       ← ce document (non commité)
├── maquette/                      ← ancienne maquette, référence, supprimée à l'étape 10
├── tools/                         ← non suivi (dewatermark)
├── .github/workflows/pages.yml    ← remplacé à l'étape 10
├── next.config.ts  postcss.config.mjs  package.json  tsconfig.json  eslint.config.mjs
├── public/
│   ├── .nojekyll
│   └── images/{brand,president,services,jeca/edition-1..3,espoir-de-vie}/
└── src/
    ├── app/
    │   ├── layout.tsx             ← <html lang="fr">, import globals.css, metadata par défaut
│   ├── globals.css            ← @import "tailwindcss", @theme (tokens), @keyframes, @layer components
    │   ├── page.tsx               ← Accueil
    │   ├── a-propos/page.tsx  jeca/page.tsx  espoir-de-vie/page.tsx
    │   ├── studio-photo/page.tsx  hotesses-evenementielles/page.tsx
    │   ├── groupe/  activites/  projets-realisations/  contact/  (en construction)
    │   ├── not-found.tsx  sitemap.ts  robots.ts
    ├── components/
    │   ├── layout/  PageShell, SiteHeader (client), SideNav, SiteFooter, SkipLink
    │   ├── ui/      RevealObserver (client), ConstructionPage
    │   ├── home/    HeroCarousel (client), ActivitiesGrid, ContactForm (client), sections…
    │   └── jeca/    PhotoGallery, PhotoLightbox (client)
    ├── data/        site.ts (nav, contacts, colonnes de pied de page), home.ts, jeca.ts
    └── lib/         asset.ts
```

---

## 4. Étapes

Chaque étape : objectif → livrables → contrôles → commit → ce que Mohamed regarde.

### Étape 1 — Socle ✅ (2026-09-03, commits 7450343 et 430e8ff)
Branche, déplacement de la maquette, scaffold Next.js 16 + Tailwind v4, config export statique + basePath, `AGENTS.md`, `globals.css` avec les tokens `@theme` tirés des trois `:root` de la maquette, page d'accueil temporaire, build vert.
Commits : `chore: move HTML mockup to maquette/` puis `chore: scaffold Next.js 16 app (static export)`.
Mohamed : `npm run dev` affiche la page temporaire. Rien d'autre.

### Étape 2 — Médias et données ✅ (2026-09-03, commits c5bf64b et ab9eab0)
Copie des images utilisées vers `public/images/` avec la table de renommage ci-dessous. Fichiers `src/data/site.ts` (navigation numérotée 01–07 avec sous-menu, coordonnées, liens wa.me avec textes pré-remplis, colonnes de pied de page par variante), `src/data/home.ts` (`heroSlides`, `activities` de `script.js`), `src/data/jeca.ts` (3 éditions, photos avec alt/dimensions/format wide-tall/légende).
Contrôle : chaque `src` de la maquette a une correspondance ; `find public/images -name '* *'` vide.
Commit : `chore: import media and typed site data`.
Mohamed : rien à regarder.

Table de renommage (uniquement les fichiers référencés par la maquette) :

| Maquette | Cible |
|----------|-------|
| `baruck.jpg` | `images/brand/baruck-logo.jpg` |
| `jeca-logo.webp` (même image que `jeca.png`, 10 Ko au lieu de 1,1 Mo) | `images/brand/jeca-logo.webp` — le PNG n'est pas importé |
| `espoirvie.webp` (même image que `espoirvie.png`, 40 Ko au lieu de 1,5 Mo) | `images/brand/espoir-de-vie-logo.webp` — le PNG n'est pas importé |
| `president.jpg` | `images/president/portrait.jpg` |
| `presidentOnu1.jpg`, `presidentONU2.jpg` | `images/president/onu-2016-1.jpg`, `onu-2016-2.jpg` |
| `studio-photo-hero.png`, `hotesses-evenementielles-hero.png` | `images/services/studio-photo-hero.png`, `hotesses-hero.png` |
| `temp-galerie-*.jpg`, `temp-mat-*.jpg`, `temp-studio-*.jpg` | `images/services/` (mêmes noms, le préfixe `temp-` documente le provisoire) |
| `ileDeGorée.jpeg` | `images/jeca/ile-de-goree.jpeg` |
| `jecaEdition2Images/image-presiJECA.webp` | `images/jeca/president-fondateur.webp` |
| `jecaEdition1Images/…` (7 utilisées sur 13) | `images/jeca/edition-1/01.jpeg` … `07.jpeg`, dans l'ordre d'apparition dans `jeca.html` |
| `jecaEdition2Images/…` (7 utilisées sur 12) | `images/jeca/edition-2/01.jpeg` … `07.jpeg` |
| `jecaEdition3images/…` (6 sur 6) | `images/jeca/edition-3/01.jpeg` … `06.jpeg` |

Les fichiers non référencés restent dans `maquette/` (donc dans l'historique git) et ne vont pas dans `public/`.

### Étape 3 — Chrome commun + pages « en construction » ✅ (2026-09-03, commit 0f42d7b ; 3 retouches reportées à l'étape 4)
`asset()`, `PageShell`, `SiteHeader` (client : état `scrolled`, ouverture/fermeture du menu, `body.menu-open`, piège de focus, Échap, fermeture au clic sur un lien, restauration du focus), `SideNav`, `SiteFooter` piloté par `site.ts`, `RevealObserver` (IntersectionObserver, seuil 0,12, `prefers-reduced-motion` → visible immédiatement ; un seul mécanisme, documenté dans `AGENTS.md`), `ConstructionPage` (port Tailwind de `construction.css`), et les 4 routes en construction.
Décision de parité assumée : le menu latéral partagé affiche les 5 coordonnées (la maquette JECA/EDV en omettait une, « Téléphone mobile », sans raison éditoriale).
Commit : `feat: shared header, side nav, footer and construction pages`.
Mohamed : les 4 pages en construction, le menu latéral (desktop et mobile), le lien de retour.

### Étape 4 — Accueil ✅ (2026-09-03, commits 62315f5 et 6f4e021 ; 1 retouche reportée à l'étape 5)
`HeroCarousel` (port fidèle de `script.js` : 3 diapositives, 5 s, barre de progression, pause au survol et au focus, flèches clavier, balayage tactile 45 px, `prefers-reduced-motion`, transition `is-changing` 260 ms), `ActivitiesGrid` (9 cartes depuis `home.ts`, URL Unsplash conservées), sections statiques, `ContactForm` (client, même message de démonstration), année calculée au build.
Amélioration nommée (décidée à l'étape 2) : logos JECA et Espoir de Vie en `.webp` (10 Ko / 40 Ko) au lieu des PNG de 1,1 et 1,5 Mo.
Commit : `feat: migrate home page`.
Mohamed : comparaison complète avec `maquette/index.html` (desktop + mobile), carrousel, marquee, reveals, formulaire.

### Étape 5 — À propos ✅ (2026-09-03, commits 322313e et 55b48dc)
Port de `a-propos.html`, styles de `apropos.css` en Tailwind. Ancre `#experience-onu` conservée, `tabindex="-1"`.
Commit : `feat: migrate about page`.

### Étape 6 — Studio photo + Hôtesses ✅ (2026-09-03, commit 7d4f68c)
Port des 2 pages, styles de `service.css` en Tailwind. Image et position du hero en `style` inline (le chemin passe par `asset()`).
Commit : `feat: migrate studio photo and hostesses pages`.

### Étape 7 — JECA ✅ (2026-09-03, commit e3d1a68)
Palette `jeca-*` (tokens `@theme`), styles de `jeca.css` en Tailwind. `PhotoGallery` depuis `jeca.ts`, `PhotoLightbox` client (`<dialog>`, `showModal`, flèches, compteur, fermeture au clic hors image).
Commit : `feat: migrate JECA page with photo lightbox`.

### Étape 8 — Espoir de Vie ✅ (2026-09-03, commit bb0d3f1 ; 1 retouche reportée à l'étape 9 : `<picture>` à retirer)
Palette `edv-*` (tokens `@theme`), styles de `espoir-de-vie.css` en Tailwind. Port complet (cartes `data-number`, `<time datetime>`, `.edv-time`). Garde-fous éditoriaux du brief Espoir de Vie inchangés.
Commit : `feat: migrate Espoir de Vie page`.

### Étape 9 — Finitions statiques ✅ (2026-09-03, commits 3550821 et 3d235cc)
`metadata` par page vérifiée (titres, descriptions, `themeColor` JECA `#061b53` et EDV `#1a100b`), `not-found.tsx` (style construction), `sitemap.ts`, `robots.ts`, icône de site (`src/app/icon.png` depuis le logo : la maquette n'en a pas), stubs `public/*.html` avec `<meta http-equiv="refresh">` vers les nouvelles routes, `README.md` court.
Commit : `feat: metadata, sitemap, 404 and legacy URL redirects`.

### Étape 10 — Bascule ✅ côté dépôt (2026-09-03, commits baea9c6 et fusion 33cfd8e sur `main`, 20 commits en avance sur `origin/main`) — push et validation en ligne par Mohamed
Nouveau `pages.yml` : Node 24, `npm ci`, lint + typecheck, `NEXT_PUBLIC_BASE_PATH=/groupe-baruck npm run build`, upload de `out/`. Merge de `next-migration` dans `main` en local (`--no-ff`). **Le push de `main` est fait par Mohamed** (c'est le déploiement).
Commit : `ci: build and deploy Next.js static export`.
Mohamed : le site en ligne, toutes les pages, les anciennes URL `.html`, la 404, l'icône.

### Étape 11 — Nettoyage après mise en ligne ✅ (2026-09-03, commit a829856, exécutée avant le push : `main` est en avance de 21 commits, première vérification en ligne à faire après `git push origin main`)
Une fois le site en ligne validé : suppression de `maquette/` (l'historique git la conserve), `AGENTS.md` et `README.md` mis à jour (la référence devient l'historique), branche `next-migration` supprimée.
Commit : `chore: remove HTML mockup`.

### Après la migration (hors périmètre, à décider ensuite)
Formulaire de contact réel (service tiers compatible statique, ou serveur si changement d'hébergeur) · optimisation des images au build (WebP, tailles, `srcset`) · `next/font` pour Inter (aujourd'hui non chargée, le rendu tombe sur Helvetica/Arial) · vraies pages Groupe, Activités, Projets, Contact · photos Espoir de Vie originales · domaine personnalisé.

---

## 5. Points de vigilance techniques

- **Fidélité Tailwind** : reprendre les valeurs exactes de la maquette (`clamp()`, couleurs, opacités, `letter-spacing`, transitions) en tokens ou valeurs arbitraires ; ne jamais arrondir vers l'échelle Tailwind par défaut. Les motifs répétés (`eyebrow`, `button`, `reveal`, `section-head`) vivent dans `@layer components` ou dans un composant, pas recopiés dans chaque page.
- **basePath** : un `src="/images/…"` écrit en dur casse sur GitHub Pages. Toujours `asset()`. Le build de contrôle avec `NEXT_PUBLIC_BASE_PATH=/groupe-baruck` le détecte via `grep -rn 'src="/images' out/`.
- **Hydratation** : `window`, `matchMedia`, `document` uniquement dans `useEffect`. L'année est calculée au build (site reconstruit à chaque déploiement).
- **Ancres** : `href="#accueil"` sur la page courante ; `"/#activites"` depuis une autre page ; `scroll-margin-top` conservé dans les feuilles JECA/EDV.
- **`<dialog>`** : rendu serveur sans problème ; `showModal()` dans un gestionnaire d'événement.
- **Texte** : ne rien reformuler. Les apostrophes typographiques (’) et les espaces insécables de la maquette sont conservés tels quels dans le JSX (les entités `&amp;` deviennent `&`).
- **ESLint** : `@next/next/no-img-element` désactivée (choix documenté).

---

## 6. Briefs Codex

Les briefs sont donnés directement dans la conversation, une étape à la fois, après relecture de l'étape précédente. Ce fichier n'en contient pas.
