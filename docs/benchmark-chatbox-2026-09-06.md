# Benchmark et plan — Chatbox guidée « faite maison » (2026-09-06)

Rapport rédigé par Claude à la demande de Mohamed (« un chat box fait maison pour guider le user et répondre aux questions qu'on va lui proposer »), pour relecture par Codex (avis et améliorations) et arbitrage de Mohamed. Règle de fond identique au benchmark du 2026-09-05 : **rien n'est inventé côté contenu**. Le bot ne répond qu'avec des textes déjà publiés sur le site ; les sujets qui attendent une décision client restent hors du bot ou renvoient vers un humain.

## 1. Cadre et contraintes

- Site Next.js 16 en **export statique** sur GitHub Pages : aucun serveur, aucune API, aucune clé secrète possible côté client.
- `AGENTS.md` : aucune dépendance nouvelle sans accord, animations CSS seulement, pas d'analytics, pas de backend, aucun chiffre / date / nom non validé.
- Backlog n° 3 de `docs/passation.md` (2026-09-04) : chatbot **en attente**, deux options chiffrées — A) assistant IA Claude via Cloudflare Worker + clé Anthropic payée par le client ; B) bot guidé par menus + WhatsApp, coût zéro. La demande du 2026-09-06 tranche pour **B, fait maison**.
- Canaux humains déjà en ligne : WhatsApp siège (`wa.me/224623720427`, avec messages pré-remplis Studio et Hôtesses), WhatsApp PDG, fixe, mobile, e-mail, formulaire Web3Forms (clé absente → repli `mailto:`).
- Contenu réutilisable tel quel : FAQ studio (8 questions, `studioFaq`), grille des prix (`studioPriceGroups`), adresse et horaires validés, 3 offres hôtesses, 3 éditions JECA datées, mission / orphelinat / présence Espoir de Vie, 9 domaines d'activité, présence 3 pays.

## 2. Ce que font les sites de référence

Contrôle `curl` de la page d'accueil (2026-09-06, mêmes sites que le benchmark du 2026-09-05) : recherche des scripts de chat (tawk.to, Crisp, Tidio, Intercom, HubSpot, Zendesk, LiveChat, Smartsupp, JivoChat, Elfsight, Landbot, Botpress…) et des liens de messagerie.

| Site | Chat / messagerie | Observation |
|---|---|---|
| Teyliom | aucun | Google Tag uniquement ; contact = formulaire + adresses |
| Guicopres | aucun | aucun script tiers, pas de WhatsApp |
| Heirs Holdings | lien WhatsApp dans le pied de page | 660 Ko d'HTML, 48 appels gtag, aucun widget de chat |
| Tony Elumelu Foundation | liens WhatsApp (partage) | pas de widget |
| **G-CORE Group** (Conakry, comparable le plus proche) | **tawk.to** (live chat) **+ bouton WhatsApp collant** (`sticky-cta-whatsapp`) + WhatsApp dans les coordonnées, le footer et une barre d'icônes | le seul du panel avec un widget de chat ; il cumule 4 points d'entrée WhatsApp vers le même numéro |
| **Central Group Guinée** | **bouton WhatsApp flottant** (`.wafloat`, `aria-label="WhatsApp"`) + bouton « WhatsApp direct » sous « Demander un devis » | pas de bot, pas de tiers ; RCCM affiché dans le footer |
| Fondation Kaydan | dépliant « Échangeons sur la messagerie de votre choix » : WhatsApp (`api.whatsapp.com/send?phone=…`) et Messenger (`m.me/…`) | choix du canal proposé au visiteur, pas de bot |
| Children of Africa | aucun | Google Tag uniquement |
| MEET Africa | liens WhatsApp | pas de widget |
| 78Studio, Accueil ABC | aucun | pages très légères (14–21 Ko) |
| Africa CEO Forum | injoignable (239 octets) | — |

Lecture : **aucun site du panel n'a de bot guidé** ; les sites guinéens les plus récents (G-CORE 2024, Central Group 2026) misent sur un **bouton WhatsApp flottant**, et un seul ajoute un live chat tiers (tawk.to, 500–750 Ko de JS selon corewebvitals.io). Une chatbox guidée, légère et sans tiers serait donc un différenciant sur ce panel, à condition qu'elle débouche toujours sur WhatsApp / téléphone / e-mail, comme la barre latérale du menu le fait déjà.

## 3. Familles de solutions comparées

