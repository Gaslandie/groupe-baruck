# Back-office Groupe Baruck — benchmark, décision et mise en place

## Finalisation locale — protection du travail éditorial

**Le travail reste local, à la demande de Mohamed.** Accès : <http://127.0.0.1:8091/>. Aucun déploiement ni push dans cette étape. La cible Bluehost décrite ensuite reste un projet pour plus tard.

- Les brouillons et la dernière version validée sont séparés : retravailler un article ne le retire plus du prochain export. Seul l’administrateur valide une nouvelle version ou confirme un retrait.
- Chaque enregistrement conserve une révision restaurable en brouillon. Les conflits empêchent d’écraser une modification plus récente. La migration ajoute les tables sans remplacer les comptes ou les articles existants.
- Une saisie envoyée après expiration peut être récupérée pendant une heure après reconnexion au même compte, si la session serveur existe encore. La frappe sans envoi n’est pas sauvegardée automatiquement.
- Les nouveaux mots de passe exigent 15 caractères visibles ; les limites de tentatives portent sur le compte et l’adresse IP. Les liens Markdown invalides sont refusés dès l’enregistrement sur le corpus testé, avec contrôle final par le chargeur Next au build.

La suite concerne l’éditeur et son aperçu, le choix des images dans le formulaire, la sauvegarde automatique avant fermeture et les contrôles SEO éditoriaux. Une recette des parcours sur mobile, au clavier et avec Mohamed reste nécessaire avant de qualifier l’expérience d’aboutie. La boutique reste hors périmètre.

Les tests éditoriaux, d’import/export et de validation PHP passent, ainsi que les dix parcours HTTP/MySQL, dont restauration, retrait, migration répétée et récupération avec conflit ou changement de compte. Lint et TypeScript passent. Trois builds webpack en copie temporaire isolée passent : racine, préfixe `/groupe-baruck`, puis export réel MySQL avec article ajouté et image vérifiée par empreinte. RSS, sitemap, exclusion du brouillon et identifiants de l’accueil sont vérifiés ; les chemins des images sont contrôlés dans le build avec préfixe. Webpack conserve le contournement des limites de compilation en sandbox. La page locale répond HTTP 200. Voir le [guide actualisé](backoffice/INSTALLATION.md).

## Révision du 6 septembre 2026 — cible Bluehost

**Cette décision remplace le choix Pages CMS décrit dans l’étude historique ci-dessous.** Mohamed confirme un hébergement final Bluehost, MySQL et une boutique à venir. Ses captures montrent `groupebaruck.com` actif et l’accès cPanel, avec plusieurs sites sur le compte ; elles ne donnent ni le Document Root de Baruck, ni la version PHP active, ni la formule exacte. Aucun chemin serveur n’est déduit des noms des dossiers des autres sites.

