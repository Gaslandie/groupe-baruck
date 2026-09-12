# Administration Baruck sur Bluehost

Cette application PHP est distincte de l’export public Next.js. Elle gère les comptes, les actualités et les images dans MySQL et un stockage privé. Aucun compte GitHub n’est nécessaire à ses utilisateurs. Le sous-domaine prévu est `admin.groupebaruck.com` ; il n’est pas créé par le paquet.

## État et limites de ce lot

**Travail exclusivement local pour le moment.** Les procédures Bluehost ci-dessous sont conservées pour plus tard ; aucun déploiement ne doit être déclenché dans cette étape.

Le back-office fonctionne localement avec une vraie base MySQL. Les six actualités du dépôt servent d’import initial, sans écrasement lors d’une réinstallation. Les contenus validés peuvent être exportés puis construire le site existant, avec ses URL, son sitemap et son RSS. **Le déploiement Bluehost et le déclenchement automatique de publication ne sont pas raccordés.** Le bouton de téléchargement le dit explicitement.

L’édition du corps utilise Markdown ; l’éditeur visuel, l’aperçu avant validation, la publication planifiée et la réinitialisation par e-mail restent à réaliser. L’administrateur peut supprimer une actualité jamais retenue pour publication et une image importée qu’aucun contenu n’utilise ; chaque suppression est confirmée dans un dialogue.

Chaque enregistrement conserve une révision complète. « Historique et restauration » affiche les 50 versions les plus récentes ; les versions antérieures restent en base. Une restauration crée un nouveau brouillon, avec contrôle des modifications concurrentes. Le rédacteur peut retravailler un article validé : **la dernière version validée reste disponible pour l’export** jusqu’à une nouvelle validation par un administrateur. Le retrait de la prochaine publication est une action distincte, réservée à l’administrateur et soumise à confirmation.

Si la session expire au moment d’envoyer le formulaire d’article, une saisie munie du jeton valide de cette session peut être récupérée pendant une heure après reconnexion au même compte. Elle reste à relire et à enregistrer ; une modification concurrente bloque son écrasement. Cela suppose que la session existe encore côté serveur. Ce mécanisme ne sauvegarde pas automatiquement la frappe et ne couvre pas la fermeture d’un onglet avant envoi ou la disparition du fichier de session. Un autre compte ne peut pas récupérer cette saisie.

## Boutique

« Boutique », dans le menu de gauche, gère les articles de la marque Baruck : les 39 articles du site servent d’import initial, sans écrasement lors d’une réinstallation. La page est **réservée à l’administrateur** ; les rédacteurs restent sur les actualités.

Une fiche demande un nom, un rayon et de une à six photos. **Aucun prix n’est saisi** : la commande reste un échange WhatsApp, comme sur le site. L’identifiant public de l’article — l’ancre `#produit-…` reprise dans le message WhatsApp du client — est déduit du nom à la création ; il n’est jamais saisi et ne change plus ensuite. La première photo est celle qui apparaît dans la collection ; Monter et Descendre définissent l’ordre des photos.

Un nouvel article est enregistré masqué, puis « Mettre en boutique » le retient pour la prochaine publication. Les nouveautés se placent en tête de la collection ; les flèches de la liste modifient cet ordre, sur la liste complète, sans recherche ni filtre. « Retirer de la boutique » l’exclut du prochain site construit en conservant sa fiche et ses photos ; seul un article retiré peut ensuite être supprimé.

Les rayons (Homme, Femme, Enfant, Autres vêtements, Sacs & petite maroquinerie, Chaussures, Parfums, Accessoires) appartiennent au site : ils sont lus depuis `src/data/marque-baruck.ts` par `backoffice:prepare` et ne se modifient pas depuis l’administration. Un rayon vidé de ses articles disparaît des filtres du site. La section « Parfums Baruck » de la page suit le premier article du rayon Parfums et disparaît si ce rayon est vide.

Le catalogue du dépôt vit dans `content/boutique.json`. Une publication qui ne contient aucun article de boutique laisse ce fichier en place : la collection du site n’est jamais vidée par accident.

## Coordonnées

« Coordonnées », réservée à l'administrateur, regroupe ce qui change dans la vraie vie : les cinq lignes de contact (fixe, mobile, WhatsApp du siège, WhatsApp du PDG, e-mail), l'adresse affichée du siège, le lieu recherché sur la carte, les horaires et les pages Facebook par pays.