| Critère | A. Live chat SaaS (tawk.to, Crisp, Tidio) | B. Bibliothèque React (react-chatbot-kit, React ChatBotify, BotUI) | C. Assistant IA (Claude via Worker, backlog A) | **D. Bot guidé fait maison (retenu)** |
|---|---|---|---|---|
| Coût | gratuit avec marque (tawk.to : 19 $/mois pour la retirer ; Tidio : 50 conversations/mois puis payant ; Crisp : 2 sièges) | gratuit | clé Anthropic à l'usage (≈ 0,0015–0,008 $/message) + compte et carte du client | **0** |
| Dépendance / conformité `AGENTS.md` | script tiers + compte à créer chez un éditeur ; contredit « pas de backend, pas d'analytics » | nouvelle dépendance npm ; react-chatbot-kit non publié depuis 3 ans ; styles imposés à surcharger | Worker Cloudflare à héberger, secret à gérer, garde-fous contre l'invention de faits | **aucune dépendance**, code dans le dépôt, Tailwind + tokens existants |
| Poids côté visiteur | 155 à 750 Ko de JS tiers, 300–600 ms de blocage du fil principal en moyenne | 30–100 Ko selon la lib | léger côté client, latence réseau à chaque réponse | **quelques Ko** (un composant client + un fichier de données) |
| Vie privée | cookies et suivi de l'éditeur, DPA à signer | aucune | messages envoyés à un service tiers | **rien ne sort du navigateur** ; état de session uniquement |
| Qui répond | un humain doit être en ligne (sinon « laissez un message ») | le script que l'on écrit | le modèle, à partir d'un contexte fourni | **le script que l'on écrit**, à partir des textes du site |
| Risque d'inventer un contenu | nul (humain) | nul | réel, à cadrer par prompt et relecture | **nul** : chaque réponse est un texte existant |
| Maintenance par Mohamed | tableau de bord tiers | code + doc de la lib | code + prompt + coût à surveiller | **un seul fichier de données typé** (`src/data/assistant.ts`) |
| Accessibilité | variable, souvent iframe | variable | selon l'interface écrite | **maîtrisée** (voir § 4) |
| Hors ligne / export statique | oui | oui | non (réseau) | oui |

Pourquoi D et pas B : les bibliothèques apportent un moteur de scénario que nous n'avons pas besoin d'abstraire (un arbre de 20 à 30 nœuds tient dans un tableau typé), imposent leur CSS et violeraient la règle « aucune dépendance nouvelle sans accord ». Pourquoi D et pas C maintenant : C reste possible plus tard **par-dessus** D (le même panneau, avec un champ libre branché sur un Worker), sans jeter le travail ; et D fonctionne sans le compte Anthropic que le client n'a pas encore.

## 4. Bonnes pratiques retenues (et ce qu'on en fait)

