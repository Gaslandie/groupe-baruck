# Groupe Baruck
Migration du site vitrine Groupe Baruck vers Next.js 16.
Stack : App Router, TypeScript strict, Tailwind CSS v4 et export statique.

## Structure

- `src/app` : routes, metadata et styles globaux.
- `src/components` : composants par page et composants partagés.
- `src/data` : contenus et données typées du site.
- `src/lib` : fonctions utilitaires, notamment les chemins d’assets.
- `public/images` : médias publics normalisés.

## Maintenance

Modifier en priorité les contenus dans `src/data`. Les tarifs du studio photo sont dans `src/data/services.ts`.
Les fichiers `public/*.html` redirigent les anciennes URL vers les routes Next.js.
L’ancienne maquette HTML reste accessible dans l’historique Git, notamment au commit `7450343` (`chore: move HTML mockup to maquette/`).

## Commandes

`npm run dev` lance le serveur local.
`npm run build` génère l’export statique dans `out/`.
`npm run lint` contrôle ESLint.
`npm run typecheck` contrôle TypeScript.
En production, `NEXT_PUBLIC_BASE_PATH=/groupe-baruck` préfixe les assets.