**Aucun lien n'est saisi.** Les liens d'appel, de WhatsApp, d'e-mail et de carte se déduisent des valeurs : corriger un numéro corrige le menu, le pied de page, la page Contact, l'assistant et le bouton de commande de la boutique. L'encadré « Liens obtenus » montre le résultat avant enregistrement. Les numéros doivent commencer par l'indicatif international (`+224…`), sinon le lien WhatsApp serait faux. Un lien de page doit rester une adresse `https` de facebook.com.

Les horaires et les pages Facebook sont des listes : deux lignes vides s'ajoutent toujours en bas pour en créer, et **vider une ligne la retire**. Aucun JavaScript n'est nécessaire. Une modification concurrente est refusée et demande de recharger la page.

La réponse de la FAQ sur les horaires suit désormais ces lignes : modifier les horaires ne laisse plus une réponse fausse sur la page Contact.

Techniquement, ces coordonnées partent dans le bundle du navigateur (en-tête, formulaire, assistant) : elles ne peuvent pas être lues par un chargeur serveur comme les actualités. Elles passent par un alias de build (`next.config.ts`) qui pointe sur `content/coordonnees.json` du dépôt ou, pendant une publication, sur le fichier validé déposé dans `.backoffice-content/` — un emplacement ignoré par Git, effacé à la fin de la commande. Une publication qui ne contient aucune coordonnée laisse celles du dépôt en place.

## Tableau de bord et statistiques

La vue d’ensemble commence par « À faire » : ce qui attend une action, avec le bouton correspondant. Les repères chiffrés comparent les 30 derniers jours aux 30 jours précédents. La page « Statistiques » du menu détaille l’audience par période, avec export CSV, et traduit les chiffres en conseils courts. Les brouillons, la médiathèque et les comptes ont leurs dialogues ; les actions irréversibles demandent une confirmation.

### Activer la mesure d’audience

Le site public envoie une requête par page vue à `collect.php` du back-office, sans cookie et sans conserver d’adresse IP : chemin, provenance, largeur d’écran et une empreinte de visiteur qui change chaque jour. Le composant est présent dans le site mais **n’envoie rien tant que la variable n’est pas renseignée au build** :

```sh
NEXT_PUBLIC_AUDIENCE_URL=https://admin.groupebaruck.com/collect.php
```

En local, `http://127.0.0.1:8091/collect.php` avec le site sur `http://localhost:3000/`. Le point de collecte n’accepte que l’origine du site configurée dans `site_url` (avec ou sans `www`). Les robots connus sont ignorés. Si le site change de domaine, mettre à jour `site_url`. La mention de cette mesure dans la page de confidentialité du site reste à valider avec le client.

## Choisir, importer et télécharger les images

Dans une actualité comme dans une fiche de boutique, « Choisir ou importer une image » ouvre la bibliothèque : les images initiales du site et les nouveaux imports sont proposés avec leurs aperçus et une recherche. Aucun chemin n’est à saisir pour la couverture ou la galerie. « Importer et utiliser cette image » accepte un fichier JPG, PNG ou WebP de 8 Mo maximum et de 40 mégapixels maximum, accompagné d’une description. Les limites et le type réel du fichier sont également vérifiés sur le serveur.

La sélection conserve le texte dans le formulaire. Les boutons Monter, Descendre et Retirer organisent la galerie, limitée à 30 images dans une actualité et à 6 photos dans une fiche de boutique. Enregistrer le brouillon ou valider reste nécessaire pour conserver ces changements dans l’article. L’import enregistre immédiatement le fichier dans la médiathèque privée, même si l’article n’est pas encore enregistré. Un fichier non référencé par une version validée n’est pas inclus dans l’export public. « Télécharger l’image » dans la médiathèque permet de récupérer le fichier après connexion.

Le sélecteur utilise un script local, sans dépendance supplémentaire. Sans JavaScript, les images déjà enregistrées sont conservées ; leur sélection demande de l’activer. Une erreur d’import laisse le formulaire ouvert. Si la session expire pendant un import, le message demande de copier le texte avant reconnexion et rechargement : il n’y a pas encore de sauvegarde automatique de la frappe.

`backoffice:prepare` copie les images initiales dans `seed-media`, hors de la racine publique. Les aperçus sont servis par un identifiant contrôlé après authentification. Ce dossier fait partie du paquet d’administration ; aucun accès direct à un chemin arbitraire n’est proposé. La recette Chrome vérifie la sélection, le réordonnancement, le retrait et un import réel, sans sauvegarder l’article de recette ni capturer son rendu.

