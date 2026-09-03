# AGENTS.md — Site Groupe Baruck (Next.js)

## Contexte
Site vitrine du Groupe Baruck (client : Djoro Joël Shaloom Krasso), réalisé par GassTech Solutions (Mohamed Gassama). Migration d'une maquette HTML (dossier `maquette/`, référence en lecture seule) vers Next.js. Plan : `plan-migration-nextjs.md` (non commité).

## Méthode
- Claude planifie et relit (code, faits). Codex implémente. Mohamed est seul juge du rendu visuel.
- Une étape = un brief = un commit = un compte rendu. S'arrêter après chaque étape.
- Pas de captures d'écran ni de jugement sur le rendu : dire à Mohamed ce qu'il doit regarder.
- Ne rien faire qui ne soit pas dans le brief en cours.

## Stack et conventions
- Next.js 16, App Router, TypeScript strict, React 19, npm, Tailwind CSS v4. Export statique (`output: "export"`, `trailingSlash: true`). Pas de CSS-in-JS, aucune dépendance nouvelle sans accord.
- Arborescence : `src/app` (routes, `globals.css`), `src/components/{layout,ui,home,jeca}`, `src/data` (contenus typés), `src/lib` (helpers), `public/images/<domaine>/`.
- Styles : Tailwind uniquement. Les feuilles de `maquette/` ne sont jamais importées ; elles sont la spécification. Reprendre leurs valeurs exactes (couleurs, `clamp()`, opacités, `letter-spacing`, transitions) via les tokens `@theme` de `globals.css` ou des valeurs arbitraires ; ne jamais arrondir vers l'échelle Tailwind par défaut. Les motifs répétés (`eyebrow`, `button`, `reveal`, `section-head`, marquee) vivent dans `@layer components` de `globals.css` ou dans un composant, jamais recopiés page par page. `@keyframes` dans `globals.css`.
- Parité d'abord : même rendu, même structure de sections, mêmes textes et comportements que la maquette. Les entités HTML deviennent des caractères (`&amp;` → `&`) ; apostrophes typographiques conservées.
- Liens internes : `next/link` vers des routes (`/jeca/`), jamais `*.html`. Liens externes, `tel:`, `mailto:` : `<a>` natif avec `target="_blank" rel="noreferrer"` quand la maquette le fait.
- Images : `<img>` natif, `src={asset("/images/…")}`, `width`/`height`, `loading="lazy"` sauf image LCP, `alt` en français. Jamais `/images/…` sans `asset()`. Noms de fichiers kebab-case ASCII.
- `"use client"` uniquement pour l'interactivité (menu, carrousel, reveal, lightbox, formulaire). `window`, `document`, `matchMedia` seulement dans `useEffect`.
- Chaque page exporte `metadata` (title, description) et `viewport.themeColor` si la maquette a un `theme-color`.
- Contenus : aucun chiffre, date, nom ou dénomination absent de la maquette. Ne pas harmoniser ONG/Fondation ni les coordonnées : décisions client en attente. Pas de bouton de don, pas de backend de formulaire, pas d'analytics.

## Contrôles avant chaque commit
`npm run lint` · `npm run typecheck` · `npm run build` · et, dès que des assets ou des liens sont touchés, `NEXT_PUBLIC_BASE_PATH=/groupe-baruck npm run build` puis `grep -rn 'src="/images' out/` (doit être vide). Commits en anglais avec préfixe conventionnel.

## Ne pas faire
- Modifier ou commiter `maquette/`, `tools/`, les briefs `*.md` de la racine, `.agents/`, `.codex/`.
- Modifier `.github/workflows/pages.yml` avant l'étape « bascule ».
