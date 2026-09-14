<?php
declare(strict_types=1);

namespace Baruck;

/**
 * Textes de l'accueil modifiables : intitulé, explication, longueurs maximales
 * du titre et du texte. Les longueurs protègent la mise en page ; le site
 * garde la structure — identifiants, images, dégradés, liens.
 */
function textGroups(): array
{
    return [
        'heroSlides' => ['Diaporama d’accueil', 'Les grands volets qui défilent en haut de la page d’accueil.', 60, 260],
        'activities' => ['Activités du Groupe', 'Les cartes des secteurs d’activité, plus bas sur la page d’accueil.', 40, 130],
    ];
}

function validateTextes(array $input): array
{
    $reference = seed()['textes'];
    $saved = [];
    foreach (textGroups() as $group => [$label, , $titleMax, $textMax]) {
        $rows = is_array($input[$group] ?? null) ? $input[$group] : [];
        // Les entrées viennent du site, jamais du formulaire : rien à ajouter ni à retirer.
        foreach (array_keys($reference[$group]) as $key) {
            $row = is_array($rows[$key] ?? null) ? $rows[$key] : [];
            $title = text($row, 'title', $titleMax * 4);
            $description = text($row, 'description', $textMax * 4);
            if (mb_strlen($title, 'UTF-8') > $titleMax) throw new ValidationError('Un titre de « ' . $label .' » dépasse ' . $titleMax . ' caractères.');
            if (mb_strlen($description, 'UTF-8') > $textMax) throw new ValidationError('Un texte de « ' . $label . ' » dépasse ' . $textMax . ' caractères.');
            $saved[$group][$key] = ['title' => $title, 'description' => $description];
        }
    }
    return $saved;
}

function saveTextes(array $input, array $user): void
{
    saveSetting('textes', validateTextes($input), $input['version'] ?? 0, $user, 'Textes de l’accueil modifiés', 'Page d’accueil');
}
