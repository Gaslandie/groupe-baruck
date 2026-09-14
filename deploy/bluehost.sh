#!/usr/bin/env bash
# Déploiement du site public et du back-office sur Bluehost (Apache/cPanel), par SSH.
#
#   npm run deploy -- check                     accès SSH, PHP, rsync, racines des domaines
#   npm run deploy -- setup                     une fois : sous-domaine, base MySQL, config.local.php, AutoSSL
#   npm run deploy -- backoffice                met à jour l'administration puis lance les migrations
#   npm run deploy -- user | reset-password     compte administrateur (mot de passe saisi, jamais en argument)
#   npm run deploy -- site [publication.json]   construit le site (dépôt, ou publication validée) et le met en ligne
#   npm run deploy -- all [publication.json]    check, backoffice, site
#
# Configuration : deploy/bluehost.env (modèle : bluehost.env.example), ignoré par Git.
# Options : --yes (aucune confirmation) ; DRY_RUN=1 affiche les commandes distantes sans les exécuter.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
env_file="$root/deploy/bluehost.env"
command_name="${1:-}"; [[ $# -gt 0 ]] && shift
yes=0; args=()
for arg in "$@"; do case "$arg" in --yes) yes=1;; *) args+=("$arg");; esac; done
dry="${DRY_RUN:-0}"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
note() { printf '  %s\n' "$*"; }
fail() { printf '\n\033[31mErreur : %s\033[0m\n' "$*" >&2; exit 1; }
confirm() {
  [[ $yes == 1 || $dry == 1 ]] && return 0
  local answer; read -r -p "$1 [o/N] " answer
  [[ ${answer,,} == o || ${answer,,} == oui ]] || fail 'Abandon.'
}

