# Benchmark — Site Groupe Baruck face à 4 sites de groupes africains (2026-09-05)

Rapport rédigé par Claude pour relecture par Codex (qui donne son avis et propose le plan d'amélioration) et par Mohamed (qui tranche). Règle de fond : **rien n'est inventé côté contenu**. Chaque recommandation est classée selon qu'elle se fait avec ce qui existe déjà dans le dépôt, ou qu'elle attend une information / une validation du client (auquel cas elle s'affiche avec `<ClientNote>` ou ne s'affiche pas).

## 1. Méthode et limites

- Sites étudiés en profondeur (structure des menus, sections d'accueil, pages fondateur / filiales / fondation / actualités / contact / footer, signaux techniques) :
  1. **Groupe Teyliom** (Sénégal / Côte d'Ivoire, holding diversifiée avec fondation) — https://teyliom.com/
  2. **Groupe Guicopres** (Guinée, holding multisectorielle, PDG très exposé, Fondation KPC) — https://groupe-guicopres.com/ + site personnel du PDG https://www.kerfalla-camara.com/
  3. **Heirs Holdings** (Nigeria, holding familiale d'un fondateur, philanthropie via la Tony Elumelu Foundation) — https://www.heirsholdings.com/ + https://www.tonyelumelufoundation.org/
  4. **G-CORE GROUP SA** (Conakry, holding créée en 2024, 3 filiales — le plus proche de Baruck par la taille et la jeunesse) — https://g-coregroup.com/
- Références secondaires, une par page de notre site : **Central Group Guinée** (https://centralgroupgn.com/, site vitrine guinéen récent, FAQ + devis), **Fondation Kaydan** (https://www.fondationkaydan.org/, fondation d'entrepreneur ivoirien), **Children of Africa** (https://www.childrenofafrica.org/, fondation pour l'enfance), **Africa CEO Forum** (https://www.theafricaceoforum.com/, archivage d'éditions), **Back to Africa – Forum Afrique & Diaspora** (via Wikipédia, le site afriqueetdiaspora.com n'affiche qu'une image), **MEET Africa** (https://www.meetafrica.fr/), **78Studio Abidjan** (https://le78studio.com/), **Accueil ABC Dakar** (https://www.accueil-abc.com/, agence d'hôtesses).
- Injoignables au moment du test (DNS ou certificat) : servicesor.com, jayalir-agence.ci, agenceneptune.com, capturephotoabidjan.com. Non retenus.
- Méthode : lecture textuelle des pages (contenu HTML converti), pas de rendu visuel — conformément à la règle « Mohamed est seul juge du rendu ». Les signaux techniques (poids HTML, canonical, JSON-LD, hreflang, lazy-loading, CMS) ont été mesurés par `curl` sur la page d'accueil de chaque site et sur notre site en ligne. Notre propre inventaire vient des fichiers `src/` et de l'export `out/` du dépôt (HEAD `8c01238`).

## 2. Notre site en une page (état réel, HEAD 8c01238)

- 7 entrées de menu : Accueil · Le Groupe · Nos services (sous-menu : Studio photo, Hôtesses, puis 9 domaines ancrés sur les cartes de l'accueil) · JECA · Espoir de Vie · Actualités · Contact. Hors menu : `/projets-realisations/` (en construction), 404, sitemap, robots.
- Accueil : hero PDG + carrousel 3 diapositives · marquee · 9 cartes d'activités (photos Unsplash, texte d'une phrase, aucune page dédiée) · un aperçu par page · 3 dernières actualités · CTA contact.
- Le Groupe : hero, intro, rôles du PDG (PDG · Président JECA · Président ONG), expérience ONU 2016 (note « à valider »), engagements, citation (note « formulation provisoire »), présence 3 pays (photos Wikimedia), CTA.
- Studio photo : hero, tags, 3 espaces, matériel, 8 types d'événements, galerie (images `temp-*`), grille de prix en GNF, FAQ (8 questions), contact WhatsApp pré-rempli.
- Hôtesses : hero, intro + tags, 3 offres (Accueil / Orientation / Représentation), contact WhatsApp. C'est la page la plus mince du site.
- JECA : hero, vision, parcours, Gorée, 3 éditions rétrospectives avec galeries, CTA. Aucune information sur une prochaine édition, ni sur les intervenants / programme / partenaires.
- Espoir de Vie : hero, nav de section, mission (5 piliers), chiffres d'impact sourcés, orphelinat (frise 2017), 6 actions, présence 3 pays, collaborations, archives, CTA « collaborer ». Pas de don (règle client).
- Actualités : 6 articles (3 JECA, 3 EDV), liste + article avec carrousel. Pas de filtre par catégorie, pas de partage, pas de précédent / suivant, pas de flux RSS.
- Contact : 3 actions directes, « Selon votre besoin » (5 entrées), 3 canaux + autres lignes, formulaire Web3Forms (clé absente → repli `mailto:`) avec champs nom / e-mail / téléphone / objet (6 sujets) / message, carte Google Maps (note « emplacement exact à valider »), horaires validés (lun–sam 8h–17h), 3 pages Facebook validées.
- Footer : blurb, 3 colonnes (navigation, engagements, contact direct), retour en haut, « © 2026 Groupe Baruck. Tous droits réservés ». **Pas** d'adresse postale, **pas** de liens sociaux, **pas** de mentions légales ni de politique de confidentialité.
- Technique : Next.js 16 export statique, Inter auto-hébergée, animations CSS seulement, `prefers-reduced-motion`, skip link, `:focus-visible`, carrousel avec `aria-live` et boutons libellés, 1 seul `<h1>` par page, OG/Twitter présents (mais une seule image OG, le logo, pour toutes les pages), **aucun `<link rel="canonical">`**, **aucun JSON-LD** sauf la FAQ du studio, 11 images encore chargées depuis `images.unsplash.com` (dont la diapositive 1 du hero, image LCP de l'accueil), 45 images locales pour 3,8 Mo.

## 3. Fiches des sites de référence

### 3.1 Groupe Teyliom (teyliom.com)
- Menu : Portefeuille d'activités · À propos · Notre Histoire · Nos activités · Fondation · Concept B.U.I.L.D. · Médiathèque · Carrières · Termes & Conditions · Code de déontologie · Code d'éthique. Bilingue FR/EN (4 balises `hreflang`).
- Accueil : hero « Tomorrow is Now » → mission (B2C / B2B / B2G) → stratégie (3 piliers) → portefeuille de **9 divisions numérotées 01–09, chacune avec sa fiche et son lien** (Properties, Hospitality, Energies, Finance, Industries, Telecom, Logistics, Global Capital, **Fondation en 9e position**) → **frise chronologique interactive 2012–2023** → RSE / Fondation → concept B.U.I.L.D.
- Fondateur : aucune section personnelle sur l'accueil (choix institutionnel, à l'opposé de Guicopres et de Baruck).
- Fondation : page intégrée au site du groupe, texte court, « reconnue d'utilité publique par l'État du Sénégal », lien vers son site.
- Footer : plan du site, Termes & Conditions, politique de confidentialité, **mécanisme de recours public**, 3 adresses régionales (Abidjan, Dakar, Maurice) avec téléphones, Facebook / Twitter / LinkedIn, © 2026.
- Absent : actualités sur l'accueil, vidéo, compteurs, newsletter, rapport annuel.
- Technique : WordPress + AIOSEO, 273 Ko d'HTML, 41 scripts, 324 `<img>` sans `loading="lazy"`, 2 JSON-LD, canonical présent.

### 3.2 Groupe Guicopres (groupe-guicopres.com) et kerfalla-camara.com
- Menu : Accueil · Le Groupe (Qui sommes-nous, Historique, Nos valeurs, Références) · **Mot du PDG** · Activités (4 filiales) · RH & QHSE · Actualités · Médias · Carrières. Sélecteur FR/EN.
- Accueil : bloc des 4 filiales (avec année de création de chacune) → **citation du PDG + lien vers sa biographie** → trio Mot du Président / Présentation / Historique → galerie 10 photos → axes stratégiques → **mécénat** (Fondation KPC, Ligue de football, club Hafia) → 3 actualités → **chiffres clés** (collaborateurs, filiales, récompenses, années) → expansion géographique (4 pays) → **distinctions du PDG** (ANCG, CPEG, Prix CIMA 2014).
- Page « Mot du PDG » : ~450 mots, photo, 5 images, signature « KERFALLA CAMARA KPC, PDG du Groupe GUICOPRES », parcours depuis 1998, ~1 500 emplois.
- Le PDG a un **site personnel séparé** (biographie, activités, portfolio, actualités, chiffres : 1 000 employés, 7 filiales, 13 récompenses, 4 pays) qui renvoie vers le groupe et la fondation.
- Footer : adresse complète (Kaloum, Conakry), téléphone, e-mail, liens, **4 valeurs affichées**, Facebook / Twitter / LinkedIn avec compteurs d'abonnés, © 2020 (non mis à jour).
- Technique : WordPress 5.5 (obsolète), 96 Ko, 22 scripts, 37 images toutes en lazy, canonical, pas de JSON-LD ni d'OG image.

### 3.3 Heirs Holdings (heirsholdings.com) et Tony Elumelu Foundation
- Menu : About us (Overview, Leadership, Heritage, **Milestones**, Africapitalism, **FAQs**) · Investments · Impact (Foundation, Sustainability, **Impact Report**) · Insights (News, Podcasts, **Chairman's Corner**) · Careers. Recherche intégrée.
- Accueil : hero « Investing in Africa's Future, Today » avec étiquettes de secteurs → présentation → **chiffres du portefeuille** (9 secteurs, 4 continents, 24 pays, 40 000+ employés, valeur au 31 mars 2026) → 6 secteurs dépliables → philanthropie (TEF) → 4 actualités datées → **inscription newsletter** (prénom, nom, e-mail, consentement).
- Page Philanthropy : philosophie (« doing well and doing good »), présentation de la fondation depuis le site du groupe avec **chiffres d'impact précis et datés**, lien externe vers le site de la fondation, bannière programme.
- Fondation (site séparé) : menu About / What we do / Impact (rapports, finances, success stories) / Media / Network ; hero « 16 ans » ; chiffres (27 000 financés, 5 000 $ par bénéficiaire, 135 M$) ; **témoignages** de personnalités ; « View upcoming events » ; newsletter ; rapport annuel 2025 téléchargeable.
- Footer : téléphone, adresse + Google Maps, 6 réseaux (Facebook, Instagram, X, LinkedIn, Threads, YouTube), Privacy, Terms, bannière cookies, © 2026.
- Technique : WordPress 6.7, **660 Ko d'HTML, 69 scripts** (très lourd), 1 JSON-LD, 6 OG images, canonical.

### 3.4 G-CORE GROUP SA (g-coregroup.com) — le comparable le plus proche
- Holding guinéenne fondée en 2024, 3 filiales, un fondateur. Menu : Le Groupe · Valeurs · Filiales · Stratégie · Présence · Gouvernance · RSE/ESG · sélecteur **FR/EN/AR/PT** · CTA « Nous contacter ».
- Accueil : hero (logo, devise « Innovation · Integrity · Impact », 2 CTA) → à propos + **chiffres clés animés** (filiales, année, capital) → « Pourquoi la Guinée ? » avec données économiques → 3 valeurs → **tableau comparatif** (prestataires séparés vs holdings vs G-CORE) → 3 fiches filiales (secteur, services, capital, forme juridique, lien) → **plan stratégique 2024–2030 en 4 phases** → **carte CEDEAO interactive** (présence actuelle / expansion) → direction générale (**photo « À VENIR »** assumée, parcours, citation, compétences, formation) → gouvernance (conseil, comités, **RCCM affiché**) → RSE/ESG 3 piliers → 3 articles « Insights » → contact.
- Contact : e-mail, WhatsApp / téléphone, **horaires lun–sam 8h–18h**, Google Maps, **formulaire en 4 étapes** (identité → profil : investisseur / partenaire / opérateur / institution / candidat / autre → nature de la demande → message), newsletter thématique.
- Footer : 4 colonnes (groupe, filiales, **documents officiels**, contact), 5 réseaux, adresse avec RCCM, **numéro fiscal « [En cours] »** (ils affichent l'attente plutôt que d'inventer — exactement notre logique `ClientNote`), Mentions légales, Confidentialité, Code de conduite, bandeau cookies, **brochure PDF** téléchargeable.
- Technique : site statique sur mesure, 190 Ko, 7 scripts, 1 JSON-LD, 1 OG image, pas de canonical, pas de lazy.

### 3.5 Références secondaires (une par page)
- **Central Group Guinée** (BTP / logistique) : site vitrine statique très structuré — numérotation des sections 01→10, 4 piliers détaillés, **méthodologie en 5 étapes**, politique HSE par pilier, carte des zones, **bloc « perspectives marché » daté**, **FAQ 10 questions**, formulaire de devis avec type de demande et **promesse de réponse sous 24 h ouvrées**, WhatsApp direct, horaires lun–sam 7h–18h, RCCM dans le footer, 4 réseaux (dont TikTok, Instagram). 81 Ko, 2 scripts, canonical + JSON-LD. Pas de fondateur, pas d'actualités, pas de multilingue.
- **Fondation Kaydan** : menu Accueil · La Fondation · Programmes · Ikrea · Actualités · **FAQ** · Contacts ; **mot du président** ; 4 chiffres d'impact (17 projets, 24 dons, 38 événements, 100 000 participants) ; 3 programmes nommés ; 40+ articles datés 2020–2025 ; **2 sections vidéo** ; 6 réseaux + WhatsApp + Messenger ; mentions légales / confidentialité / cookies. Pas de don en ligne, pas de bénévolat, pas de rapport.
- **Children of Africa** : menu par domaine (Éducation, Case des enfants, Hôpital, Centres, Bibliobus, Dons), FR/EN, actualités en tête, **grands projets nommés**, 3 domaines d'action, présidente fondatrice mise en avant, **galerie de 40+ personnalités soutiens**, « 12 pays », **rapports annuels et newsletters téléchargeables**, membres, partenaires.
- **Africa CEO Forum** : menu avec **« Past Editions » (2022 → 2025) en sous-menu**, prochaine édition annoncée (ville + dates + « subscribe for updates »), **récapitulatif chiffré de la dernière édition** (2 800 participants) + document à télécharger, ~50 portraits d'intervenants cliquables, publications, newsletter, e-mails distincts (inscription / sponsoring / presse), logos co-organisateurs, mentions légales.
- **Back to Africa – Forum Afrique & Diaspora** (Wikipédia) : format explicité (plénières, keynotes, panels, masterclasses, réseautage), éditions datées 2023 / 2024 / 2025 au même lieu, intervenants nommés ; critique publique : billets chers, **pas d'évaluation d'impact**.
- **MEET Africa** : événements sous forme de cartes (image, titre, date, lieu), chiffres d'impact, revue de presse en carrousel, FR/EN, newsletter. Contient encore du *Lorem ipsum* — contre-exemple.
- **78Studio Abidjan** : menu Accueil · Portfolio · **Récupérer mes photos** · Formation · **Réserver** ; positionnement « L'art du portrait » ; page « Tarif & réservation » (introuvable à l'URL devinée) ; Instagram ; espace pro. Contre-exemple utile : tarifs non visibles alors que les nôtres le sont.
- **Accueil ABC Dakar** : menu Accueil · Qui sommes-nous · Services (**~30 prestations listées**) · Galerie · **« Nous ont fait confiance »** · **Candidature spontanée** · **Demander un devis** ; 2 blocs (Hôtes + Hôtesses / Ambassadeurs) ; Facebook, LinkedIn.

## 4. Matrice comparative

Légende : ✅ présent · ◐ partiel · ❌ absent · 🔒 chez nous : possible seulement avec une validation client.

| Élément | Teyliom | Guicopres | Heirs | G-CORE | Central | **Baruck** |
|---|---|---|---|---|---|---|
| Mot / message du dirigeant (texte long signé) | ❌ | ✅ | ✅ (Chairman's Corner) | ✅ (parcours + citation) | ❌ | ◐ citation provisoire 🔒 |
| Biographie / parcours du fondateur | ❌ | ✅ + site perso | ✅ | ✅ | ❌ | ◐ rôles + ONU 2016 🔒 |
| Chiffres clés du groupe | ❌ | ✅ | ✅ datés | ✅ | ✅ | ❌ 🔒 (EDV en a) |
| Frise / historique daté | ✅ 2012–2023 | ✅ page | ✅ Milestones | ✅ plan 2024–2030 | ❌ | ◐ EDV seulement ; dates JECA / ONU dispersées |
| Filiales / pôles = fiches structurées | ✅ 9 fiches | ✅ 4 | ✅ 6 secteurs | ✅ 3 fiches | ✅ 4 piliers | ◐ 2 pages (studio, hôtesses) + 9 cartes d'une phrase sans statut |
| Valeurs nommées | ◐ B.U.I.L.D. | ✅ 4 | ✅ Africapitalism | ✅ 3 | ✅ | ◐ « vision, excellence, impact » + engagements |
| Présence géographique (carte) | ❌ | texte | chiffres | ✅ carte | ✅ carte | ◐ 3 photos de villes |
| Fondation / RSE intégrée | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (EDV, très complet) |
| Actualités datées | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ 6 articles |
| Filtre / catégories d'actualités | — | ✅ | ✅ | ✅ | — | ❌ |
| Partage d'article | — | ✅ (WP) | ✅ | ❌ | — | ❌ |
| Flux RSS | ✅ (WP) | ✅ (WP) | ✅ (WP) | ❌ | ❌ | ❌ |
| Galerie / médiathèque transversale | ✅ | ✅ | ❌ | ❌ | ❌ | ◐ par édition JECA + studio (temp) |
| Vidéo | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ 🔒 |
| FAQ | ❌ | ❌ | ✅ | ❌ | ✅ 10 | ◐ studio seulement |
| Témoignages / références clients | ❌ | ✅ Références | ✅ | ❌ | ❌ | ❌ 🔒 |
| Formulaire typé (profil / nature) | ❌ | ❌ | ❌ | ✅ 4 étapes | ✅ type + 24 h | ◐ objet (6 sujets) |
| WhatsApp direct | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ pré-rempli (notre point fort) |
| Horaires | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ validés |
| Adresse dans le footer | ✅ 3 | ✅ | ✅ | ✅ + RCCM | ✅ + RCCM | ❌ (connue mais absente) |
| Réseaux sociaux dans le footer | ✅ 3 | ✅ 3 | ✅ 6 | ✅ 5 | ✅ 4 | ❌ (3 Facebook validées, page Contact seulement) |
| Mentions légales / confidentialité | ✅ | ◐ | ✅ | ✅ | ◐ RCCM | ❌ |
| Bandeau cookies | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ (mais iframe Google Maps = cookies tiers) |
| Newsletter | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ (backend interdit) |
| Carrières / candidature | ✅ | ✅ | ✅ | ◐ dans le formulaire | ❌ | ❌ 🔒 |
| Multilingue | ✅ FR/EN | ✅ FR/EN | EN | ✅ 4 langues | ❌ | ❌ |
| Brochure / rapport téléchargeable | ❌ | ❌ | ✅ | ✅ PDF | ❌ | ❌ 🔒 |
| Canonical | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| JSON-LD | ✅ | ❌ | ✅ | ✅ | ✅ | ◐ FAQ studio |
| OG image par page | ✅ | ❌ | ✅ | ◐ | ◐ | ◐ logo unique |
| Images lazy / WebP | ❌ / ❌ | ✅ / ❌ | ◐ / ◐ | ❌ / ❌ | ❌ / ✅ | ✅ / ✅ |
| Poids HTML accueil | 273 Ko | 96 Ko | 660 Ko | 190 Ko | 81 Ko | 132 Ko |
| Scripts sur l'accueil | 41 | 22 | 69 | 7 | 2 | 10 |
| Animations respectant reduced-motion | ? | ? | ? | ? | ? | ✅ |
| Valeurs en attente signalées comme telles | ❌ | ❌ | ❌ | ✅ (« [En cours] », « photo à venir ») | ❌ | ✅ ClientNote |

## 5. Lecture du benchmark

### 5.1 Ce que les autres ont et que nous n'avons pas
1. **Une identité institutionnelle vérifiable** : adresse dans le footer, mentions légales, forme juridique / RCCM, politique de confidentialité. Cinq sites sur cinq affichent au moins l'adresse ; trois affichent le numéro d'immatriculation. Notre footer n'a qu'un ©.
2. **Des chiffres clés du groupe** (Guicopres, Heirs, G-CORE, Central, Kaydan). Chez nous, seule Espoir de Vie en a, et ils sont sourcés — c'est le bon modèle, mais le Groupe et la JECA n'en ont pas.
3. **Un historique daté du groupe** (Teyliom, Guicopres, Heirs). Nos dates existent (EDV 2015 → 2017, ONU 2016, JECA 2019 → 2022 → 2023 → 2026) mais sont dispersées sur quatre pages ; il manque la date de création du groupe.
4. **Un vrai mot du dirigeant** (Guicopres ~450 mots signés, Kaydan, Heirs). Nous avons une citation d'une ligne, marquée provisoire.
5. **Des filiales présentées comme des entités** (nom, date de création, périmètre, statut). Nos 9 domaines d'activité sont 9 cartes d'une phrase avec des photos de banque d'images ; rien ne dit lesquels sont opérationnels, en projet ou à l'étude. « Baruck Communication » apparaît en eyebrow sans jamais être présentée.
6. **La projection vers l'avant** : G-CORE affiche un plan 2024–2030, l'Africa CEO Forum annonce sa prochaine édition avec « subscribe for updates ». Notre JECA est 100 % rétrospective.
7. **Les réseaux sociaux dans le footer** (tous). Nous avons trois pages Facebook validées mais visibles seulement sur Contact.
8. **Les preuves sociales** : références clients (Guicopres, Accueil ABC), témoignages (TEF), personnalités soutiens (Children of Africa), distinctions (Guicopres). Rien chez nous.
9. **Actualités outillées** : catégories cliquables, partage, RSS (tous les WordPress l'ont par défaut).
10. **Multilingue** (Teyliom, Guicopres, G-CORE, Children of Africa). Pertinent chez nous pour la JECA : la 1re édition a réuni des participants du Canada, des États-Unis, d'Angleterre et d'Australie.
11. **Une page Hôtesses consistante** : Accueil ABC liste ~30 prestations, un parcours de devis, une candidature spontanée, des références. Notre page a 3 offres génériques.
12. **Canonical + JSON-LD + OG par page** (4 sites sur 5 ont le canonical).

### 5.2 Ce que nous faisons déjà mieux
- **Conversion directe** : WhatsApp pré-rempli par besoin (tarifs studio, réservation hôtesses), « Selon votre besoin » sur Contact, horaires validés. Aucun des 4 groupes n'a de WhatsApp ; Central et G-CORE en ont un simple.
- **Transparence des prix du studio** (grille GNF complète + FAQ) là où 78Studio cache ses tarifs derrière une page de réservation.
- **Honnêteté sur les données non validées** (`ClientNote`) — seul G-CORE fait pareil (« [En cours] », « photo à venir »).
- **Page fondation** (Espoir de Vie) plus riche que Teyliom Fondation (un paragraphe) et Kaydan : piliers, frise, actions datées, pays, collaborations, chiffres sourcés.
- **Technique** : 132 Ko / 10 scripts contre 660 Ko / 69 scripts chez Heirs ; lazy + WebP ; `prefers-reduced-motion` ; skip link ; carrousel accessible ; pas de CMS à maintenir (Guicopres tourne sur WordPress 5.5 de 2020 avec un © 2020).
- **Pas de contenu bidon** : MEET Africa affiche encore du *Lorem ipsum* ; nos zones incertaines sont signalées.

### 5.3 Incohérence interne détectée pendant l'audit
- `src/data/services.ts` → `studioFaq` : « Quand le studio est-il ouvert ? — 24h/24 et 7j/7 ». `src/data/contact.ts` → `hqHours` : « Lundi – Samedi 8h – 17h · Dimanche fermé ». Le studio est à l'adresse du siège (`hqAddress`, même texte dans la diapositive 2 du hero). Les deux affirmations sont en ligne en même temps. **À trancher avec le client** (le 24/7 vient du texte d'origine du client ; les horaires du siège ont été confirmés le 2026-09-04 — les deux peuvent être vrais si le studio a un régime différent, mais il faut le dire explicitement).

## 6. Recommandations

Effort : S (< 1 h de Codex), M (une demi-journée), L (plusieurs étapes). Chaque ligne indique la dépendance : **aucune** (tout est déjà dans le dépôt), **Mohamed** (décision de design / de méthode), **client** (information à obtenir ; en attendant, soit on n'affiche rien, soit on affiche avec `<ClientNote>`).

### A. Faisable maintenant, sans nouvelle information (code / structure)
| # | Quoi | Inspiré de | Effort | Dépendance | Contrôle code |
|---|---|---|---|---|---|
| A1 | `alternates.canonical` sur chaque page (via `metadataBase` déjà défini) | 4 sites / 5 | S | aucune | `grep -c 'rel="canonical"' out/*/index.html` = 1 partout |
| A2 | JSON-LD `Organization` (layout : nom, url, logo, `sameAs` = 3 Facebook, `contactPoint` téléphone / WhatsApp) + `NewsArticle` sur `/actualites/<slug>/` + `Event` (passés) sur les 3 éditions JECA + `NGO` sur Espoir de Vie (sans chiffre non sourcé) | Heirs, G-CORE, Central | M | aucune (ne rien mettre dans `LocalBusiness.openingHours` tant que 5.3 n'est pas tranché) | `grep -c 'ld+json'` par page ; validation du JSON par `node -e` |
| A3 | Image OG spécifique par page (hero WebP existant : studio, hôtesses ; photo JECA ; logo EDV) au lieu du logo partout | Heirs, Teyliom | S | aucune | `grep -o 'og:image" content="[^"]*"' out/*/index.html` distinct par page |
| A4 | Footer : ajouter `hqAddress` (déjà validée puisque publiée dans le hero) et les 3 pages Facebook (validées le 2026-09-04) dans une 4e colonne ou sous le blurb | tous | S | aucune | `grep -c 'facebook.com' out/index.html` ≥ 3 |
| A5 | Auto-héberger les 11 images Unsplash (téléchargées en WebP dans `public/images/placeholders/`, crédit dans `PhotoCredits` comme pour Wikimedia) : supprime la dépendance tierce, permet `width/height` exacts et améliore le LCP de l'accueil (diapositive 1 = Unsplash). Reste provisoire jusqu'aux vraies photos (backlog 5) | G-CORE, Central (images locales) | M | aucune (licence Unsplash le permet ; garder la mention) | `grep -rc 'images.unsplash.com' out/` = 0 |
| A6 | Actualités : filtre par catégorie (liens `/actualites/?categorie=jeca` gérés côté client, ou ancres) + précédent / suivant en bas d'article + boutons de partage WhatsApp / Facebook / copier le lien (URLs statiques, aucun script tiers) | Guicopres, Heirs | M | Mohamed (choix filtre vs pages par catégorie) | ids uniques ; liens `wa.me/?text=` et `facebook.com/sharer` encodés |
| A7 | Flux RSS `feed.xml` généré au build depuis `getAllArticles()` (équivalent zéro-backend de la newsletter) + `<link rel="alternate" type="application/rss+xml">` | tous les WordPress | S | aucune | `xmllint --noout out/feed.xml` |
| A8 | Carte Google Maps en « façade » : image statique / bloc cliquable qui ne charge l'iframe qu'au clic (évite les cookies tiers sans bandeau, allège Contact) | Heirs / G-CORE (bandeau) — nous évitons le bandeau | S | Mohamed | `grep -c '<iframe' out/contact/index.html` = 0 au chargement |
| A9 | Frise « Repères » sur Le Groupe construite **uniquement** avec les dates déjà publiées : 2015 premières actions EDV · 2016 ONU · 2017 orphelinat · 2019 création JECA · 2022 / 2023 / 2026 éditions. Ligne « Création du Groupe Baruck — date à confirmer » en `ClientNote` | Teyliom, Guicopres, Heirs | M | aucune pour les 7 dates ; client pour la création du groupe | aucune date hors `src/data/*` ou `content/` |
| A10 | JECA : bloc « Prochaine édition » sans date : « La date et le lieu de la 4e édition seront annoncés ici » + CTA « Être informé » (WhatsApp / mailto pré-rempli « Je souhaite être informé de la prochaine édition de la JECA ») + sous-navigation des éditions passées façon « Past Editions » | Africa CEO Forum | S | aucune (aucune date affirmée) | texte sans date ni lieu ; `wa.me` encodé |
| A11 | Carte SVG Afrique de l'Ouest avec les 3 pays validés (Guinée, Sénégal, Côte d'Ivoire) en surbrillance sur Le Groupe / Présence, CSS seulement | G-CORE, Central | M | Mohamed (design) ; aucune donnée nouvelle | SVG inline, `aria-label`, pas de librairie |
| A12 | Page `/mentions-legales/` avec ce qui est certain : éditeur du site (GassTech Solutions), hébergement (GitHub Pages), traitement du formulaire (Web3Forms, données transmises par e-mail, pas de cookie propre), carte Google Maps (cookies tiers Google au clic si A8), crédits photos (Unsplash, Wikimedia Commons CC BY / BY-SA — obligation de licence déjà remplie par `PhotoCredits`, à centraliser), © · **rubrique « Identité de l'éditeur » (raison sociale, forme, RCCM, siège) en `ClientNote`** | tous | M | client pour l'identité légale ; aucune pour le reste | lien dans le footer ; page dans `sitemap.ts` |

### B. Faisable avec le contenu existant réorganisé (aucun fait nouveau, mais un choix éditorial de Mohamed)
| # | Quoi | Inspiré de | Effort | Dépendance |
|---|---|---|---|---|
| B1 | Chiffres clés Espoir de Vie remontés sur Le Groupe et l'accueil (déjà sourcés : 2015, 100 jouets, 200 orphelins, 2017, 3 pays) — sans total additionné (règle EDV) | Heirs (chiffres de la fondation sur le site du groupe) | S | Mohamed |
| B2 | FAQ Contact / Groupe à partir de faits déjà publiés : « Où êtes-vous ? » (adresse), « Quels sont vos horaires ? » (lun–sam 8–17), « Comment réserver le studio / les hôtesses ? » (WhatsApp), « Comment collaborer avec Espoir de Vie ? » (e-mail), « Dans quels pays êtes-vous présents ? » (3 pays) ; JSON-LD `FAQPage` comme sur le studio | Central (10 Q), Heirs FAQs, Kaydan | S | Mohamed ; 5.3 à trancher avant d'écrire la réponse « horaires » |
| B3 | Fiche « Baruck Communication » (l'entité qui opère le studio et les hôtesses, déjà nommée dans les eyebrows) sur Le Groupe : périmètre = les deux pages existantes, pays = Guinée ; les 3 Facebook portent ce nom → cohérent | Teyliom (fiches filiales) | S | Mohamed ; client pour toute précision (statut juridique, date) |
| B4 | Hôtesses : « Comment ça se passe » en 3 étapes strictement descriptives du parcours déjà en place (1. vous nous écrivez sur WhatsApp avec date / lieu / nombre d'hôtesses ; 2. nous confirmons disponibilités et conditions ; 3. l'équipe est présente le jour J) + rappel des 8 types d'événements déjà listés en tags | Accueil ABC, Central (méthodologie) | S | Mohamed ; wording à faire valider par le client (c'est une promesse de service) |
| B5 | Médiathèque : page ou section regroupant les galeries existantes (3 éditions JECA, studio) avec filtres ; s'étendra aux photos EDV quand elles arriveront (backlog 5) | Teyliom Médiathèque, Guicopres | M | Mohamed ; après backlog 5 de préférence |

### C. Attend une information ou une validation du client (à préparer dans le code, à afficher avec `ClientNote` ou à laisser vide)
| # | Quoi | Inspiré de | Question précise à poser au client |
|---|---|---|---|
| C1 | Mot du président (300–500 mots signés, photo) sur Le Groupe | Guicopres, Kaydan, Heirs | Fournir le texte ou un enregistrement à transcrire ; valider la citation actuelle |
| C2 | Chiffres clés du Groupe (année de création, nombre d'activités opérationnelles, collaborateurs, pays) | Guicopres, Heirs, G-CORE | Déjà dans « décisions en attente » ; formuler comme 4 cases à remplir |
| C3 | Statut de chacun des 9 domaines (opérationnel / en lancement / en projet) + 1 phrase de plus par domaine + une vraie photo | Teyliom, G-CORE | Tableau à cocher ; permettrait d'afficher un badge « En développement » honnête au lieu d'une photo Unsplash muette |
| C4 | JECA : pour chaque édition — thème, nombre de participants, pays représentés, intervenants, partenaires ; date de la 4e édition | Africa CEO Forum, Back to Africa | Fiche par édition ; la 1re édition a déjà « ~50 personnes, 8 pays » |
| C5 | Références clients / témoignages (studio, hôtesses) ; partenaires (JECA) ; soutiens (EDV) | Guicopres, Accueil ABC, Children of Africa, TEF | Autorisation écrite d'afficher noms / logos ; 2–3 témoignages courts |
| C6 | Vidéos (le groupe vend des « clips vidéo » : en a-t-il un à montrer ?) → intégration YouTube en façade (aucun cookie avant le clic) | Kaydan, TEF | Liens YouTube / Facebook existants |
| C7 | Version anglaise (au minimum JECA + Le Groupe, cible diaspora) — lourd en export statique (routes `/en/…`, duplication des données) : à planifier en phase 2 seulement | Teyliom, Guicopres, G-CORE | Le client veut-il l'anglais ? Qui valide les traductions ? |
| C8 | Recrutement d'hôtesses / candidature spontanée (CTA WhatsApp dédié) | Accueil ABC, Guicopres Carrières | Le groupe recrute-t-il ? Quel canal ? |
| C9 | Promesse de délai de réponse (« sous 24 h ouvrées ») sur Contact | Central | Le client s'engage-t-il ? |
| C10 | Identité légale (raison sociale, forme, RCCM, siège) pour A12 | G-CORE, Central, Guicopres | Documents d'immatriculation |
| C11 | Horaires du studio vs siège (§ 5.3) | — | « Le studio est-il vraiment ouvert 24h/24 7j/7 ? Sur rendez-vous la nuit ? » |
| C12 | Brochure PDF de présentation du groupe (téléchargeable) | G-CORE, Heirs (rapport) | Existe-t-elle ? Sinon on peut la générer plus tard depuis le site |
| C13 | Distinctions / prix / mandats du PDG (au-delà d'ONU 2016) | Guicopres | Liste avec dates et preuves |

### D. Vu chez les autres, à ne pas reproduire
- Bandeau cookies + analytics (Heirs, G-CORE) : inutile si nous n'avons ni cookie propre ni analytics (règle AGENTS) ; A8 règle le seul cas (Maps).
- Newsletter avec backend (Heirs, G-CORE, TEF) : interdit par la méthode ; A7 (RSS) + A10 (« Être informé » via WhatsApp / mail) couvrent le besoin sans serveur.
- Bouton de don (Children of Africa) : règle client EDV.
- Formulaire en 4 étapes (G-CORE) : sur-ingénierie pour 6 sujets ; notre `objet` suffit.
- Données de marché « en direct » (G-CORE) et *Lorem ipsum* (MEET Africa) : contenu non maîtrisé.
- 660 Ko / 69 scripts (Heirs), 324 images sans lazy (Teyliom), WordPress 5.5 non mis à jour (Guicopres) : l'export statique nous protège de tout ça — le garder.
- Site personnel séparé du PDG (kerfalla-camara.com) : doublon à maintenir ; la page Le Groupe + C1 suffisent.

## 7. Ordre proposé (pour discussion avec Codex)

1. **Lot technique sans risque éditorial** : A1 canonical → A3 OG par page → A2 JSON-LD → A7 RSS. (Vérifié pendant l'audit : les ancres des 5 variantes de footer pointent toutes vers des ids existants ; rien à corriger.) Un commit chacun, contrôles au niveau du code uniquement.
2. **Lot footer / confiance** : A4 adresse + Facebook → A12 mentions légales (identité en `ClientNote`) → A8 façade Maps.
3. **Lot contenu à partir de l'existant** : A9 frise « Repères » → A10 « Prochaine édition » JECA → B1 chiffres EDV remontés → B2 FAQ Contact (après C11) → B3 fiche Baruck Communication → B4 parcours Hôtesses.
4. **Lot médias** : A5 auto-hébergement des Unsplash → A6 actualités outillées → A11 carte SVG → B5 médiathèque.
5. **En parallèle, un seul message au client** regroupant C1–C13 sous forme de cases à remplir (le format G-CORE « [En cours] » montre qu'afficher l'attente est acceptable, mais mieux vaut obtenir les réponses).

## 8. Points sur lesquels Claude attend l'avis de Codex
- La priorité relative entre le lot technique (1) et le lot contenu (3) : le technique est invisible pour le client, le contenu est ce qu'il verra.
- A6 : filtre côté client (un peu de JS) ou pages statiques par catégorie (`/actualites/jeca/`) — la seconde option est plus SEO mais ajoute 5 routes pour 6 articles.
- A9 : frise sur Le Groupe (institutionnel) ou sur l'accueil (visibilité) ?
- A11 : la carte SVG apporte-t-elle assez par rapport aux 3 photos de villes déjà en place pour justifier l'effort ?
- B4 : le « parcours en 3 étapes » décrit-il un fait (le fonctionnement actuel via WhatsApp) ou une promesse (à valider) ? Claude penche pour « promesse → ClientNote jusqu'à validation ».
- C7 : faut-il préparer dès maintenant l'architecture (dictionnaires de textes) pour l'anglais, ou attendre la décision client ? Claude penche pour attendre : le coût d'une refonte i18n en export statique est élevé et la demande n'est pas exprimée.
- Contre-vérification demandée : les signaux techniques du tableau (§ 4) viennent d'un `curl` unique par site le 2026-09-05 ; une seconde mesure par Codex serait utile avant de les citer au client.

## 9. Sources
- Teyliom : https://teyliom.com/ · https://teyliom.com/holding/teyliom-fondation-fr/ · https://fr.wikipedia.org/wiki/Groupe_Teyliom
- Guicopres : https://groupe-guicopres.com/ · https://groupe-guicopres.com/mot-du-pdg/ · https://www.kerfalla-camara.com/
- Heirs Holdings : https://www.heirsholdings.com/ · https://www.heirsholdings.com/philanthropy/ · https://www.tonyelumelufoundation.org/
- G-CORE GROUP : https://g-coregroup.com/
- Central Group Guinée : https://centralgroupgn.com/
- Fondation Kaydan : https://www.fondationkaydan.org/ · https://fr.wikipedia.org/wiki/Alain_Kouadio
- Children of Africa : https://www.childrenofafrica.org/
- Africa CEO Forum : https://www.theafricaceoforum.com/
- Back to Africa : https://fr.wikipedia.org/wiki/Back_to_Africa · https://afriqueetdiaspora.com/
- MEET Africa : https://www.meetafrica.fr/en/
- 78Studio : https://le78studio.com/
- Accueil ABC : https://www.accueil-abc.com/
- Notre site : https://gaslandie.github.io/groupe-baruck/ (HEAD 8c01238) et fichiers `src/`, `content/`, `out/` du dépôt.
