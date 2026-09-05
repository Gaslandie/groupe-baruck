# Passation — Site Groupe Baruck (Next.js) — mise à jour 2026-09-05

Notes pour reprendre le travail sur un autre poste. Code sur `https://github.com/Gaslandie/groupe-baruck` (branche `main`), site publié par GitHub Actions à chaque push sur `main` : `https://gaslandie.github.io/groupe-baruck/`.

## Reprendre sur un nouveau poste

```bash
git clone https://github.com/Gaslandie/groupe-baruck.git baruck
cd baruck
npm install
npm run dev          # http://localhost:3000
npm run build        # export statique dans out/
```

Prérequis : Node 24, npm 11, Codex CLI (config `~/.codex/config.toml`). Codex lit `AGENTS.md` à la racine. Outil `tools/dewatermark/` : voir son README (les planches `planches/` ne sont pas dans le dépôt : photos d'enfants filigranées, jamais publiées).

Mémoire de Claude Code : locale à chaque poste. Sur le nouveau poste, ouvrir Claude Code dans le dépôt et lui demander de lire ce fichier puis d'enregistrer en mémoire les sections « Méthode de travail », « Décisions client en attente » et « Backlog ».

## Méthode de travail
Claude planifie et relit (code et faits), Codex implémente, Mohamed est seul juge du rendu visuel. **Rôles inversés depuis le 2026-09-05** : Codex relit et rédige les briefs, Claude implémente en vérifiant chaque consigne avant de l'appliquer, Mohamed reste seul juge du rendu. Une étape = un brief collé dans Codex = un commit = un compte rendu ; Codex s'arrête ; Claude vérifie contre les fichiers réels (et rebuild avec Turbopack + `basePath`, voir ci-dessous) avant d'écrire le brief suivant. Les briefs se donnent dans la conversation, pas dans un fichier. Contrôles au niveau du code uniquement (`lint`, `typecheck`, `build`, greps ciblés), aucun jugement visuel par les agents. Mohamed a autorisé Claude à pousser sur `main` après vérification.

Particularités constatées : la sandbox Codex bloque Turbopack (« binding to a port »), il builde avec `--webpack` ; Claude refait le build Turbopack réel. Codex a parfois sauté un brief (le 16 a été recollé trois fois) : à chaque compte rendu, vérifier `git log` et l'état réel des fichiers. Codex a aussi déjà modifié le balisage pour faire tomber juste des comptages : toujours lire ses « écarts techniques ».

## État du site (2026-09-04, dernier commit poussé : voir `git log`)
Menu (7 entrées) : 01 Accueil `/` · 02 Le Groupe `/groupe/` (ex-page À propos, fusionnée le 2026-09-04 ; `/a-propos/` redirige) · 03 Nos services `/#activites` avec sous-menu : Studio photo `/studio-photo/`, Hôtesses `/hotesses-evenementielles/` en avant, puis les 9 domaines ancrés sur les cartes de l'accueil (`/#hotellerie`, `/#restauration`, `/#agrobusiness`, `/#studio`, `/#cinema`, `/#mobilite`, `/#communication`, `/#artistes`, `/#clips`) · 04 JECA `/jeca/` · 05 Espoir de Vie `/espoir-de-vie/` · 06 Actualités `/actualites/` + `/actualites/<slug>/` · 07 Contact `/contact/`. Hors menu : `/projets-realisations/` (en construction), 404, `sitemap.xml`, `robots.txt`, stubs `public/*.html` et `public/a-propos/index.html` (redirections).

Accueil : hero (portrait du PDG + carrousel 3 diapositives, allégé : plus de barre « À la une », de compteur ni de mention en bas) · marquee · grille des 9 activités (ids = ancres du menu) · un aperçu par page (`PageTeaser`, données `pageTeasers` dans `src/data/home.ts`, ids `apercu-*`) · 3 dernières actualités (`NewsPreview`, masqué si aucune) · CTA contact (photo Unsplash provisoire).

Actualités : un article = `content/actualites/<slug>.md` (frontmatter : `title`, `date` YYYY-MM-DD, `category` ∈ groupe | jeca | espoir-de-vie | studio-photo | hotesses, `excerpt`, `cover` + `coverAlt`, `gallery[{src,alt,caption}]`, `draft`). Chargeur `src/lib/actualites.ts` : gray-matter + marked, dimensions lues au build avec image-size (extensions jpg/jpeg/png/webp seulement), liens et images du corps préfixés par le `basePath`, brouillons visibles en `npm run dev` et exclus du build, slug réservé `a-venir` généré quand aucun article n'est publié (export statique exige au moins une route). 6 articles publiés (3 éditions JECA avec galeries en carrousel, 3 événements Espoir de Vie datés), textes repris tels quels du site. Composants `src/components/actualites/` (dont `NewsCarousel`, scroll-snap).

Contact : hero avec 3 actions directes + liste « Selon votre besoin » · 3 canaux (WhatsApp siège, fixe, e-mail) + dépliant « Autres lignes » · formulaire `src/components/contact/ContactForm.tsx` (uniquement sur `/contact/` depuis que l'accueil a été refait) : Web3Forms via `NEXT_PUBLIC_WEB3FORMS_KEY` (variable GitHub Actions `WEB3FORMS_KEY`, **pas encore créée** — repli `mailto:` tant qu'elle manque) · section carte : bloc local avec bouton « Afficher la carte » — l'iframe Google Maps (sans clé, centrée sur Kobayah) n'est montée qu'après activation (`ContactMapEmbed`, 2026-09-05 ; rien n'est chargé chez Google avant le clic, aucune mémorisation du choix), horaires, présence, réseaux — valeurs **provisoires** signalées par `<ClientNote>` « à valider avec le client ».