### 4.1 Conversation guidée
- **Annoncer que c'est un bot**, dire ce qu'il sait faire dès le premier message (NN/g, Parallel). → Message d'accueil : « Je suis l'assistant automatique du Groupe Baruck. Choisissez un sujet ci-dessous ; pour tout le reste, l'équipe vous répond sur WhatsApp. »
- **Boutons d'abord, texte libre ensuite** ; 3 à 6 intentions de départ (NN/g). → Accueil du bot : 6 sujets (Studio photo, Hôtesses, JECA, Espoir de Vie, Le Groupe, Nous joindre). Pas de champ libre en phase 1 (voir § 7).
- **Une idée par message, ≤ 300 caractères, jamais plus de 5 messages sans action du visiteur** (Smart Tribune). → Réponses courtes ; les réponses longues (prix) sont découpées en listes.
- **Profondeur 3 à 5 niveaux, une thématique par branche** (Smart Tribune). → Arbre à 3 niveaux : sujet → question → réponse + suites.
- **Sortie vers un humain toujours visible** (NN/g, Parallel). → Bouton « Parler à quelqu'un » permanent dans le pied du panneau, menant à WhatsApp siège, appel, e-mail, formulaire.
- **Reprendre là où on s'était arrêté** (Parallel). → Le fil et l'état ouvert/fermé sont conservés pendant la session de navigation (`sessionStorage`, aucune donnée personnelle, effacé à la fermeture de l'onglet) pour survivre aux liens internes que le bot propose.
- **Contexte de la page** : quand le visiteur ouvre le bot sur `/studio-photo/`, le premier sujet proposé est le studio ; idem hôtesses, JECA, Espoir de Vie, contact.
- **Indicateur de frappe** court (≈ 450 ms) pour rythmer, supprimé si `prefers-reduced-motion` (le délai « humanisant » de 3–4 s conseillé par Smart Tribune est trop long pour des réponses scriptées).
- Pas d'ouverture automatique, pas de bulle intrusive au chargement (Make Things Accessible : jamais de pop-up instantané).

### 4.2 Accessibilité (WCAG 2.2, Make Things Accessible, CANAXESS, Deque)
- Lanceur = `<button>` focusable, libellé explicite (« Ouvrir l'assistant » / « Fermer l'assistant »), `aria-expanded`, `aria-controls`.
- Panneau = `role="dialog"` **non modal** avec `aria-labelledby` ; le focus entre dans le panneau à l'ouverture et revient au lanceur à la fermeture ; `Échap` ferme ; pas de piège de focus (la page reste utilisable au clavier).
- Fil = `role="log"` + `aria-live="polite"` : les nouveaux messages sont annoncés sans interrompre ; le fil est focusable et défile.
- Chaque message porte qui parle (« Assistant » / « Vous ») en texte, pas seulement par la couleur.
- Options = vrais `<button>` (nœud suivant) ou `<a>` (page interne via `next/link`, lien externe avec `target="_blank" rel="noreferrer"`), contraste ≥ 4,5:1 sur fond `ink`, `:focus-visible` global conservé.
- Animations CSS courtes, neutralisées par le bloc `prefers-reduced-motion` existant.
- Mobile : panneau en feuille pleine largeur ancrée en bas (hauteur ≤ 80 svh), bouton fermer visible, ne masque pas l'en-tête.

### 4.3 Performance
- Pas de script tiers, donc aucun impact LCP ; le composant est un client component léger monté dans `PageShell`, le panneau n'est rendu qu'à l'ouverture.
- Aucun `<img>` dans le bot ; icône SVG inline.
- Lanceur en `position: fixed` avec taille fixe → aucun décalage de mise en page (CLS 0).
- Le lanceur passe **sous** le voile du menu latéral (`z-[70]` < `z-[80]`) pour ne pas gêner la navigation ouverte.

## 5. Spécification de la chatbox Baruck

### 5.1 Identité
- Nom affiché : **Assistant Baruck** ; sous-titre « Réponses automatiques · sans collecte de données ».
- Ton : vouvoiement, phrases courtes, même registre que le site.
- Couleurs : fond `ink`, texte `ivory`, accent `accent` (tokens existants) ; identique sur toutes les pages y compris JECA et Espoir de Vie (élément global du site, pas de la page).

### 5.2 Arbre (source unique : `src/data/assistant.ts`)
Chaque nœud = un identifiant, un ou plusieurs messages, des options. Une option mène à un autre nœud, à une route interne, ou à un lien externe. Les textes viennent de `src/data/*` existants ; les chiffres cités sont ceux déjà publiés.

- **start** — accueil + 6 sujets (ordre adapté à la page courante).
- **studio** — 6 questions : tarifs (dérivés de `studioPriceGroups`), rendez-vous, horaires, adresse, déplacement en extérieur, anniversaires enfants (réponses = `studioFaq`), + « Demander un tarif sur WhatsApp » (`whatsappRequests.studioPrices`), + lien page.
- **hotesses** — que font-elles (3 offres), types d'événements (tags), comment réserver (`whatsappRequests.hostessBooking`), + lien page.
- **jeca** — qu'est-ce que la JECA, les éditions (3 dates / villes), participer ou intervenir (e-mail objet JECA), + lien page.
- **edv** — mission (5 piliers), l'orphelinat (2017), où agit l'ONG (3 pays), collaborer (e-mail objet Espoir de Vie), + lien page. **Aucune mention de don** (règle client).
- **groupe** — qui est le Groupe (9 domaines), où est-il présent (Guinée, Sénégal, Côte d'Ivoire), le PDG (renvoi page), + lien page.
- **contact** — adresse, horaires validés, téléphones, WhatsApp, e-mail, formulaire.
- **humain** (« Parler à quelqu'un ») — WhatsApp siège, appeler le siège, e-mail, formulaire de contact.

Hors bot (décisions client en attente) : monnaie / chiffres non validés d'Espoir de Vie, ONG vs Fondation (le bot dit « Espoir de Vie » sans qualifier), prochaine édition JECA, agrément, date de création du Groupe.

### 5.3 Comportement
- Lanceur fixe en bas à droite (56 px, texte « Assistant » visible sur desktop, icône seule sur mobile).
- Ouverture : panneau 380 × ≤ 620 px ancré au-dessus du lanceur (desktop) / feuille pleine largeur (mobile) ; focus sur le titre du panneau.
- Réponse : indicateur de frappe ≈ 450 ms puis message(s) + options ; le fil défile en bas.
- Pied : « Recommencer » et « Parler à quelqu'un » toujours accessibles.
- Persistance : `sessionStorage` (fil + état), lecture/écriture protégées par `try/catch` ; rien si le stockage est bloqué.

## 6. Plan de mise en œuvre

| Étape | Livrable | Contrôles |
|---|---|---|
| 1 | `src/data/assistant.ts` : types + arbre complet, réutilisant `studioFaq`, `studioPriceGroups`, `hostessOffers`, `jecaEditions`, `edvPillars`, `edvCountries`, `activities`, `contacts`, `hqAddress`, `hqHours` | `typecheck` |
| 2 | `src/components/assistant/SiteAssistant.tsx` (client) + styles `.assistant-*` dans `globals.css` (`@layer components`, `@keyframes` dans `@theme`) | `lint`, `typecheck` |
| 3 | Montage dans `PageShell` (toutes les pages) | build Turbopack + `basePath`, greps de référence, ids uniques |
| 4 | Doc : ce fichier + `docs/passation.md` (état, backlog 3) | — |

Un seul commit (`feat(assistant): guided chatbox with scripted answers`), poussé après les contrôles de référence.

**Ce que Mohamed doit regarder** : le lanceur en bas à droite sur desktop et mobile (ne doit pas gêner le pied de page ni le menu latéral), l'ouverture / fermeture au clavier (Tab, Entrée, Échap), la lisibilité du panneau sur les pages JECA et Espoir de Vie (fond ink sur papier bleuté / crème), le rendu de la liste des prix, le comportement après un clic sur un lien interne proposé par le bot (le fil doit être conservé), le mode `prefers-reduced-motion`.

## 7. Suites possibles (phase 2, à décider)
1. **Champ libre avec recherche par mots-clés** dans les intitulés de questions (sans IA, toujours en local) : utile, mais à valider car un mauvais appariement donne une réponse à côté.
2. **Compteur d'usage local** : impossible sans analytics (règle) ; à la place, demander au client quelles questions reviennent sur WhatsApp et enrichir l'arbre.
3. **Option C par-dessus D** : brancher le champ libre sur un Worker Cloudflare + Claude quand le client aura son compte, en gardant les réponses scriptées comme socle.
4. **Bouton WhatsApp direct dans le lanceur** (comme Central Group / G-CORE) si le bot est jugé trop indirect.

## 8. Sources
- Nielsen Norman Group via Fuselab Creative, « Chatbot UI Design Patterns and Best Practices 2026 » — https://fuselabcreative.com/chatbot-interface-design-guide/ (3 à 6 intentions de départ, hybride boutons + texte, annoncer le bot)
- Parallel, « How to Design Chatbot UX » — https://www.parallelhq.com/blog/chatbot-ux-design (boutons d'abord, message d'accueil avec exemples, sortie humaine, reprise de contexte)
- Smart Tribune, « Les bonnes pratiques pour optimiser l'utilisation d'un chatbot » — https://blog.smart-tribune.com/fr/optimiser-utilisation-chatbot (3–5 niveaux, ≤ 300 caractères, ≤ 5 messages enchaînés, escalade humaine)
- Lollypop, « Chatbot UI UX Design Best Practices » — https://lollypop.design/blog/2025/january/chatbot-ui-ux-design-best-practices-examples/
- Make Things Accessible, « Chatbots and Web Accessibility » — https://www.makethingsaccessible.com/guides/chatbots-and-web-accessibility-addressing-usability-issues-and-embracing-inclusive-design/
- CANAXESS, « Accessible chatbot design » — https://www.canaxess.com.au/infocard/chatbots/ (aria-live polite, container focusable, labels)
- Deque, « WAI-ARIA Modal Alert Dialogs » — https://www.deque.com/blog/aria-modal-alert-dialogs-a11y-support-series-part-2/
- corewebvitals.io, « Load a chat widget with perfect Core Web Vitals » — https://www.corewebvitals.io/pagespeed/chat-widget-perfect-core-web-vitals (poids 155–750 Ko, 300–600 ms de blocage)
- Chatim, « Tawk.to vs Tidio (2026): What Free Really Gets You » — https://chatim.app/en/blog/tawkto-vs-tidio/ (limites des offres gratuites)
- Chatarmin / Aerochat, boutons WhatsApp flottants — https://chatarmin.com/en/blog/click-to-chat-for-whatsapp, https://aerochat.ai/blog/whatsapp-chat-button
- npm react-chatbot-kit (dernière publication il y a 3 ans) — https://www.npmjs.com/package/react-chatbot-kit ; React ChatBotify — https://react-chatbotify.com/ ; BotUI — https://botui.org/
- Sites de référence relevés par `curl` le 2026-09-06 : https://g-coregroup.com/, https://centralgroupgn.com/, https://www.fondationkaydan.org/, https://teyliom.com/, https://groupe-guicopres.com/, https://www.heirsholdings.com/
