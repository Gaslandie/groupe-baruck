# Administration Baruck sur Bluehost

Cette application PHP est distincte de l’export public Next.js. Elle gère les comptes, les actualités et les images dans MySQL et un stockage privé. Aucun compte GitHub n’est nécessaire à ses utilisateurs. Le sous-domaine prévu est `admin.groupebaruck.com` ; il n’est pas créé par le paquet.

## État et limites de ce lot

**Travail exclusivement local pour le moment.** Les procédures Bluehost ci-dessous sont conservées pour plus tard ; aucun déploiement ne doit être déclenché dans cette étape.

Le back-office fonctionne localement avec une vraie base MySQL. Les six actualités du dépôt servent d’import initial, sans écrasement lors d’une réinstallation. Les contenus validés peuvent être exportés puis construire le site existant, avec ses URL, son sitemap et son RSS. **Le déploiement Bluehost et le déclenchement automatique de publication ne sont pas raccordés.** Le bouton de téléchargement le dit explicitement.

L’édition du corps utilise Markdown ; l’éditeur visuel, le sélecteur de médias intégré, l’aperçu avant validation, la publication planifiée et la réinitialisation par e-mail restent à réaliser. Les articles et médias n’ont pas de suppression définitive dans l’interface.

Chaque enregistrement conserve une révision complète. « Historique et restauration » affiche les 50 versions les plus récentes ; les versions antérieures restent en base. Une restauration crée un nouveau brouillon, avec contrôle des modifications concurrentes. Le rédacteur peut retravailler un article validé : **la dernière version validée reste disponible pour l’export** jusqu’à une nouvelle validation par un administrateur. Le retrait de la prochaine publication est une action distincte, réservée à l’administrateur et soumise à confirmation.

Si la session expire au moment d’envoyer le formulaire d’article, une saisie munie du jeton valide de cette session peut être récupérée pendant une heure après reconnexion au même compte. Elle reste à relire et à enregistrer ; une modification concurrente bloque son écrasement. Cela suppose que la session existe encore côté serveur. Ce mécanisme ne sauvegarde pas automatiquement la frappe et ne couvre pas la fermeture d’un onglet avant envoi ou la disparition du fichier de session. Un autre compte ne peut pas récupérer cette saisie.

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

L’administrateur valide les articles puis télécharge le JSON dans « Publication ». Ce fichier contient la dernière version validée de chaque article et les images téléversées qu’elle référence, pas les comptes ni les modifications privées. Le traitement est une publication complète : seule une action explicite de retrait exclut un article précédemment validé du prochain site construit. Une validation prépare une publication ; elle ne prouve pas une mise en ligne effective.

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
