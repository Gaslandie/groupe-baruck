<?php
namespace Baruck;

$titles = ['dashboard' => 'Vue d’ensemble', 'articles' => 'Actualités', 'edit' => empty($article['id']) ? 'Nouvelle actualité' : 'Modifier l’actualité', 'history' => 'Historique de l’actualité', 'media' => 'Médiathèque', 'users' => 'Équipe & accès', 'account' => 'Mon compte', 'publication' => 'Publication', 'login' => 'Connexion', 'setup' => 'Bienvenue', 'missing' => 'Page introuvable'];
$title = $titles[$page] ?? 'Administration';
$inputClass = 'mt-2 w-full rounded-lg border border-line bg-ivory px-4 py-3 text-sm focus:border-accent';
$buttonClass = 'inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-ivory hover:bg-[#b64820] disabled:opacity-50';
$secondaryClass = 'inline-flex items-center justify-center rounded-lg border border-line px-5 py-3 text-sm font-semibold hover:bg-paper-deep';
function field(string $label, string $name, mixed $value = '', string $type = 'text', string $extra = ''): void {
    global $inputClass;
    echo '<label class="block text-sm font-medium" for="' . e($name) . '">' . e($label) . '</label><input class="' . $inputClass . '" id="' . e($name) . '" name="' . e($name) . '" type="' . e($type) . '" value="' . e(is_scalar($value) ? $value : '') . '" ' . $extra . '>';
}
?>
<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#0b0c0e"><title><?= e($title) ?> — Administration Baruck</title><link rel="stylesheet" href="/admin.css"></head>
<body class="min-h-screen bg-paper text-ink">
<a href="#main" class="sr-only focus:not-sr-only focus:block focus:p-4">Aller au contenu</a>
<?php if (!$user): ?>
<main id="main" class="mx-auto grid min-h-screen max-w-[1400px] items-center gap-12 px-6 py-12 desktop:grid-cols-2 desktop:gap-24 desktop:px-20">
    <div><p class="eyebrow">Groupe Baruck</p><h1 class="font-display text-[clamp(2.8rem,5vw,5rem)] leading-[1.05]">L’espace de votre<br><span class="text-accent">équipe éditoriale.</span></h1><p class="mt-7 max-w-[410px] text-base leading-relaxed text-ink/65">Préparez les actualités, organisez les images et faites vivre les contenus du Groupe.</p><p class="mt-12 text-xs uppercase tracking-[.18em] text-ink/50">Vision · Excellence · Impact</p></div>
    <section class="rounded-2xl border border-line bg-ivory p-7 shadow-sm tablet:p-10" aria-labelledby="login-title">
        <p class="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-accent"><?= $setup ? 'Première ouverture locale' : 'Administration' ?></p>
        <h2 id="login-title" class="font-display text-3xl"><?= $setup ? 'Créez votre compte' : 'Ravi de vous retrouver' ?></h2>
        <p class="mt-3 text-sm leading-relaxed text-ink/60"><?= $setup ? 'Choisissez les identifiants de votre compte administrateur pour cette installation locale.' : 'Connectez-vous avec votre compte Baruck.' ?></p>
        <?php if (isset($_SESSION['recovery'])): ?><p role="status" class="mt-6 rounded-lg bg-paper p-4 text-sm">Votre session a expiré. Reconnectez-vous avec le même compte pour retrouver votre saisie. Elle reste disponible pendant une heure.</p><?php endif; ?>
        <?php if ($error): ?><p role="alert" class="mt-6 rounded-lg border border-[#b64820]/30 bg-[#b64820]/10 p-4 text-sm"><?= e($error) ?></p><?php endif; ?>
        <form method="post" class="mt-7 space-y-5"><?= csrfField() ?><input type="hidden" name="action" value="<?= $setup ? 'setup' : 'login' ?>">
            <?php if ($setup): ?><div><?php field('Votre nom', 'name', $_POST['name'] ?? '', 'text', 'required maxlength="100" autocomplete="name"'); ?></div><?php endif; ?>
            <div><?php field('Adresse e-mail', 'email', $_POST['email'] ?? '', 'email', 'required maxlength="190" autocomplete="username"'); ?></div>
            <div><?php field('Mot de passe', 'password', '', 'password', 'required ' . ($setup ? 'minlength="12" maxlength="72" autocomplete="new-password"' : 'autocomplete="current-password"')); ?><?php if ($setup): ?><p class="mt-2 text-xs text-ink/60">Au moins 12 caractères. Une phrase de plusieurs mots convient.</p><?php endif; ?></div>
            <button class="<?= $buttonClass ?> w-full" type="submit"><?= $setup ? 'Créer mon compte et entrer' : 'Se connecter' ?> <span aria-hidden="true" class="ml-3">→</span></button>
        </form>
        <?php if (!$setup): ?><p class="mt-6 text-xs leading-relaxed text-ink/60">En cas de mot de passe oublié, contactez la personne qui gère les accès au site.</p><?php endif; ?>
    </section>