## Local

Prérequis : Node 24 et dépendances npm du projet, Docker pour PHP/MySQL. Aucun nouveau paquet npm ou Composer n’est requis. PHP et MySQL sont des environnements de test locaux ; Docker n’est pas nécessaire sur Bluehost.

```sh
docker build -t baruck-backoffice-php:local backoffice
npm run backoffice:local
```

Ouvrir <http://127.0.0.1:8091/>. La première ouverture permet de créer son compte, avec son propre mot de passe. Cette initialisation web est strictement réservée à `environment=local` et à une origine `127.0.0.1`. Aucun identifiant prédéfini ni connexion de démonstration contournant l’authentification.

Les conteneurs `baruck-admin-web` et `baruck-admin-mysql`, leur réseau et leurs volumes sont réservés à ce projet. MySQL n’expose aucun port hôte. Le serveur HTTP écoute uniquement sur `127.0.0.1:8091`. Les secrets locaux sont aléatoires dans `.local/`, ignorés de Git. Relancer la commande conserve les données. Pour arrêter sans les effacer :

```sh
docker stop baruck-admin-web baruck-admin-mysql
```

## Préparer et installer le paquet

1. Construire avec `npm run backoffice:package`. Le résultat est `backoffice/dist/baruck-backoffice-bluehost.tar.gz`. Il contient les styles compilés, la police, PHP et l’import initial, aucun secret ni stockage local.
2. Dans cPanel, relever le **Document Root de groupebaruck.com**. Les captures de la liste des fichiers ne permettent pas de le déduire. Ne pas remplacer le `public_html` commun : plusieurs sites sont présents sur le compte.
3. Choisir un dossier réservé à Baruck et y extraire `backoffice`. Créer `admin.groupebaruck.com` avec une racine séparée pointant sur **`backoffice/public` uniquement**. Les chemins réels dépendent du compte. Si cPanel impose une racine sous `public_html`, conserver les parties privées dans un dossier non exposé, avec les refus d’accès fournis et vérifiés. [Procédure officielle Bluehost](https://www.bluehost.com/help/article/subdomains/).
4. Activer un certificat pour le sous-domaine. Vérifier PHP **8.2 ou supérieur**, PDO MySQL, fileinfo, session et JSON. Le paquet vise Apache/cPanel ; il n’utilise ni Node en production ni réécriture d’URL. Régler `upload_max_filesize=8M` et `post_max_size=10M` au minimum. Les capacités exactes du compte restent à vérifier dans cPanel. [Environnement Bluehost](https://www.bluehost.com/help/article/bluehost-software-and-program-versions).
5. Créer une base et un utilisateur MySQL dédiés à Baruck. L’utilisateur d’installation a besoin des droits CREATE, SELECT, INSERT, UPDATE et DELETE sur cette base ; retirer CREATE après initialisation si l’exploitation sépare les comptes. Aucun accès aux bases des autres sites.
6. Copier `config.example.php` en `config.local.php`, au même niveau que `src`, hors de `public`. Renseigner la base et les origines finales ; conserver `environment=production`. Le stockage doit être un dossier privé accessible en écriture au processus PHP, jamais à l’intérieur de `public`. Restreindre les permissions du fichier de configuration à son propriétaire.
7. Depuis un terminal privé/SSH, exécuter `php bin/install.php init` depuis le dossier `backoffice`. Créer ensuite le premier administrateur avec `php bin/install.php user`, en fournissant sur l’entrée standard un objet JSON contenant `name`, `email`, `role: "admin"` et `password`. Ne pas placer le mot de passe dans les arguments ou l’historique du terminal. L’installateur n’est pas accessible par HTTP. Si aucun terminal n’est disponible, traiter ce point avec l’accès technique Bluehost avant l’ouverture de l’administration ; ne pas déplacer l’installateur sous `public`.
8. Vérifier connexion, déconnexion, droits d’un rédacteur, upload, export et absence d’accès HTTP aux fichiers `config.local.php`, `seed.json`, `schema.sql`, `src` et `storage`. La configuration de cookie de production exige HTTPS et le nom d’hôte exact. Ne pas ajouter un domaine de cookie partagé avec les autres sous-domaines.

En cas de perte d’un mot de passe : `php bin/install.php reset-password` avec `email` et le nouveau `password` sur l’entrée standard. Cela invalide les sessions existantes. Une désactivation/réactivation d’utilisateur les invalide aussi. Les sessions expirent après 30 minutes d’inactivité ou 8 heures au total. Les nouveaux mots de passe et leurs remplacements exigent 12 caractères visibles minimum, sans troncature (limite technique bcrypt : 72 octets UTF-8). Les anciens mots de passe restent utilisables. Les échecs sont limités sur une fenêtre de quinze minutes : 10 par compte et opération, 50 par adresse IP. Une connexion réussie ne remet pas à zéro le compteur IP partagé. La vérification du mot de passe actuel lors de son remplacement est également limitée.

## Construire une publication du site

L’administrateur valide les articles puis télécharge le JSON dans « Publication ». Ce fichier contient la dernière version validée de chaque actualité, les articles mis en boutique, les coordonnées et les images téléversées qu’ils référencent, pas les comptes ni les modifications privées. Le traitement est une publication complète : seule une action explicite de retrait exclut un article précédemment validé du prochain site construit. Une validation prépare une publication ; elle ne prouve pas une mise en ligne effective.

Dans le projet Next.js :

```sh
NEXT_PUBLIC_SITE_URL=https://groupebaruck.com/ NEXT_PUBLIC_BASE_PATH= npm run backoffice:publish-build -- /chemin/baruck-publication.json --webpack
```

Le script prépare un dossier temporaire, vérifie les chemins, les types d’images et leurs empreintes, lance les validations éditoriales existantes et le build, puis copie les nouvelles images dans `out/`. Il ne modifie ni les articles Markdown suivis par Git ni les photos d’origine. Une erreur interrompt la publication. **Ne transférer `out/` que si la commande termine avec succès.**

Transférer ensuite cet export dans le Document Root exact du site public via le mécanisme de déploiement retenu. Prévoir une sauvegarde et la suppression contrôlée des anciennes pages du seul site Baruck pour rendre les retraits effectifs. Le transfert atomique, le retour arrière et la connexion du bouton de publication à ce transfert constituent l’étape suivante, à configurer avec l’accès Bluehost. Ne jamais synchroniser ce dossier sur la racine commune des autres sites.

Sans `BARUCK_EDITORIAL_ROOT`, le build habituel utilise toujours les fichiers du dépôt. GitHub Pages reste une prévisualisation du code. Une fois Bluehost activé, MySQL devient la source éditoriale : ne pas continuer d’éditer les mêmes articles dans Pages CMS.

## Recette et entretien

```sh
npm run backoffice:test
npm run backoffice:test:mysql
# Facultatif, si Chrome est déjà installé : recette avec soumission HTML native
BARUCK_TEST_CHROME=/usr/bin/google-chrome npm run backoffice:test:mysql
npm test
npm run lint
npm run typecheck
```

La recette MySQL nécessite le démarrage local précédent. Elle crée sa propre base temporaire, un conteneur PHP et des comptes de test, puis les supprime ; elle ne touche pas les comptes de l’installation locale. Elle vérifie les droits, les sessions, CSRF, les conflits, les validations, un upload réel, l’export, les migrations répétées, les révisions et retraits, la récupération de saisie et la limitation des connexions. Un corpus commun confronte les liens Markdown au validateur PHP et au chargeur Next. La validation PHP cible les constructions prises en charge ; le build Next reste le contrôle final, pas une équivalence complète avec un parseur CommonMark. Les images privées sont servies après authentification avec un type MIME contrôlé ; seuls les fichiers inclus dans une publication deviennent publics.

Sauvegarder ensemble MySQL et le dossier `storage/media`, avec une procédure de restauration vérifiée. Les sessions et limites de connexion restent dans le stockage privé. Prévoir les mises à jour de PHP/MySQL et la maintenance du code d’authentification. Le journal garde les actions et leurs auteurs ; la table des révisions conserve séparément le contenu des versions enregistrées depuis cette migration. Les versions précédant la migration ne peuvent pas être reconstituées. L’application est un premier lot éditorial ; la boutique nécessite son propre cadrage métier avant extension.

Le back-office utilise `Referrer-Policy: same-origin` : les formulaires internes conservent leur origine et les liens externes ne transmettent pas de référent. `no-referrer` peut produire `Origin: null` sur un POST HTML natif, qui est rejeté par la protection CSRF. Les origines étrangères ou nulles restent refusées. [Documentation MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy).
