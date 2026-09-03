# Groupe Baruck
Migration du site vitrine Groupe Baruck vers Next.js 16.
Stack : App Router, TypeScript strict, Tailwind CSS v4 et export statique.
La maquette HTML de référence vit dans `maquette/`.
`npm run dev` lance le serveur local.
`npm run build` génère l’export statique dans `out/`.
`npm run lint` contrôle ESLint.
`npm run typecheck` contrôle TypeScript.
Le site reste hébergé sur GitHub Pages.
En production, `NEXT_PUBLIC_BASE_PATH=/groupe-baruck` préfixe les assets.