# --- Configuration ------------------------------------------------------------
[[ -f $env_file ]] || fail "Configuration absente : copier deploy/bluehost.env.example en deploy/bluehost.env."
set -a; . "$env_file"; set +a
: "${BLUEHOST_SSH:?BLUEHOST_SSH manquant dans deploy/bluehost.env}"
BLUEHOST_PORT="${BLUEHOST_PORT:-22}"
SITE_DOMAIN="${SITE_DOMAIN:-groupebaruck.com}"
ADMIN_DOMAIN="${ADMIN_DOMAIN:-admin.groupebaruck.com}"
ADMIN_DIR="${ADMIN_DIR:-baruck-admin}"
REMOTE_PHP="${REMOTE_PHP:-php}"
SITE_ROOT="${SITE_ROOT:-}"
[[ $ADMIN_DIR == /* || $ADMIN_DIR == *..* || -z $ADMIN_DIR ]] && fail 'ADMIN_DIR doit être un dossier relatif au dossier personnel, sans « .. ».'
admin_label="${ADMIN_DOMAIN%%.*}"

# --- Serveur ------------------------------------------------------------------
# Une seule connexion SSH réutilisée : le mot de passe, s'il y en a un, n'est demandé qu'une fois.
ssh_opts=(-p "$BLUEHOST_PORT" -o ConnectTimeout=25 -o ControlMaster=auto -o ControlPath="${TMPDIR:-/tmp}/baruck-deploy-%C" -o ControlPersist=300)
remote() { # une seule chaîne de commande ; l'entrée standard est transmise
  if [[ $dry == 1 ]]; then note "[dry-run] ssh $BLUEHOST_SSH -- $1" >&2; cat >/dev/null 2>&1 || true; return 0; fi
  ssh "${ssh_opts[@]}" "$BLUEHOST_SSH" "$1"
}
# Le shell doit être ouvert sur le compte (Bluehost : Hosting → Server → SSH Access), sinon rien n'est possible.
require_shell() {
  [[ $dry == 1 ]] && return 0
  local probe; probe="$(remote 'echo baruck-ok' </dev/null 2>&1)" || true
  [[ $probe == *baruck-ok* ]] || fail "Pas de shell sur $BLUEHOST_SSH : $probe"
}
remote_home=''
home_dir() {
  if [[ -z $remote_home ]]; then
    if [[ $dry == 1 ]]; then remote_home='/home/utilisateur'; else remote_home="$(remote 'printf %s "$HOME"' </dev/null)"; fi
    [[ $remote_home == /* ]] || fail "Dossier personnel distant illisible : $remote_home"
  fi
  printf '%s' "$remote_home"
}
admin_root() { printf '%s/%s' "$(home_dir)" "$ADMIN_DIR"; }
remote_file_exists() { [[ $dry == 1 ]] && return 0; remote "test -f '$1'" </dev/null; }

# uapi : API cPanel disponible en SSH. Résultat JSON analysé localement ; échec = erreur.
uapi() {
  [[ $dry == 1 ]] && { remote "uapi --output=json $*" </dev/null; printf '{}'; return 0; }
  remote "uapi --output=json $*" </dev/null | node -e '
    const result = JSON.parse(require("fs").readFileSync(0, "utf8")).result;
    if (!result.status) { console.error((result.errors || ["échec uapi"]).join("\n")); process.exit(1); }
    console.log(JSON.stringify(result.data ?? null));'
}
json_get() { node -e 'const d=JSON.parse(process.argv[1]); const v=process.argv[2].split(".").reduce((o,k)=>o?.[k],d); console.log(v ?? "")' "$1" "$2"; }

http_code() { local code; code="$(curl -s -o /dev/null -m 20 -w '%{http_code}' "$1" 2>/dev/null)" || true; printf '%s' "${code:-000}"; }
tls_works() { curl -s -o /dev/null -m 20 "https://$1/" 2>/dev/null; }

# Racines d'autres domaines du compte situées sous SITE_ROOT : jamais touchées.
protected_roots() {
  local data; data="$(uapi DomainInfo domains_data 'format=hash' 2>/dev/null || echo '{}')"
  node -e '
    const d = JSON.parse(process.argv[1]) || {}; const site = process.argv[2].replace(/\/+$/, "");
    const roots = [d.main_domain, ...(d.addon_domains || []), ...(d.sub_domains || []), ...(d.parked_domains || [])]
      .filter(Boolean).map((x) => x.documentroot).filter(Boolean);
    for (const r of new Set(roots)) if (r !== site && r.startsWith(site + "/")) console.log(r.slice(site.length));' "$data" "$SITE_ROOT"
}

# Copie d'un dossier local vers un dossier distant, en supprimant ce qui n'existe plus localement.
push_dir() { # push_dir source/ destination [exclusions rsync…]
  local source="$1" destination="$2"; shift 2
  if [[ $dry == 1 ]]; then note "[dry-run] rsync -az --delete $* $source → $BLUEHOST_SSH:$destination/"; return 0; fi
  if remote 'command -v rsync >/dev/null' </dev/null; then
    rsync -az --delete --delay-updates "$@" -e "ssh ${ssh_opts[*]}" "$source" "$BLUEHOST_SSH:$destination/"
  else
    note 'rsync absent sur le serveur : copie par tar, sans suppression des anciens fichiers.'
    tar -C "$source" -czf - . | remote "mkdir -p '$destination' && tar -xzf - -C '$destination'"
  fi
}

# --- check --------------------------------------------------------------------
do_check() {
  say "Connexion à $BLUEHOST_SSH (port $BLUEHOST_PORT)"
  local report
  if [[ $dry == 1 ]]; then report='home=/home/utilisateur'; else
    report="$(remote 'printf "home=%s\n" "$HOME"; printf "rsync=%s\n" "$(command -v rsync || echo absent)"; printf "uapi=%s\n" "$(command -v uapi || echo absent)"; printf "php=%s\n" "$('"$REMOTE_PHP"' -r "echo PHP_VERSION;" 2>/dev/null || echo absent)"; printf "extensions=%s\n" "$('"$REMOTE_PHP"' -m 2>/dev/null | grep -i -E "^(pdo_mysql|fileinfo|session|json)$" | tr "\n" " ")"; printf "php_disponibles=%s\n" "$(ls /opt/cpanel/ea-php8*/root/usr/bin/php 2>/dev/null | tr "\n" " ")"' </dev/null)"
  fi
  printf '%s\n' "$report" | sed 's/^/  /'
  local php_version; php_version="$(printf '%s\n' "$report" | sed -n 's/^php=//p')"
  if [[ -n $php_version && ( $php_version == absent || $php_version < 8.2 ) ]]; then
    note "PHP en ligne de commande insuffisant ($php_version) : renseigner REMOTE_PHP avec un binaire 8.2+ listé ci-dessus."
  fi
  say 'Domaines'
  local site_data admin_data
  site_data="$(uapi DomainInfo single_domain_data "domain='$SITE_DOMAIN'" 2>/dev/null || echo '{}')"
  note "Document Root de $SITE_DOMAIN d'après cPanel : $(json_get "$site_data" documentroot)"
  note "SITE_ROOT configuré : ${SITE_ROOT:-(vide : reporter la valeur ci-dessus dans deploy/bluehost.env)}"
  if [[ -n $SITE_ROOT ]]; then
    local protected; protected="$(protected_roots | tr '\n' ' ')"
    [[ -n $protected ]] && note "Racines d'autres domaines sous SITE_ROOT, préservées : $protected"
  fi
  if admin_data="$(uapi DomainInfo single_domain_data "domain='$ADMIN_DOMAIN'" 2>/dev/null)"; then
    note "$ADMIN_DOMAIN existe, racine : $(json_get "$admin_data" documentroot)"
  else
    note "$ADMIN_DOMAIN n'existe pas encore : lancer « npm run deploy -- setup »."
  fi
  local versions; versions="$(uapi LangPHP php_get_vhost_versions 2>/dev/null || echo '[]')"
  node -e 'const v = JSON.parse(process.argv[1]); for (const x of Array.isArray(v) ? v : []) if ([process.argv[2], process.argv[3]].includes(x.vhost)) console.log(`  PHP de ${x.vhost} : ${x.version}`)' "$versions" "$SITE_DOMAIN" "$ADMIN_DOMAIN"
  note "Back-office : $(admin_root) ($(remote_file_exists "$(admin_root)/config.local.php" && echo 'config.local.php présent' || echo 'non configuré, lancer setup'))"
}

