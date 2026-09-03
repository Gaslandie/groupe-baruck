# Passation — Site Groupe Baruck (Next.js) — 2026-09-03

Notes pour reprendre le travail sur un autre poste. Code sur `https://github.com/Gaslandie/groupe-baruck` (branche `main`), site publié par GitHub Actions à chaque push sur `main` : `https://gaslandie.github.io/groupe-baruck/`.

## Reprendre sur un nouveau poste

```bash
git clone https://github.com/Gaslandie/groupe-baruck.git baruck
cd baruck
npm install
npm run dev          # http://localhost:3000
npm run build        # export statique dans out/
```

Prérequis : Node 24, npm 11, Codex CLI (config `~/.codex/config.toml`). Codex lit `AGENTS.md` à la racine. Pour l'outil `tools/dewatermark/`, voir son README (les planches-contact `planches/` ne sont pas dans le dépôt : photos d'enfants filigranées, à ne jamais publier ; elles restent sur l'ancien poste).

Mémoire de Claude Code : elle est locale à chaque poste. Sur le nouveau poste, ouvrir Claude Code dans le dépôt et lui demander de lire ce fichier puis d'enregistrer en mémoire les sections « Méthode de travail », « Décisions client en attente » et « Backlog ».

## Méthode de travail
Claude planifie et relit (code et faits), Codex implémente, Mohamed est seul juge du rendu visuel. Une étape = un brief collé dans Codex = un commit = un compte rendu ; Codex s'arrête ; Claude vérifie contre les fichiers réels avant d'écrire le brief suivant. Les briefs se donnent dans la conversation, pas dans un fichier. Contrôles uniquement au niveau du code (`lint`, `typecheck`, `build`, greps ciblés sur les balises `<img …>` et jamais sur les `<link>` générés par React), aucun jugement visuel par les agents. Codex a deux fois modifié le balisage pour faire tomber juste des comptages (un `{"\n"}` inséré, des `<picture>` autour du hero) : toujours lire les « écarts techniques » qu'il déclare et les vérifier dans le HTML exporté.

Historique de la migration (2026-09-03, un commit par étape) : socle · médias et données · chrome commun et pages en construction · accueil · à propos · services · JECA · Espoir de Vie · finitions · bascule CI · suppression de la maquette. Détail dans `docs/plan-migration-nextjs.md`.

## État du site
Dix routes : `/`, `/a-propos/`, `/jeca/`, `/espoir-de-vie/`, `/studio-photo/`, `/hotesses-evenementielles/`, `/groupe/`, `/activites/`, `/projets-realisations/`, `/contact/` (les quatre dernières « en construction »). Plus la 404, `sitemap.xml`, `robots.txt`, les icônes, OpenGraph et les redirections `public/*.html` des anciennes adresses.

Stack : Next.js 16.3 App Router, React 19, TypeScript strict, Tailwind v4 (tokens `@theme`, motifs partagés dans `@layer components`, points de rupture `max-tablet:` 760 px, `max-desktop:` 1050 px, `wide:` 1200 px, seuils propres à une page en `max-[Npx]:`), export statique avec `basePath` `/groupe-baruck` injecté par la CI (`NEXT_PUBLIC_BASE_PATH`), images en `<img>` natif via `asset()`. Contenus typés dans `src/data/` (site, media, home, services, jeca, espoir-de-vie). Composants client : `SiteHeader`, `RevealObserver`, `HeroCarousel`, `ContactForm`, `JecaGallery`.

Maquette HTML d'origine : supprimée du dépôt au commit `a829856`, intacte dans l'historique (`git show 7450343^:index.html`, ou `git checkout 33cfd8e -- maquette/` pour la restaurer temporairement). Elle reste la référence de parité visuelle.

## Décisions client en attente (ne pas trancher seul)
Dénomination officielle ONG / Fondation Espoir de Vie · devise religieuse du hero Espoir de Vie · localisation et statut actuel de l'orphelinat · actions 2018–2026 · monnaie des « 500 000 fr » · « 4000 / 2000 chaussures » (paires ?) · coordonnées à publier · numéro d'agrément · libellé officiel de la JECA · date de création et chiffres clés du Groupe · photos originales d'Espoir de Vie (promises par le client le 2026-09-02). Règles éditoriales de la page Espoir de Vie : jamais « paires », « FCFA », « créée en 2015 », ni total additionné ; pas de bouton de don.

## Backlog après migration (à décider avec Mohamed)
1. Formulaire de contact réel, compatible export statique (service tiers) ; aujourd'hui une démonstration.
2. Optimisation des images au build, d'abord les deux heros PNG de 1,9 Mo dans `public/images/services/`.
3. Photos originales d'Espoir de Vie et galerie avec lightbox (déjà écrite pour JECA : `src/components/jeca/JecaGallery.tsx`).
4. Vraies pages Groupe, Activités, Projets, Contact.
5. Police Inter via `next/font` (jamais chargée aujourd'hui, le rendu tombe sur Helvetica ou Arial).
6. Domaine propre : retirer le `basePath`, ajouter `CNAME` ; `robots.txt` devient alors effectif.
7. `AGENTS.md` : arborescence des composants à compléter (`about`, `services`, `espoir-de-vie`).
