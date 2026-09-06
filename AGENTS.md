# AGENTS.md — Site Groupe Baruck (Next.js)

## Contexte
Application Next.js du Groupe Baruck (client : Djoro Joël Shaloom Krasso), réalisée par GassTech Solutions (Mohamed Gassama), déployée sur GitHub Pages.

## Méthode
- Claude planifie et relit (code, faits). Codex implémente. Mohamed est seul juge du rendu visuel.
- Une étape = un brief = un commit = un compte rendu. S'arrêter après chaque étape.
- Pas de captures d'écran ni de jugement sur le rendu : dire à Mohamed ce qu'il doit regarder.
- Ne rien faire qui ne soit pas dans le brief en cours.

## Stack et conventions
- Next.js 16, App Router, TypeScript strict, React 19, npm, Tailwind CSS v4. Export statique (`output: "export"`, `trailingSlash: true`). Pas de CSS-in-JS, aucune dépendance nouvelle sans accord.
- Arborescence : `src/app` (routes, `globals.css`, `fonts/`), `src/components/{layout,ui,home,about,services,jeca,espoir-de-vie,actualites,contact}`, `src/data` (contenus typés : site, media, home, services, jeca, espoir-de-vie, actualites, contact), `src/lib` (asset, actualites), `content/actualites/*.md` (articles, frontmatter décrit dans `docs/passation.md`), `public/images/<domaine>/`.
- Styles : Tailwind uniquement. Utiliser les tokens `@theme` de `globals.css` ou des valeurs arbitraires exactes pour les couleurs, `clamp()`, opacités, `letter-spacing` et transitions ; ne jamais arrondir vers l'échelle Tailwind par défaut.
- Tailles de texte : uniquement les rôles de l'échelle typographique de `globals.css` (`text-micro`, `text-label`, `text-caption`, `text-small`, `text-body`, `text-lead`, `text-title`, `text-title-lg`, `text-display-xs` à `text-display-xl`) ; jamais `text-[…rem]` ni `text-[clamp(…)]`, sauf les glyphes décoratifs (×, ‹, ›). Polices : `font-display` (Georgia) pour les titres et valeurs mises en avant, `font-sans` (Inter) pour tout le reste. Contrôle : `grep -rnE 'text-\[[0-9.]+rem\]|text-\[clamp' src` ne doit lister que ces glyphes. Les motifs répétés (`eyebrow`, `button`, `reveal`, `section-head`, marquee) vivent dans `@layer components` de `globals.css` ou dans un composant, jamais recopiés page par page. `@keyframes` dans `globals.css`.
- Les seuils propres à une page s’écrivent en variantes arbitraires exactes (`max-[1080px]:`, `max-[1100px]:`, `max-[430px]:`, `max-[420px]:`) ; `max-tablet:`, `max-desktop:` et `wide:` restent réservés aux seuils globaux.
- Préserver le rendu, la structure des sections, les textes et les comportements existants. Les entités HTML deviennent des caractères (`&amp;` → `&`) ; apostrophes typographiques conservées.
- Liens internes : `next/link` vers des routes (`/jeca/`), jamais `*.html`. Liens externes, `tel:`, `mailto:` : `<a>` natif ; ajouter `target="_blank" rel="noreferrer"` aux liens externes ouverts dans un nouvel onglet.
- Images : `<img>` natif, `src={asset("/images/…")}`, `width`/`height`, `loading="lazy"` sauf image LCP, `alt` en français. Jamais `/images/…` sans `asset()`. Noms de fichiers kebab-case ASCII.
- `"use client"` uniquement pour l'interactivité (menu, carrousel, reveal, lightbox, formulaire). `window`, `document`, `matchMedia` seulement dans `useEffect`.
- Reveal : poser la classe `reveal` sur l'élément ; `RevealObserver` ajoute `is-visible` lorsqu'il entre dans le viewport.
- Chaque page exporte `metadata` (title, description) et `viewport.themeColor` lorsqu'une couleur de thème est définie.
- Valeurs provisoires décidées par Mohamed (horaires, réseaux, carte) : toujours accompagnées de `<ClientNote>` (« à valider avec le client »).
- Ids HTML uniques par page (`grep -o 'id="[a-z-]*"' out/index.html | sort | uniq -d` doit être vide) ; les ancres du menu Services pointent sur les cartes d'activités de l'accueil.
- Animations : CSS uniquement (`globals.css`), jamais de librairie ; respecter le bloc `prefers-reduced-motion`.
- Contenus : n'ajouter aucun chiffre, date, nom ou dénomination sans validation client. Ne pas harmoniser ONG/Fondation ni les coordonnées : décisions client en attente. Pas de bouton de don, pas de backend de formulaire, pas d'analytics.

## Contrôles avant chaque commit
`npm run lint` · `npm run typecheck` · `npm run build` · et, dès que des assets ou des liens sont touchés, `NEXT_PUBLIC_BASE_PATH=/groupe-baruck npm run build` puis `grep -rn 'src="/images' out/` (doit être vide). Commits en anglais avec préfixe conventionnel. Si Turbopack est bloqué par la sandbox, builder avec `--webpack` et le signaler dans le compte rendu.

## Ne pas faire
- Modifier `docs/`, `tools/`, `.agents/`, `.codex/` sans brief explicite. `docs/passation.md` décrit l'état du projet et la méthode de travail.