# --- setup --------------------------------------------------------------------
do_setup() {
  local app; app="$(admin_root)"
  say "Dossier privé du back-office : $app"
  remote "mkdir -p '$app/public' '$app/storage' && chmod 700 '$app/storage'" </dev/null
  say "Sous-domaine $ADMIN_DOMAIN"
  if [[ $dry != 1 ]] && uapi DomainInfo single_domain_data "domain='$ADMIN_DOMAIN'" >/dev/null 2>&1; then
    note 'Déjà créé.'
  else
    uapi SubDomain addsubdomain "domain='$admin_label'" "rootdomain='$SITE_DOMAIN'" "dir='$ADMIN_DIR/public'" 'disallowdot=1' >/dev/null
    note "Créé, racine $ADMIN_DIR/public."
  fi
  say 'Base MySQL et configuration'
  if [[ $dry != 1 ]] && remote_file_exists "$app/config.local.php"; then
    note 'config.local.php existe déjà : base et identifiants conservés.'
  else
    local prefix name password
    prefix="$(json_get "$(uapi Mysql get_restrictions)" prefix)"
    name="${prefix}baruck"
    password="$(node -e 'console.log(require("crypto").randomBytes(36).toString("base64url").replace(/[^A-Za-z0-9]/g, "").slice(0, 28))')"
    if [[ $dry != 1 ]] && node -e 'process.exit((JSON.parse(process.argv[1]) || []).includes(process.argv[2]) ? 0 : 1)' "$(uapi Mysql list_databases)" "$name"; then
      fail "La base $name existe déjà sans config.local.php : la supprimer dans cPanel, ou écrire config.local.php à la main (INSTALLATION.md)."
    fi
    uapi Mysql create_database "name='$name'" >/dev/null
    uapi Mysql create_user "name='$name'" "password='$password'" >/dev/null
    uapi Mysql set_privileges_on_database "user='$name'" "database='$name'" "privileges='CREATE,ALTER,INDEX,SELECT,INSERT,UPDATE,DELETE'" >/dev/null
    remote "umask 077 && cat > '$app/config.local.php'" <<PHP
<?php
declare(strict_types=1);

// Écrit par deploy/bluehost.sh ; hors de la racine publique du sous-domaine.
return [
    'environment' => 'production',
    'origin' => 'https://$ADMIN_DOMAIN',
    'site_url' => 'https://$SITE_DOMAIN',
    'database' => [
        'dsn' => 'mysql:host=localhost;dbname=$name;charset=utf8mb4',
        'user' => '$name',
        'password' => '$password',
    ],
    'storage' => __DIR__ . '/storage',
];
PHP
    note "Base et utilisateur $name créés ; identifiants écrits dans $app/config.local.php (mode 600)."
  fi
  say 'Certificat'
  if uapi SSL start_autossl_check >/dev/null 2>&1; then note 'Vérification AutoSSL demandée : le certificat du sous-domaine arrive en quelques minutes.'
  else note 'AutoSSL non déclenché ici : activer le certificat du sous-domaine dans cPanel si besoin.'; fi
  say 'Suite : npm run deploy -- backoffice, puis npm run deploy -- user, puis npm run deploy -- site'
}

