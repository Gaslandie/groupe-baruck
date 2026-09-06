<?php namespace Baruck; ?>
<dialog id="media-dialog" aria-labelledby="media-dialog-title" class="fixed inset-0 m-auto max-h-[90dvh] w-[min(940px,94vw)] overflow-auto rounded-xl border border-line bg-paper p-6 text-ink backdrop:bg-ink/60">
    <div class="flex items-center justify-between gap-4"><h2 id="media-dialog-title" class="font-display text-title">Choisir une image</h2><button type="button" data-media-close class="<?= $secondaryClass ?>">Fermer</button></div>
    <p class="mt-3 text-caption text-ink/60">Sélectionnez une photo existante ou importez un fichier. Votre texte reste dans l’article.</p>
    <form id="media-upload-form" class="mt-5 space-y-4 rounded-lg border border-line bg-ivory p-5">
        <h3 class="font-display text-title">Importer depuis mon ordinateur</h3>
        <div><label for="picker-file" class="text-caption font-medium">Fichier image</label><input id="picker-file" name="image" type="file" accept="image/jpeg,image/png,image/webp" required class="<?= $inputClass ?>"><p class="mt-2 text-caption text-ink/60">JPG, PNG ou WebP · 8 Mo maximum · 40 mégapixels maximum.</p></div>
        <div><label for="picker-alt" class="text-caption font-medium">Description de la photo</label><input id="picker-alt" name="alt" required maxlength="500" class="<?= $inputClass ?>"></div>
        <button type="submit" class="<?= $buttonClass ?>">Importer et utiliser cette image</button>
    </form>
    <p id="media-picker-status" role="status" aria-live="polite" class="mt-4 text-caption"></p>
    <div class="mt-6"><label for="picker-search" class="text-caption font-medium">Rechercher dans les images disponibles</label><input id="picker-search" type="search" class="<?= $inputClass ?>"></div>
    <div id="media-picker-grid" class="mt-5 grid gap-4 tablet:grid-cols-2 wide:grid-cols-3"></div>
</dialog>
