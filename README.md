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

Le back-office PHP/MySQL pour Bluehost est dans `backoffice/` : comptes, actualités, images et préparation des publications. `npm run backoffice:local` lance l’administration locale après préparation de son environnement Docker.
Voir [le benchmark et le plan révisés](BACKOFFICE.md) et [l’installation Bluehost](backoffice/INSTALLATION.md).
La configuration Pages CMS `.pages.yml` correspond à l’ancienne piste GitHub Pages, conservée pour la prévisualisation ; elle n’est pas le back-office Bluehost.

Modifier en priorité les contenus dans `src/data`. Les tarifs du studio photo sont dans `src/data/services.ts`.
Les fichiers `public/*.html` redirigent les anciennes URL vers les routes Next.js.
L’ancienne maquette HTML reste accessible dans l’historique Git, notamment au commit `7450343` (`chore: move HTML mockup to maquette/`).

## Commandes

`npm run dev` lance le serveur local.
`npm run build` génère l’export statique dans `out/`.
`npm run lint` contrôle ESLint.
`npm run typecheck` contrôle TypeScript.
`npm test` vérifie le contrat éditorial du CMS et le chargement des articles (Node 24).
En production, `NEXT_PUBLIC_BASE_PATH=/groupe-baruck` préfixe les assets.
`NEXT_PUBLIC_SITE_URL` définit le domaine des métadonnées, du sitemap et du RSS (la prévisualisation GitHub reste la valeur par défaut).
`npm run backoffice:publish-build -- publication.json` construit le site depuis les contenus validés du back-office, sans modifier les fichiers éditoriaux du dépôt.
