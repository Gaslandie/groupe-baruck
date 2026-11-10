<?php namespace Baruck;
function translationField(string $label, string $name, mixed $value, int $max=500, bool $multiline=false, bool $toolbar=false): void {
    global $inputClass;
    $id='en-' . substr(hash('sha256',$name),0,14);
    echo '<div class="min-w-0"><label for="' . e($id) . '" class="text-caption font-bold">' . e($label) . ' · Anglais</label>';
    if ($toolbar) markdownToolbar($id);
    $attrs=' id="' . e($id) . '" name="' . e($name) . '" lang="en" maxlength="' . $max . '" class="' . $inputClass . ' leading-relaxed"';
    if ($multiline) echo '<textarea rows="' . ($toolbar ? 16 : 3) . '"' . $attrs . '>' . e(is_string($value)?$value:'') . '</textarea>';
    else echo '<input' . $attrs . ' value="' . e(is_string($value)?$value:'') . '">';
    echo '</div>';
}
function markdownToolbar(string $id): void {
    global $secondaryClass;
    echo '<div role="group" aria-label="Mise en forme du contenu" data-markdown-toolbar data-for="' . e($id) . '" class="my-3 flex flex-wrap gap-2">';
    foreach (['heading'=>'Intertitre','bold'=>'Gras','italic'=>'Italique','list'=>'Liste','link'=>'Lien'] as $key=>$label) echo '<button type="button" data-format="' . $key . '" class="' . $secondaryClass . ' min-h-11">' . $label . '</button>';
    echo '</div>';
}
function editorialReview(): void {
    echo '<label class="flex items-start gap-3 text-small leading-relaxed"><input type="checkbox" name="english_reviewed" value="yes" data-english-reviewed class="mt-1"><span>J’ai relu le français et l’anglais, y compris les descriptions et légendes des photos. Les deux versions disent la même chose.</span></label><p data-review-note class="text-caption leading-relaxed text-ink/60">Chaque modification demande une nouvelle relecture. Le brouillon peut rester incomplet.</p>';
}
function editorialPreview(array $source, array $catalog, string $kind): void {
    $groups=[];
    foreach ($source['groups'] ?? [] as $group) {
        $group['photos']=array_map(fn($photo)=>[...$photo,'preview'=>$catalog[$photo['src']]['preview'] ?? ''],$group['photos']);
        if (isset($group['video'])) $group['video']['preview']=$catalog[$group['video']['poster']]['preview'] ?? '';
        $groups[]=$group;
    }
    $dimensions=[]; foreach ($catalog as $item) $dimensions[$item['preview']]=['width'=>$item['width'],'height'=>$item['height']];
    $data=['dimensions'=>$dimensions,'kind'=>$kind,'groups'=>$groups,'catalog'=>array_map(fn($item)=>$item['preview'],$catalog)];
    echo '<script type="application/json" id="editorial-preview-data">' . json_encode($data,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_THROW_ON_ERROR) . '</script>';
?>
<section class="mt-8 min-w-0 rounded-xl border border-line bg-ivory p-5 tablet:p-6" data-editorial-preview>
    <noscript><p class="text-small">Activez JavaScript pour utiliser les boutons de mise en forme et l’aperçu.</p></noscript>
    <details id="editorial-preview" data-groups-title="<?= e($source['groupsTitle'] ?? '') ?>" data-groups-intro="<?= e($source['groupsIntro'] ?? '') ?>"><summary class="cursor-pointer font-display text-title">Aperçu avant validation</summary>
        <p class="mt-3 text-caption leading-relaxed text-ink/60">L’aperçu reprend votre saisie, même non enregistrée. Il ne publie rien.</p>
        <label for="preview-language" class="mt-4 block text-small">Langue de l’aperçu</label><select id="preview-language" class="mt-2 min-h-11 max-w-full rounded-lg border border-line bg-paper p-3 text-body"><option value="fr">Français</option><option value="en">Anglais</option></select>
        <p role="status" data-preview-status class="mt-3 text-caption text-ink/60"></p><article data-preview-output class="mt-5 min-w-0 space-y-5 break-words text-body leading-relaxed"></article>
    </details>
</section>
<dialog id="editorial-link-dialog" aria-labelledby="editorial-link-title" class="w-[min(94vw,580px)] rounded-xl border border-line bg-ivory p-6 text-ink backdrop:bg-ink/70">
    <form method="dialog" class="space-y-5"><h2 id="editorial-link-title" class="font-display text-title">Ajouter un lien</h2><label for="editorial-link-label" class="block text-small">Texte du lien<input id="editorial-link-label" maxlength="500" class="mt-2 w-full rounded-lg border border-line bg-paper p-3" required></label><label for="editorial-link-url" class="block text-small">Adresse<input id="editorial-link-url" maxlength="2000" class="mt-2 w-full rounded-lg border border-line bg-paper p-3" placeholder="/contact/ ou https://…" required></label><p data-link-error role="alert" class="text-caption text-accent"></p><div class="flex flex-wrap gap-3"><button type="submit" class="button button-dark min-h-11">Ajouter le lien</button><button type="button" data-link-cancel class="button button-outline min-h-11">Annuler</button></div></form>
</dialog>
<script type="module" src="/editorial.js"></script>
<?php }