# --- backoffice ---------------------------------------------------------------
do_backoffice() {
  local app; app="$(admin_root)"
  remote_file_exists "$app/config.local.php" || fail "Pas de config.local.php dans $app : lancer « npm run deploy -- setup » d'abord."
  say 'Paquet du back-office'
  (cd "$root" && npm run --silent backoffice:package)
  staging="$(mktemp -d)"; trap 'rm -rf "${staging:-}"' EXIT
  tar -xzf "$root/backoffice/dist/baruck-backoffice-bluehost.tar.gz" -C "$staging"
  say "Mise à jour de $app"
  push_dir "$staging/backoffice/" "$app" --exclude=config.local.php --exclude=storage/
  say 'Migrations'
  remote "cd '$app' && $REMOTE_PHP bin/install.php init" </dev/null
  say "Contrôle de https://$ADMIN_DOMAIN/"
  [[ $dry == 1 ]] && return 0
  local login collect denied
  login="$(http_code "https://$ADMIN_DOMAIN/")"; collect="$(http_code "https://$ADMIN_DOMAIN/collect.php")"; denied="$(http_code "https://$ADMIN_DOMAIN/.htaccess")"
  note "page de connexion : $login (attendu 200) · collect.php sans origine : $collect (attendu 403) · .htaccess : $denied (attendu 403 ou 404)"
  [[ $login == 200 ]] || note "Le sous-domaine ne répond pas encore en HTTPS : certificat en cours, ou PHP du sous-domaine à passer en 8.2 dans cPanel (MultiPHP)."
}

# --- user / reset-password ----------------------------------------------------
do_user() {
  local mode="$1" app name='' email password again payload
  app="$(admin_root)"
  [[ $mode == user ]] && read -r -p 'Nom affiché : ' name
  read -r -p 'E-mail : ' email
  read -r -s -p 'Mot de passe (12 caractères minimum) : ' password; echo
  read -r -s -p 'Confirmer : ' again; echo
  [[ $password == "$again" ]] || fail 'Les deux saisies diffèrent.'
  payload="$(node -e 'const [m,n,e,p]=process.argv.slice(1); console.log(JSON.stringify(m==="user"?{name:n,email:e,role:"admin",password:p}:{email:e,password:p}))' "$mode" "$name" "$email" "$password")"
  printf '%s' "$payload" | remote "cd '$app' && $REMOTE_PHP bin/install.php $mode"
}

