<?php
declare(strict_types=1);
namespace Baruck;

/** La structure anglaise porte seulement des textes, jamais des chemins de médias. */
function englishProjection(array $source, string $kind): array
{
    $photo = fn($value) => ['alt'=>$value['alt'] ?? '', 'caption'=>$value['caption'] ?? ''];
    if ($kind === 'product') return ['name'=>$source['name'] ?? '', 'images'=>array_map(fn($value)=>['alt'=>$value['alt'] ?? ''], $source['images'] ?? [])];
    return ['title'=>$source['title'] ?? '', 'excerpt'=>$source['excerpt'] ?? '', 'body'=>$source['body'] ?? '', 'coverAlt'=>$source['coverAlt'] ?? $source['cover_alt'] ?? '',
        'gallery'=>array_map($photo,$source['gallery'] ?? []), 'groupsTitle'=>$source['groupsTitle'] ?? '', 'groupsIntro'=>$source['groupsIntro'] ?? '',
        'groups'=>array_map(fn($group)=>['label'=>$group['label'],'note'=>$group['note'] ?? '','photos'=>array_map($photo,$group['photos'])],$source['groups'] ?? [])];
}

function initialEnglish(array $source, string $kind): array
{
    if (isset($source['translations']['en']) && is_array($source['translations']['en'])) return $source['translations']['en'];
    $translate = function ($value, string $key = '') use (&$translate) {
        if (is_array($value)) { $result=[]; foreach ($value as $k=>$item) $result[$k]=$translate($item,is_string($k)?$k:$key); return $result; }
        if ($value === '') return '';
        $one = fn($text) => seed()['english'][trim((string)preg_replace('/\s+/u',' ',$text))] ?? '';
        if ($key !== 'body') return $one($value);
        $blocks = preg_split('/(\n\s*\n)/',trim($value),-1,PREG_SPLIT_DELIM_CAPTURE);
        foreach ($blocks as &$block) {
            if (trim($block)==='') continue;
            $prefix=''; if (preg_match('/^(#{1,6} )(.+)$/u',$block,$m)) { $prefix=$m[1]; $block=$m[2]; }
            $block=$one($block); if ($block==='') return '';
            $block=$prefix.$block;
        }
        return implode('',$blocks);
    };
    return $translate(englishProjection($source,$kind));
}

function englishInput(array $input): ?array
{
    if (isset($input['english_json'])) {
        if (isset($input['english']) || !is_string($input['english_json']) || strlen($input['english_json'])>800000) throw new ValidationError('Traduction trop grande ou invalide.');
        try { $value=json_decode($input['english_json'],true,32,JSON_THROW_ON_ERROR); }
        catch (\JsonException $e) { throw new ValidationError('La traduction est incomplète. Rechargez le formulaire.'); }
    } else $value=$input['english'] ?? null;
    if ($value!==null && !is_array($value)) throw new ValidationError('Traduction invalide.');
    return $value;
}

function validateEnglish(array $source, mixed $input, string $kind, bool $ready): array
{
    $visit = function ($original,$value,string $key='') use (&$visit,$ready) {
        if (is_string($original)) {
            $max=match($key){'body'=>200000,'excerpt','groupsIntro'=>2000,'name'=>160,'title','groupsTitle'=>240,default=>500};
            $label=match($key){'title'=>'Titre anglais','name'=>'Nom anglais','excerpt'=>'Résumé anglais','body'=>'Contenu anglais','coverAlt','alt'=>'Description anglaise de la photo','caption'=>'Légende anglaise','groupsTitle'=>'Titre anglais des groupes','groupsIntro'=>'Présentation anglaise des groupes','label'=>'Intitulé anglais','note'=>'Précision anglaise',default=>'Texte anglais'};
            $result=text([$label=>$value],$label,$max,$ready && trim($original)!=='');
            if ($key==='body') validateMarkdown($result);
            elseif (preg_match('~</?[a-z][^>]*>~iu',$result)) throw new ValidationError('La traduction doit contenir du texte sans HTML.');
            if ($ready && (bool)trim($original)!==(bool)$result) throw new ValidationError('Les champs français et anglais doivent être complets et correspondre.');
            return $result;
        }
        if (is_array($value)) foreach ($original as $name=>$item) if ($item===[] && !array_key_exists($name,$value)) $value[$name]=[];
        if (!is_array($value) || count($value)!==count($original) || array_diff_key($value,$original)) throw new ValidationError('Les textes anglais ne correspondent plus aux médias. Rechargez le formulaire.');
        $result=[]; foreach ($original as $name=>$item) $result[$name]=$visit($item,$value[$name] ?? null,is_string($name)?$name:$key); return $result;
    };
    return $visit(englishProjection($source,$kind),$input);
}

function confirmEnglish(array $input, bool $ready): void
{
    if ($ready && ($input['english_reviewed'] ?? '')!=='yes') throw new ValidationError('Relisez le français et l’anglais puis confirmez la relecture avant de valider.');
}

/** Récupérer seulement les textes du formulaire, sans mot de passe ni clé inconnue. */
function recoverEnglishTexts(array $source): array
{
    $pick = fn(array $item, string $key) => is_string($item[$key] ?? null) ? $item[$key] : '';
    $photos = function ($items, int $max) use ($pick): array {
        if (!is_array($items) || count($items)>$max) throw new ValidationError('Galerie de récupération invalide.');
        return array_map(function ($item) use ($pick) {
            if (!is_array($item)) throw new ValidationError('Photo de récupération invalide.');
            return ['alt'=>$pick($item,'alt'),'caption'=>$pick($item,'caption')];
        },array_values($items));
    };
    $result=[];
    foreach (['title','excerpt','body','coverAlt','groupsTitle','groupsIntro'] as $key) $result[$key]=$pick($source,$key);
    $result['gallery']=$photos($source['gallery'] ?? [],30);
    $groups=$source['groups'] ?? [];
    if (!is_array($groups) || count($groups)>30) throw new ValidationError('Groupes de récupération invalides.');
    $result['groups']=array_map(function ($group) use ($photos,$pick) {
        if (!is_array($group)) throw new ValidationError('Groupe de récupération invalide.');
        return ['label'=>$pick($group,'label'),'note'=>$pick($group,'note'),'photos'=>$photos($group['photos'] ?? [],200)];
    },array_values($groups));
    return $result;
}

/** Relecture des droits réels et verrou des médias avant toute écriture éditoriale. */
function requireEditorialActor(array $user, bool $admin): void
{
    $actor=query('SELECT role,active,session_version FROM users WHERE id=? FOR UPDATE',[$user['id']])->fetch();
    if (!$actor || !$actor['active'] || (int)$actor['session_version']!==(int)$user['session_version'] || ($admin && $actor['role']!=='admin')) { http_response_code(403); exit('Vos accès ont changé. Reconnectez-vous.'); }
    query('SELECT id FROM media ORDER BY id FOR UPDATE')->fetchAll();
}