Espoir de Vie : hero pleine largeur sans photo du président (logo à droite) ; toutes les décorations de fond (codes pays, numéros géants, logos filigranés, anneaux, grilles) retirées sur tout le site le 2026-09-04.

Animations (étape 26, CSS seulement, `globals.css`) : boutons à balayage (`--fill` par variante, `.button`, `.jeca-button`, `.edv-button`, `.form-button`), soulignement des `.text-link` qui se redessine, `reveal-stagger` (cascade), trait des eyebrows, `reveal-media` (dézoom des images, observé par `RevealObserver`), `hero-in` (entrée des heros), cascade du menu latéral. `prefers-reduced-motion` neutralise tout.

Stack : Next.js 16.3 App Router, React 19, TypeScript strict, Tailwind v4, export statique avec `basePath` `/groupe-baruck` injecté par la CI, police Inter auto-hébergée (`next/font/local`, `src/app/fonts/inter-latin.woff2`), heros services en WebP. Dépendances ajoutées : `gray-matter`, `marked`, `image-size` (build uniquement). Composants client : `SiteHeader`, `RevealObserver`, `HeroCarousel`, `ContactForm`, `JecaGallery`, `NewsCarousel`, `ContactMapEmbed`.

Contrôle de référence avant push : `npm run lint && npm run typecheck && NEXT_PUBLIC_BASE_PATH=/groupe-baruck npm run build && grep -rn 'src="/images' out/` (vide) et `grep -o 'id="[a-z-]*"' out/index.html | sort | uniq -d` (vide).

Maquette HTML d'origine : dans l'historique (`git checkout 33cfd8e -- maquette/`). L'accueil et Contact s'en sont éloignés volontairement depuis.

## Benchmark concurrentiel

`docs/benchmark-2026-09-05.md` : comparaison du site avec 4 groupes africains (Teyliom, Guicopres, Heirs Holdings, G-CORE) et références secondaires par page. Rédigé par Claude, en attente de l'avis de Codex et de l'arbitrage de Mohamed. Rien n'y est appliqué au site pour l'instant.

## Décisions client en attente (ne pas trancher seul)
Dénomination ONG / Fondation Espoir de Vie · devise religieuse du hero Espoir de Vie · localisation et statut de l'orphelinat · actions 2018–2026 · monnaie des « 500 000 fr » · « 4000 / 2000 chaussures » · coordonnées à publier et **e-mail de réception du formulaire** (clé Web3Forms) · numéro d'agrément · libellé officiel de la JECA · date de création et chiffres clés du Groupe · photos originales d'Espoir de Vie · **lien Google Maps exact du siège, horaires, réseaux sociaux** (provisoires en ligne avec note) · photo pour le CTA contact de l'accueil. Règles Espoir de Vie : jamais « paires », « FCFA », « créée en 2015 », ni total additionné ; pas de bouton de don.

## Backlog (à décider avec Mohamed)
1. **Pages CMS** : écrire `.pages.yml` (media `public/images/actualites`, collection `content/actualites`, format yaml-frontmatter, champs ci-dessus), connecter le dépôt sur app.pagescms.org, inviter le client par e-mail (pas de compte GitHub requis). Benchmark fait le 2026-09-03 : Pages CMS retenu, Sveltia en plan B, Keystatic incompatible avec l'export statique.
2. Clé Web3Forms + variable GitHub `WEB3FORMS_KEY` dès que l'e-mail de réception est confirmé.
3. Chatbot : **en attente** (2026-09-04). Options chiffrées : A) assistant IA Claude via Cloudflare Worker gratuit + clé Anthropic payante à l'usage (≈ 0,008 $/message avec `claude-opus-5`, ≈ 0,0015 $ avec Haiku 4.5), le client devant porter compte et carte ; B) bot guidé par menus + WhatsApp, zéro coût. Mohamed choisira.
4. Page Projets & Réalisations (hors menu, en construction) : garder ou supprimer.
5. Photos Espoir de Vie + galerie ; remplacer les images Unsplash restantes (activités, CTA contact) par de vraies photos.
6. Domaine propre : retirer le `basePath`, ajouter `CNAME`.
7. Optimisation éventuelle des JPEG JECA (80–185 Ko chacun) et des `temp-*` services.