La cible est une administration PHP/MySQL à `admin.groupebaruck.com`, avec comptes propres à Baruck. Le site public reste l’export Next.js, à placer sur `groupebaruck.com`. Les contenus validés alimentent sa construction. MySQL et les fichiers privés appartiennent au back-office ; les images sélectionnées sont copiées dans la publication publique. Ce choix évite de supposer qu’un serveur Node persistant est disponible : Bluehost documente PHP/MySQL pour ses serveurs mutualisés et une racine de sous-domaine distincte dans cPanel. [Versions Bluehost](https://www.bluehost.com/help/article/bluehost-software-and-program-versions), [sous-domaines](https://www.bluehost.com/help/article/subdomains).

### Arbitrage actualisé

| Piste | Avec Bluehost et MySQL | Décision pour ce lot |
| --- | --- | --- |
| Pages CMS / Sveltia / Decap | Restent possibles techniquement pour construire un site statique, mais conservent un backend Git pour les contenus | Ancienne piste ; ne correspond pas à l’administration autonome demandée |
| WordPress découplé du site | PHP/MySQL, comptes et révisions disponibles ; nécessite une installation WordPress et le raccordement Next ; WooCommerce serait une piste future, pas une conséquence obligatoire de MySQL | Alternative valable si les fonctionnalités éditoriales avancées deviennent prioritaires ; non installé dans ce lot |
| Administration PHP dédiée | Compatible avec la cible PHP/MySQL, interface et droits centrés sur Baruck, aucune bibliothèque npm ou Composer supplémentaire | Implémentation de ce premier lot ; coût de maintenance de l’authentification et des fonctions éditoriales assumé dans le périmètre technique |
| Framework PHP avec administration | Socle plus riche, mais nouvelles dépendances, contraintes de déploiement et maintenance à valider | À réévaluer si l’administration devient une application métier importante |
| Payload / Strapi / backend Next | Demande un runtime Node et son exploitation, non établis par les captures | Ne pas retenir sur la seule preuve d’un accès cPanel |

Il ne s’agit pas d’une équivalence fonctionnelle avec un CMS mature : l’éditeur visuel, les e-mails de récupération et l’automatisation du déploiement restent à prévoir. Les révisions restaurables sont désormais présentes dans la finalisation locale décrite plus haut. La boutique est explicitement hors de ce lot.

### Lot implémenté et suite

1. Administration locale PHP 8.2/MySQL 8 : authentification, administrateur/rédacteur, révocation des sessions, journal, actualités avec galeries, images privées, validation et conflits d’édition. L’initialisation importe les six articles existants sans les réécrire. Le premier compte local est choisi par Mohamed, aucun identifiant imposé.
2. Export des seuls contenus validés et construction avec le chargeur Next existant : validation des contenus, URL existantes conservées, nouvelles pages, médias, RSS, sitemap, domaine configurable. Le paquet d’administration est généré sans secrets.
3. À exécuter avec l’accès Bluehost : vérifier PHP et la racine du domaine, créer le sous-domaine, la base dédiée, le certificat, installer et effectuer la recette HTTPS. Les captures ne donnent pas une session technique utilisable par Codex.
4. À raccorder après recette de l’hébergement : déploiement des publications avec sauvegarde, retour arrière et déclenchement depuis l’administration. Pour l’instant, l’interface distingue validation, téléchargement et mise en ligne effective.

Le guide concret est dans [backoffice/INSTALLATION.md](backoffice/INSTALLATION.md). Les tests portent sur les autorisations serveur, les sessions, CSRF, les fichiers reçus, la concurrence d’édition et le passage vers l’export ; aucune capture ni appréciation visuelle du site n’est produite. Les mécanismes de sessions et de hachage suivent les primitives documentées par PHP. [Sessions](https://www.php.net/manual/en/features.session.security.management.php), [password_hash](https://www.php.net/manual/en/function.password-hash.php).

### Vérifications de cette livraison Bluehost

- Lint et TypeScript passent. Les 18 cas éditoriaux existants et les 5 cas d’import/export passent.
- La recette HTTP avec PHP 8.2 et MySQL 8 passe ses 7 parcours : premier compte/CSRF, rôles, validation/conflits, upload/MIME/confidentialité, export, révocation des sessions et limitation des connexions. Elle utilise une base éphémère indépendante.
- Les exports Next.js à la racine et avec `/groupe-baruck` passent ; chemins d’images et identifiants HTML vérifiés. Un troisième build utilise l’export réel de la base de recette : article ajouté, image identique à son empreinte, métadonnées sur `groupebaruck.com`, RSS, sitemap et exclusion du brouillon vérifiés. Aucun contenu de recette n’est ajouté au dépôt ni déployé.
- Builds réalisés avec webpack dans une copie isolée : l’exécution en sandbox bloquait le sous-processus TypeScript. Le serveur de développement du site reste indépendant.
- Le paquet d’administration ne contient ni configuration privée, ni base, ni sessions, ni secrets. L’entrée locale répond sur `http://127.0.0.1:8091/` ; 8081 appartient déjà à un autre projet. La création de compte et les données locales persistent dans les volumes Baruck.
- Non vérifiés à ce stade : configuration Apache/cPanel réelle, HTTPS du sous-domaine, accès MySQL Bluehost, sauvegarde/restauration distante et transfert des publications. Aucun déploiement Bluehost n’est annoncé comme effectué.

## Étude historique — hypothèse GitHub Pages, remplacée ci-dessus

Date de recherche : 6 septembre 2026. Périmètre de cette étape : commencer le back-office éditorial, avec les actualités et leurs images, en conservant GitHub Pages. Planification, implémentation et relecture assurées par Codex à la demande de Mohamed.

## Décision

Retenir **Pages CMS pour le premier lot**, avec un accès initial pour Mohamed. Le projet dispose déjà du modèle de contenu nécessaire. L’application hébergée édite les fichiers du dépôt ; le site continue d’être construit par GitHub Actions. L’offre hébergée est annoncée gratuite et le logiciel est sous licence MIT. [Présentation et tarif Pages CMS](https://pagescms.org/), [fonctionnement](https://pagescms.org/docs/).

**Condition de ce choix :** Pages CMS convient à une petite équipe de confiance avec validation humaine organisée. Ne pas présenter son bouton Brouillon comme une séparation des droits entre rédacteur et responsable de publication. Si le client exige un circuit intégré de soumission et d’approbation dès l’ouverture, réexaminer Sveltia CMS ou une solution avec rôles adaptés avant de l’inviter.

## Méthode et besoins

Benchmark documentaire sur les sources officielles, confronté au code réel du dépôt au commit `bb01f63`. Les appréciations d’intégration et de maintenance ci-dessous sont des conclusions techniques pour ce projet. Aucun essai comparatif d’interfaces, mesure de performance, test utilisateur ou jugement visuel n’a été effectué. Les tarifs sont ceux affichés lors de la consultation, en dollars américains, hors éventuels frais, taxes, domaine et maintenance ; vérifier le tarif final avant tout abonnement.

Critères prioritaires, dans l’ordre :

1. Compatibilité avec l’export statique et les fichiers existants.
2. Accès simple pour un client qui ne développe pas.
3. Brouillons, validation, stabilité des URL et restauration.
4. Images de couverture, galeries ordonnées et descriptions accessibles.
5. Coût total, entretien, dépendance au fournisseur et possibilité de migration.
6. Extension aux autres contenus sans exposer les composants ou les styles.

### Inventaire local

| Domaine | Situation constatée | Conséquence pour le back-office |
| --- | --- | --- |
| Actualités | Six fichiers `content/actualites/*.md`, YAML + Markdown | Première collection immédiatement intégrable |
| Catégories | Groupe, JECA, Espoir de Vie, Studio photo, Hôtesses | Liste fermée conservée |
| Couvertures et galeries | Images locales ; dimensions lues au build | Garder les chemins `/images/…` indépendants du domaine |
| Publication | Push sur `main` → lint, typecheck, build, déploiement | Une modification publiée devient visible après un déploiement réussi |
| Brouillons | Champ `draft`, exclus de la production | Statut éditorial, sans authentification ni confidentialité à lui seul |
| Autres pages | Données TypeScript et parfois JSX, textes aussi dans les composants | Extraction en JSON/YAML à prévoir collection par collection |
| Coordonnées, horaires, dénominations | Arbitrages client en attente dans la passation | Ne pas rendre ces valeurs publiables sans leur circuit de validation |
| Données métier | Pas de base de contacts ni de gestion d’inscriptions dans ce périmètre | Un éventuel CRM demande un besoin et une architecture distincts |

## Comparaison des solutions

« Compatible avec Pages » signifie que le site public peut y rester. Cela ne signifie pas que GitHub Pages peut héberger le serveur d’un CMS.

| Solution | Compatibilité et accès | Publication / médias | Coût et entretien | Conclusion pour Baruck |
| --- | --- | --- | --- | --- |
| **Pages CMS** | Édition directe du dépôt ; configuration YAML ; invitations par e-mail sans compte GitHub pour le client | Champs, éditeur enrichi, médias dans Git ; droits fins et workflow d’approbation à ne pas supposer | Hébergé annoncé à 0 $ ; configuration à maintenir | **Premier choix** pour démarrer avec Mohamed. [Configuration](https://pagescms.org/docs/configuration/), [collaborateurs](https://pagescms.org/docs/configuration/collaborators/) |
| **Sveltia CMS** | Administration statique séparée ; backend GitHub et authentification à configurer | Workflow éditorial avec branches et PR ; revue avant fusion | Logiciel libre ; entretien de l’administration et de l’authentification | **Alternative prioritaire** si la revue intégrée devient indispensable. [Projet](https://github.com/sveltia/sveltia-cms), [GitHub](https://sveltiacms.app/en/docs/backends/github), [workflow](https://sveltiacms.app/en/docs/workflows/editorial) |
| **Decap CMS** | Administration statique ; backend GitHub classique exigeant compte et accès au dépôt ; service OAuth à prévoir | Workflow éditorial et aperçus à intégrer | Logiciel MIT ; coût éventuel et maintenance de l’authentification | Option crédible, mais plus de raccordements pour ce premier lot. Ce constat porte sur le backend GitHub classique, pas sur toutes ses offres. [GitHub](https://decapcms.org/docs/github-backend/), [workflow](https://decapcms.org/docs/editorial-workflows/) |
| **Keystatic** | Schéma TypeScript et stockage Git ; Cloud permet des utilisateurs sans GitHub ; intégration Next standard avec routes API | Champs structurés ; médias Git ou Cloud Images | Cloud gratuit jusqu’à trois utilisateurs ; Pro à partir de 10 $/mois, utilisateurs supplémentaires selon tarif | Le site public peut rester statique, mais l’administration distante standard demande un hébergement séparé. Trop de changements ici. [Intégration Next](https://keystatic.com/docs/installation-next-js), [Cloud](https://keystatic.com/docs/cloud) |
| **TinaCMS** | CMS lié à Git ; intégration et schéma à ajouter au projet | Édition visuelle ; possibilités de workflow selon offre | Free : deux utilisateurs ; Team : 29 $/mois ; Team Plus : 49 $/mois ; Business : 299 $/mois | À considérer si l’édition directement liée aux pages devient un besoin fort ; intégration plus importante que Pages CMS. [Offres et fonctionnalités](https://tina.io/pricing) |
| **Sanity** | Studio et contenu hébergé ; récupération des données au build à intégrer | Collaboration, prévisualisation ; rôles détaillés et brouillons planifiés en Growth | Free : jusqu’à vingt sièges mais seulement administrateur/lecteur ; Growth : 15 $/siège/mois | Bonne piste pour une équipe éditoriale plus importante, avec migration des données et déclenchement des builds à organiser. [Tarifs et rôles](https://www.sanity.io/pricing) |
| **Payload** | Application Node/Next avec base de données ; ne s’exécute pas sur GitHub Pages | Administration et API configurables ; stockage durable des médias à organiser | Logiciel libre ; serveur, base, stockage et exploitation à financer ou administrer | À réexaminer si le besoin devient une application métier ; disproportionné pour six articles. [Démarrage](https://payloadcms.com/get-started), [déploiement](https://payloadcms.com/docs/production/deployment) |
| **Strapi** | CMS et API sur serveur séparé ; connexion du build Next à développer | Rôles et Draft & Publish ; Review Workflows en Enterprise | Community gratuit ; Growth CMS : 45 $/mois avec trois sièges ; hébergement Cloud Starter affiché à 35 $/mois, distinct de la licence CMS | Intéressant pour plusieurs applications consommant la même API ; coût et exploitation supérieurs au besoin initial. [Licence CMS](https://strapi.io/pricing-cms), [hébergement](https://strapi.io/pricing-cloud) |
| **WordPress** | PHP et base MySQL/MariaDB sur un autre hébergement ; intégration headless ou migration du site | Gestion des utilisateurs, articles, médias et révisions | Logiciel libre ; hébergement, extensions et mises à jour à entretenir | Option à choisir si le client privilégie son écosystème ; ici, la migration n’apporte pas assez au premier lot. [Fonctionnalités](https://wordpress.org/about/features/), [prérequis](https://wordpress.org/about/requirements/) |

### Arbitrage

Pages CMS minimise les modifications et conserve une sortie simple : les articles restent des fichiers Markdown et les photos restent dans Git. Son avantage est particulièrement net pour le démarrage. Sveltia apporte un processus de revue plus complet, au prix de l’installation de l’administration et de son authentification. Ses documents annoncent un workflow GitHub/GitLab mais signalent aussi que leur documentation évolue : faire un essai réel avant de s’engager sur les comportements précis. [Workflow Sveltia](https://sveltiacms.app/en/docs/workflows/editorial).

Sanity devient plus intéressant si plusieurs personnes doivent travailler simultanément avec des droits différenciés. Payload ou Strapi seraient à évaluer pour un futur besoin de contacts, d’inscriptions ou de relations complexes entre données. Construire aujourd’hui un tableau de bord, une authentification et une base sur mesure ajouterait cette maintenance sans bénéfice démontré pour l’édition actuelle.

La mention ancienne « Keystatic incompatible avec l’export statique » doit être comprise plus précisément : ce sont ses routes d’administration/API standard qui ne peuvent pas fonctionner dans l’export GitHub Pages. Séparer l’administration reste possible ; ce n’est simplement pas le chemin retenu ici. [Guide Next officiel](https://keystatic.com/docs/installation-next-js).

## Plan par étapes

| Étape | Livrable | Critères d’acceptation / dépendances |
| --- | --- | --- |
| **1 — Fondation éditoriale, présente livraison** | Benchmark, `.pages.yml`, chargeur compatible avec la saisie CMS, tests, guide d’exploitation | Six articles préservés ; champs vides acceptés ; brouillons exclus ; formats invalides refusés ; lint, typecheck, tests et deux exports |
| **2 — Activation et recette avec Mohamed** | Connexion Pages CMS au seul dépôt Baruck, essai sur branche dédiée, publication contrôlée et restauration | Intervention du propriétaire pour l’installation GitHub App ; recette de l’éditeur connecté et du déploiement avant invitation client |
| **3 — Accès client et validation** | Mode opératoire des rôles et des publications ; invitation nominative après accord | Choisir accès de confiance ou revue obligatoire ; tester les droits effectifs et les protections GitHub avant tout accès client |
| **4 — Autres contenus du site** | Extraire progressivement textes et médias éditables en JSON/YAML, puis ajouter les formulaires CMS | Commencer par les données validées et souvent modifiées ; préserver rendu, URL et structure ; traiter à part les valeurs provisoires |
| **5 — Besoins métier éventuels** | Brief séparé pour contacts, demandes, inscriptions, recherche ou multilingue | Confirmer utilisateurs, volumes, budget et données à conserver avant choix de base et d’hébergement |

Pas d’échéance ni de prix de prestation inventé : le premier lot est du travail local ; les suivants dépendent notamment de l’accès au compte et des arbitrages de Mohamed. Une étape correspond à un commit et à un compte rendu.

## Ce qui est implémenté

- `.pages.yml` déclare une collection Actualités avec libellés et aides en français : titre, date, catégorie, résumé, couverture, description, galerie ordonnée, légendes, corps Markdown et brouillon activé à la création.
- Les six articles existants reçoivent `draft: false` explicitement, sans modifier leurs textes : une première sauvegarde dans le CMS ne doit pas leur appliquer le défaut Brouillon réservé aux nouveaux articles.
- Les nouveaux fichiers prennent leur nom depuis le titre ; renommage et suppression d’articles sont désactivés dans le CMS pour conserver les adresses. Pour retirer un article, le repasser en brouillon. Le nom `a-venir` reste réservé par le chargeur. [Noms de fichiers](https://pagescms.org/docs/configuration/content/filename/), [opérations](https://pagescms.org/docs/configuration/content/operations/).
- La médiathèque couvre `public/images` afin de conserver l’accès aux couvertures JECA existantes. Les champs proposent `public/images/actualites` pour les nouveaux fichiers, limités à JPG/JPEG/PNG/WebP et renommés avec la règle `safe`. Les chemins enregistrés restent `/images/…`, puis le site ajoute son préfixe. Le sous-dossier proposé n’est pas une restriction d’accès. [Médias](https://pagescms.org/docs/configuration/media/), [champ image](https://pagescms.org/docs/configuration/fields/image/).
- Les sauvegardes conservent les clés hors schéma, avec messages de commit conventionnels. L’identité de l’application est utilisée, sans injecter l’e-mail du collaborateur dans le message de commit. [Paramètres](https://pagescms.org/docs/configuration/settings/).
- Le chargeur accepte couverture, description et légende facultatives vides/nulles, ainsi qu’une galerie nulle. Une couverture présente exige sa description ; chaque image de galerie exige la sienne.
- En production, un brouillon déclaré par le booléen `true` est écarté avant la validation de ses champs. Un YAML mal formé peut encore faire échouer le build. En développement, les brouillons sont visibles et restent soumis aux validations.
- Catégories, dates calendaires, contenu et chemins sont vérifiés. Le frontmatter doit être YAML ; les moteurs exécutables, le HTML brut, les liens exécutables et les images sortant du dossier sont refusés. Le rendu des images Markdown inclut dimensions, texte alternatif, chargement différé et préfixe d’hébergement.
- `npm test` vérifie les cas éditoriaux et la correspondance entre configuration et contenus. La CI exécute cette commande avant l’export.

Le schéma suit la documentation Pages CMS consultée. Les tests locaux contrôlent le contrat avec le site ; ils ne remplacent pas une sauvegarde réelle dans l’application hébergée. Le fonctionnement connecté n’est pas encore vérifié.

## Activation par Mohamed

La configuration doit d’abord être disponible sur GitHub. Aucun compte Pages CMS, consentement GitHub App, invitation ou abonnement n’est créé par cette livraison.

1. Publier le commit relu, puis créer une branche d’essai depuis cette version, par exemple `cms-recette`. Elle ne doit pas être la branche de déploiement `main`.
2. Ouvrir [Pages CMS](https://app.pagescms.org/), se connecter avec le compte GitHub propriétaire et installer son application sur **le seul dépôt `Gaslandie/groupe-baruck`**. Cette étape nécessite la session personnelle de Mohamed ; aucun mot de passe ou jeton n’est à transmettre à Codex. [Procédure officielle](https://pagescms.org/docs/quick-start/).
3. Sélectionner le dépôt et la branche d’essai. Vérifier que les six articles sont listés et que leurs catégories, couvertures et galeries sont correctement lues.
4. Créer un article d’essai avec Brouillon activé. Ajouter une image dans `actualites`, sa description et une galerie. Enregistrer, puis rouvrir pour vérifier la persistance et l’ordre des photos.
5. Tester la suppression d’une couverture facultative et d’une légende, un titre accentué, la modification d’un titre existant et les liens `/jeca/`. Inspecter les fichiers Git : corps hors frontmatter, date `YYYY-MM-DD`, slug ASCII stable, aucune adresse contenant deux fois `/groupe-baruck`.
6. Sur cette branche, vérifier le site avec `npm run dev`, puis avec les commandes de contrôle ci-dessous. Un article de test en brouillon ne doit pas figurer dans les routes exportées ni dans le sitemap. Les fichiers d’essai ne doivent pas être fusionnés en production.
7. Faire la première publication réelle uniquement avec un contenu validé. Désactiver Brouillon, enregistrer sur la branche choisie, relire et intégrer la modification dans `main`, puis vérifier la réussite de GitHub Actions et l’article public.

Mohamed doit regarder dans l’éditeur : compréhension des libellés, facilité de saisie, choix de couverture, ordre des images et visibilité du statut Brouillon. Sur le site : couverture, carrousel, article, liens et présence dans les dernières actualités. Aucune capture d’écran n’est requise.

## Publication, droits et limites à connaître

**Enregistrer sur `main` est une modification de production.** Si l’article est déjà publié, sa mise à jour part au prochain déploiement. Cocher Brouillon sur un article publié le retire du site ; cela ne crée pas une copie de travail conservant sa version publique. Une date future est une information, pas une programmation automatique.

**Validation de confiance pour le premier usage :** Mohamed relit avant de désactiver Brouillon. Pour imposer une revue distincte, il faudra éprouver une branche éditoriale et les protections de `main`, ou adopter un CMS avec workflow intégré. La configuration présente ne crée pas de rôle « peut écrire mais ne peut pas publier », de protection de branche ni de PR automatique. Les permissions des collaborateurs Pages CMS ne sont pas stockées dans `.pages.yml`. [Collaborateurs](https://pagescms.org/docs/configuration/collaborators/).

**Brouillon ne signifie pas confidentiel.** Dans un dépôt public, les fichiers et leur historique sont consultables sur GitHub. Les images placées dans `public/` sont copiées dans l’export, y compris celles d’articles en brouillon, et restent accessibles par URL. Aucun document privé, contact personnel ou photo non autorisée ne doit donc servir de contenu de travail dans ce circuit.

**Médias existants :** la bibliothèque donne accès aux images du site. Les règles de suppression d’articles ne constituent pas une protection contre la suppression ou le remplacement d’un média. Ne pas modifier une image partagée sans vérifier ses usages ; l’ouverture à d’autres rédacteurs doit inclure ce test. L’optimisation automatique et une limite de poids personnalisée ne sont pas implémentées. Préparer les photos avant chargement et surveiller la taille du dépôt.

**Build échoué :** consulter le journal GitHub Actions ; corriger le fichier signalé ou restaurer son contenu. Le déploiement n’a lieu qu’après les contrôles ; la version précédemment déployée reste en ligne si le build échoue. Ne pas désactiver les contrôles pour publier.

**Restauration :** identifier le commit de contenu et l’image éventuellement concernée dans l’historique GitHub. Restaurer ces fichiers depuis la version correcte, ou faire un `git revert` du commit après avoir relu son périmètre, puis relancer les contrôles. Éviter de supprimer d’autres changements survenus entre-temps. L’historique Git permet ce retour ; une copie périodique du dépôt apporte une sauvegarde indépendante. Changer de CMS reste possible en réutilisant les fichiers ; les invitations doivent être gérées séparément.

## Contrôles locaux

Node 24, dépendances existantes uniquement :

```bash
npm test
npm run lint
npm run typecheck
npm run build
NEXT_PUBLIC_BASE_PATH=/groupe-baruck npm run build
grep -rn 'src="/images' out/
grep -o 'id="[a-z-]*"' out/index.html | sort | uniq -d
```

Les deux dernières commandes doivent rester vides. Si la sandbox bloque Turbopack, utiliser `npm run build -- --webpack` pour les deux exports et signaler ce mode dans le compte rendu. Les tests utilisent des fichiers temporaires ; ils ne publient et ne modifient aucun article réel.

### Résultat de la présente livraison

Vérification dans une copie isolée synchronisée avec le commit `6eb6e59` et les changements du back-office : lint et typecheck réussis, 18 tests réussis, exports sans préfixe et avec `/groupe-baruck` réussis. Les six routes d’articles sont conservées. Un brouillon incomplet ajouté uniquement à la copie de test est absent des routes, du HTML et du sitemap ; les chemins d’images sont préfixés et les ids de l’accueil sont uniques.

Les deux builds ont utilisé Webpack. Turbopack refusait le lien symbolique vers `node_modules` de la copie isolée ; le build Webpack a ensuite nécessité une exécution hors sandbox, celle-ci perturbant la sortie du sous-processus TypeScript. La configuration de production reste inchangée. Aucun essai de connexion ou d’enregistrement dans Pages CMS n’a été réalisé.