# --- site ---------------------------------------------------------------------
do_site() {
  local publication="${1:-}"
  [[ -n $SITE_ROOT ]] || fail 'SITE_ROOT est vide : lancer « npm run deploy -- check » et reporter le Document Root dans deploy/bluehost.env.'
  [[ $SITE_ROOT == /* && $SITE_ROOT != *..* ]] || fail 'SITE_ROOT doit être un chemin absolu.'
  SITE_ROOT="${SITE_ROOT%/}"
  local home; home="$(home_dir)"
  if [[ $SITE_ROOT == "$home" || $SITE_ROOT == */public_html ]] && [[ ${ALLOW_SHARED_ROOT:-0} != 1 ]]; then
    fail "SITE_ROOT ($SITE_ROOT) ressemble à la racine commune du compte. Si c'est bien le Document Root de $SITE_DOMAIN, relancer avec ALLOW_SHARED_ROOT=1 : les racines des autres domaines y seront préservées."
  fi
  local audience="${AUDIENCE_URL:-https://$ADMIN_DOMAIN/collect.php}"; [[ $audience == off ]] && audience=''
  say "Construction du site pour https://$SITE_DOMAIN/"
  (
    cd "$root"
    export NEXT_PUBLIC_SITE_URL="https://$SITE_DOMAIN/" NEXT_PUBLIC_BASE_PATH='' NEXT_PUBLIC_AUDIENCE_URL="$audience" NEXT_PUBLIC_WEB3FORMS_KEY="${NEXT_PUBLIC_WEB3FORMS_KEY:-}"
    if [[ -n $publication ]]; then
      [[ -f $publication ]] || fail "Publication introuvable : $publication"
      npm run --silent backoffice:publish-build -- "$(realpath "$publication")"
    else
      npm run --silent build
    fi
  )
  say 'Vérification de out/'
  [[ -f $root/out/index.html && -f $root/out/404.html ]] || fail 'Export incomplet (index.html ou 404.html absent).'
  grep -q "https://$SITE_DOMAIN/" "$root/out/sitemap.xml" || fail 'Le sitemap ne porte pas le domaine attendu.'
  if grep -rl 'gaslandie.github.io' "$root/out" >/dev/null; then
    fail "Des pages pointent encore sur la prévisualisation GitHub : $(grep -rl 'gaslandie.github.io' "$root/out" | head -3 | tr '\n' ' ')"
  fi
  local escaped="${SITE_DOMAIN//./\\\\.}"
  sed -e "s/__SITE_DOMAIN_RE__/$escaped/g" -e "s/__SITE_DOMAIN__/$SITE_DOMAIN/g" "$root/deploy/site.htaccess" > "$root/out/.htaccess"
  if ! tls_works "$SITE_DOMAIN"; then
    sed -i '/# >>> https/,/# <<< https/d' "$root/out/.htaccess"
    note "HTTPS ne répond pas encore sur $SITE_DOMAIN : redirection HTTPS omise. Relancer « site » une fois le certificat actif."
  fi
  # Les blocs que cPanel écrit dans le .htaccess du domaine (version PHP, etc.) sont conservés.
  local blocks; blocks="$(remote "cat '$SITE_ROOT/.htaccess' 2>/dev/null || true" </dev/null | sed -n '/BEGIN cPanel-generated/,/END cPanel-generated/p')"
  [[ -n $blocks ]] && { printf '\n%s\n' "$blocks" >> "$root/out/.htaccess"; note 'Blocs cPanel du .htaccess existant conservés.'; }
  note "$(find "$root/out" -type f | wc -l) fichiers, $(du -sh "$root/out" | cut -f1)"
  say "Sauvegarde puis mise en ligne dans $SITE_ROOT"
  local excludes=(--exclude=/.well-known/ --exclude=/cgi-bin/ --exclude=/error_log --exclude=.nojekyll) tar_excludes=() protected
  while IFS= read -r protected; do
    [[ -n $protected ]] || continue
    excludes+=("--exclude=$protected/"); tar_excludes+=("--exclude=.$protected")
    note "Préservé (racine d'un autre domaine) : $SITE_ROOT$protected"
  done < <(protected_roots)
  confirm "Remplacer le contenu de $SITE_ROOT par l'export (les fichiers absents de l'export sont supprimés) ?"
  local stamp; stamp="$(date +%Y%m%d-%H%M%S)"
  remote "mkdir -p '$SITE_ROOT' '$home/baruck-backups' && tar -czf '$home/baruck-backups/site-$stamp.tar.gz' ${tar_excludes[*]:-} -C '$SITE_ROOT' . && ls -t '$home/baruck-backups'/site-*.tar.gz | tail -n +6 | xargs -r rm -f" </dev/null
  note "Sauvegarde : $home/baruck-backups/site-$stamp.tar.gz (les 5 dernières sont gardées)"
  push_dir "$root/out/" "$SITE_ROOT" "${excludes[@]}"
  say 'Contrôle en ligne'
  [[ $dry == 1 ]] && return 0
  local scheme=https; tls_works "$SITE_DOMAIN" || scheme=http
  note "$scheme://$SITE_DOMAIN/ : $(http_code "$scheme://$SITE_DOMAIN/") (attendu 200)"
  note "$scheme://$SITE_DOMAIN/contact/ : $(http_code "$scheme://$SITE_DOMAIN/contact/") (attendu 200)"
  note "$scheme://$SITE_DOMAIN/page-inexistante/ : $(http_code "$scheme://$SITE_DOMAIN/page-inexistante/") (attendu 404)"
  note "$scheme://www.$SITE_DOMAIN/ : $(http_code "$scheme://www.$SITE_DOMAIN/") (attendu 301 si HTTPS actif)"
  local sitemap; sitemap="$(curl -s -m 20 "$scheme://$SITE_DOMAIN/sitemap.xml" 2>/dev/null)" || true
  if [[ $sitemap == *"https://$SITE_DOMAIN/"* ]]; then note 'sitemap.xml : domaine correct'; else note 'sitemap.xml : non lisible'; fi
}

case "$command_name" in
  ''|-h|--help) sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
require_shell
case "$command_name" in
  check) do_check ;;
  setup) do_setup ;;
  backoffice) do_backoffice ;;
  user|reset-password) do_user "$command_name" ;;
  site) do_site "${args[0]:-}" ;;
  all) do_check; do_backoffice; do_site "${args[0]:-}" ;;
  *) sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 1 ;;
esac
