# Brief Codex — Page Espoir de Vie : corrections progressives

## Contexte

Tu as implémenté `espoir-de-vie.html`, `espoir-de-vie.css`, `espoir-de-vie.js` et mis à jour `index.html` / `a-propos.html` (non committé). La page a été relue et ses faits contrôlés contre les PDF sources. Elle est bonne et conforme aux garde-fous ; il reste 4 corrections techniques et 3 corrections éditoriales. Les photos originales arrivent du client : leur intégration fera l'objet d'un brief séparé, ne l'anticipe pas.

## Règles valables pour toutes les étapes

- **Progressif** : une étape = un commit = un compte rendu. **Arrête-toi après chaque étape** et attends le feu vert avant la suivante.
- La vérification visuelle (desktop, mobile, rendu) est faite par Mohamed, pas par toi : ne produis pas de captures, ne juge pas le rendu, ne « corrige » pas ce qui n'est pas dans ce brief. Signale-lui simplement ce qu'il doit regarder.
- Commits en anglais, préfixes conventionnels du repo (`feat:`, `fix:`, `perf:`, `content:`).
- Aucun chiffre non écrit dans les planches. Jamais « paires », jamais « FCFA », jamais « créée en 2015 », jamais de total additionné (pas de « 6 000 »).
- Ne pas harmoniser les dénominations (« ONG » / « Fondation »), ne pas toucher à la devise religieuse du hero ni aux coordonnées : décisions client en attente.
- Aucun bouton de don en ligne.
- Architecture JS : `nav.js` (menu, en-tête) + `espoir-de-vie.js` (reveal, année). **Ne jamais charger `jeca.js`** (redéclaration de `const menuButton` avec `nav.js`). Ne pas modifier `nav.js`, `jeca.*`, `styles.css`.
- Contrôles de code après chaque étape : `node --check espoir-de-vie.js` et les greps indiqués. Rien d'autre.

---

## Étape 0 — Figer l'état actuel

Commit des fichiers de la page v1 : `espoir-de-vie.html`, `espoir-de-vie.css`, `espoir-de-vie.js`, `index.html`, `a-propos.html`. Ne pas ajouter ce brief.
Message : `feat: add Espoir de Vie page (text-first v1)`.

---

## Étape 1 — Corrections techniques

**A1 — Logo 1,5 Mo.** `espoirvie.png` (1346×1169, RGB opaque sur fond noir) est chargé 3 fois dans la page, dont une en `fetchpriority="high"`. Précédent du repo : `jeca-logo.webp` (10 Ko, commit `47a140e`).
- Créer `espoirvie.webp` en 600 px de large : `python3 -c "from PIL import Image; im=Image.open('espoirvie.png'); im.thumbnail((600,600)); im.save('espoirvie.webp','WEBP',quality=85,method=6); print(im.size)"`.
- Dans `espoir-de-vie.html`, remplacer les 3 `src="espoirvie.png"` par `espoirvie.webp` et mettre à jour `width`/`height` avec les dimensions imprimées. Retirer `fetchpriority="high"` du logo du hero (il n'est pas le LCP ; le portrait le garde).
- Ne pas toucher aux usages de `espoirvie.png` dans `index.html` / `a-propos.html` (hors périmètre).

**A2 — Rectangle sombre.** Le PNG opaque à `opacity: .09` crée une colonne plus foncée dans le CTA, et la même mécanique existe sur le panneau orphelinat. Ajouter `mix-blend-mode: screen` sur `.edv-orphanage-mark img` et sur `.edv-cta > img` (garder l'opacité). C'est déjà ce qui fait fonctionner le logo dans le hero.

**A3 — Numéro fantôme absent.** `.edv-action-card::after { content: attr(data-number) }` mais aucune carte n'a `data-number`. Ajouter `data-number="01"` … `"06"` sur les six `article.edv-action-card`, dans l'ordre affiché.

**A4 — `<time>` invalides.** Six `<time>` sans `datetime` contiennent du texte non-date (« Étape 01 », « Étape 02 », « Rentrées scolaires », « Actions communautaires », « Solidarité associative », « Rayonnement africain »). Les remplacer par `<span class="edv-time">` et étendre les sélecteurs CSS (`.edv-timeline time` → `.edv-timeline time, .edv-timeline .edv-time` ; idem pour `.edv-action-meta time`). Les vraies dates restent en `<time datetime="…">`.

Contrôles : `grep -c '<time>' espoir-de-vie.html` → 0 ; `grep -c data-number espoir-de-vie.html` → 6 ; `grep -c 'espoirvie.png' espoir-de-vie.html` → 0 ; `ls -la espoirvie.webp` < 60 Ko ; `node --check espoir-de-vie.js`.
Commit : `fix: Espoir de Vie logo weight, blend, card numbers and time elements`.
Compte rendu : liste des modifications, et ce que Mohamed doit regarder (CTA et panneau orphelinat, cartes d'actions).

---

## Étape 2 — Corrections éditoriales

Les planches sources disent exactement ceci — ne pas aller au-delà :
- vêtements → aux enfants de l'orphelinat (2017) ;
- « 4000 chaussures » → « enfants démunis de Divo », sans date ;
- « 2000 chaussure » → « enfants du village Zoroko [Zaroko] », le 03 juin 2017 ;
- vivres et non-vivres → Fondation Marie Rose Guiro ;
- visite de l'ONG française → à l'orphelinat, pas chez Marie Rose Guiro.

**B5 — Carte 04 « Vêtir et chausser dignement »** fusionne trois événements sous une seule date et attribue les chaussures aux « enfants de l'orphelinat ». Réécrire :
- meta : `<span class="edv-time">2017</span>` ;
- lieu : `Orphelinat · Divo · Zaroko · Côte d’Ivoire` ;
- texte : « Des vêtements ont été remis aux enfants de l’orphelinat. Des chaussures ont ensuite été distribuées aux enfants démunis de Divo, puis, le 3 juin 2017, aux enfants du village de Zaroko. »
- optionnel, en `<strong>` comme sur la carte 01 : « 4 000 chaussures à Divo · 2 000 à Zaroko » — avec le mot *chaussures*, jamais *paires*, jamais de total.

**B6 — Carte 05 « Unir les forces »** greffe la visite de l'ONG française sous le lieu « Fondation Marie Rose Guiro ». Garder uniquement : « Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiro pour accompagner ses bénéficiaires. » La visite de l'ONG française reste dans la section Collaborations, où elle est déjà.

**B7 — Bandeau chiffres** : « Pays marqués par nos actions » → « Pays d’intervention ».

Contrôles : `grep -c 'paires\|FCFA\|6 000' espoir-de-vie.html` → 0.
Commit : `content: correct Espoir de Vie action cards`.
Compte rendu, puis stop.

---

## Étape 3 — Photos (plus tard, brief séparé)

Les originaux arrivent du client. Le moment venu : dossier `espoirDeVieImages/`, WebP ≤ 200 Ko, `width`/`height`, `loading="lazy"`, `alt` en français sans nom d'enfant, lightbox portée depuis `jeca.js` / `jeca.css` dans `espoir-de-vie.js` / `.css` (sans charger `jeca.js`), et la section « Mémoire d'actions » remplacée par une vraie galerie. Ne rien commencer avant le brief.

---

## Ne pas traiter — en attente du client

Dénomination officielle (ONG / Fondation) · devise religieuse et titre « Prophète » · localisation et statut actuel de l'orphelinat · actions 2018–2026 · monnaie des « 500 000 fr » · coordonnées à publier · numéro d'agrément.