</main>
<?php else: ?>
<div class="desktop:grid desktop:min-h-screen desktop:grid-cols-[250px_1fr]">
    <aside class="bg-ink px-6 py-7 text-ivory desktop:sticky desktop:top-0 desktop:h-screen desktop:px-7">
        <a href="/" class="font-display text-3xl">Baruck<span class="text-accent">.</span></a><p class="mt-2 text-[10px] uppercase tracking-[.22em] text-ivory/45">Administration</p>
        <nav aria-label="Administration" class="mt-9 flex flex-wrap gap-2 desktop:flex-col">
        <?php foreach (['dashboard' => 'Vue d’ensemble', 'articles' => 'Actualités', 'media' => 'Médiathèque', 'publication' => 'Publication', 'users' => 'Équipe & accès', 'account' => 'Mon compte'] as $key => $label): if (in_array($key, ['publication', 'users'], true) && $user['role'] !== 'admin') continue; $active = $page === $key || (in_array($page, ['edit', 'history'], true) && $key === 'articles'); ?>
            <a href="<?= e(url($key)) ?>" <?= $active ? 'aria-current="page"' : '' ?> class="rounded-lg px-4 py-3 text-sm <?= $active ? 'bg-ivory/10 text-ivory' : 'text-ivory/60 hover:bg-ivory/5 hover:text-ivory' ?>"><?= e($label) ?></a>
        <?php endforeach; ?>
        </nav>
        <div class="mt-8 border-t border-ivory/15 pt-6 desktop:absolute desktop:bottom-7 desktop:left-7 desktop:right-7"><p class="text-sm font-semibold"><?= e($user['name']) ?></p><p class="mt-1 text-xs text-ivory/50"><?= $user['role'] === 'admin' ? 'Administrateur' : 'Rédacteur' ?></p><form method="post" class="mt-4"><?= csrfField() ?><input type="hidden" name="action" value="logout"><button class="text-xs text-ivory/65 underline underline-offset-4" type="submit">Se déconnecter</button></form></div>
    </aside>
    <main id="main" class="min-w-0 px-5 py-8 tablet:px-10 desktop:px-12 desktop:py-10">
        <header class="mb-9 flex flex-wrap items-start justify-between gap-4"><div><p class="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-ink/50">Espace éditorial <?= config()['environment'] === 'local' ? '· Local' : '' ?></p><h1 class="font-display text-[clamp(2rem,3vw,2.75rem)]"><?= e($title) ?></h1></div><a href="<?= e(config()['site_url']) ?>" target="_blank" rel="noreferrer" class="<?= $secondaryClass ?>">Voir le site <span aria-hidden="true" class="ml-3">↗</span></a></header>
        <?php if ($flash): ?><p role="status" class="mb-6 rounded-lg border border-[#087a3e]/25 bg-[#087a3e]/10 p-4 text-sm"><?= e($flash) ?></p><?php endif; ?>
        <?php if ($error): ?><p role="alert" class="mb-6 rounded-lg border border-[#b64820]/30 bg-[#b64820]/10 p-4 text-sm"><?= e($error) ?></p><?php endif; ?>
        <?php require __DIR__ . '/content.php'; ?>
    </main>
</div>
<?php endif; ?>
</body></html>
