<?php
declare(strict_types=1);

namespace Baruck;

/** Lignes de contact du site : nomenclature fixe, seules les valeurs se modifient. */
function contactLines(): array
{
    return [
        'landline' => ['Téléphone fixe du siège', 'phone'],
        'mobile' => ['Téléphone mobile', 'phone'],
        'whatsappHq' => ['WhatsApp du siège', 'phone'],
        'whatsappCeo' => ['WhatsApp du PDG', 'phone'],
        'email' => ['Adresse e-mail', 'email'],
    ];
}

function validatePhone(string $value, string $label): string
{
    if (!preg_match('/^\+[0-9][0-9 ]{7,23}$/D', $value)) {
        throw new ValidationError('« ' . $label . ' » doit commencer par l’indicatif international, par exemple +224 623 72 04 27.');
    }
    return $value;
}

function validateCoordonnees(array $input): array
{
    $contacts = [];
    $lines = is_array($input['contacts'] ?? null) ? $input['contacts'] : [];
    foreach (contactLines() as $key => [$label, $type]) {
        $value = text($lines, $key, 40);
        if ($type === 'phone') $contacts[$key] = validatePhone($value, $label);
        else {
            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) throw new ValidationError('Saisissez une adresse e-mail complète et valide, par exemple nom@exemple.com.');
            $contacts[$key] = $value;
        }
    }

    $hours = [];
    foreach (is_array($input['hours'] ?? null) ? $input['hours'] : [] as $row) {
        if (!is_array($row)) continue;
        $days = text($row, 'days', 60, false);
        $value = text($row, 'hours', 60, false);
        // Une ligne vidée est une ligne retirée : rien à confirmer.
        if ($days === '' && $value === '') continue;
        if ($days === '' || $value === '') throw new ValidationError('Chaque horaire demande des jours et une plage horaire, ou une ligne entièrement vide.');
        $hours[] = ['days' => $days, 'hours' => $value];
    }
    if (count($hours) > 7) throw new ValidationError('Sept lignes d’horaires au maximum.');
    if (!$hours) throw new ValidationError('Indiquez au moins une ligne d’horaires.');

    $pages = [];
    foreach (is_array($input['facebook'] ?? null) ? $input['facebook'] : [] as $row) {
        if (!is_array($row)) continue;
        $country = text($row, 'country', 60, false);
        $href = text($row, 'href', 300, false);
        if ($country === '' && $href === '') continue;
        if ($country === '' || $href === '') throw new ValidationError('Chaque page Facebook demande un pays et un lien, ou une ligne entièrement vide.');
        $host = parse_url($href, PHP_URL_HOST);
        if (!str_starts_with($href, 'https://') || !is_string($host) || ($host !== 'facebook.com' && !str_ends_with($host, '.facebook.com'))) {
            throw new ValidationError('Un lien de page doit être une adresse https de facebook.com.');
        }
        $pages[] = ['country' => $country, 'href' => $href];
    }
    if (count($pages) > 10) throw new ValidationError('Dix pages Facebook au maximum.');

    return [
        'contacts' => $contacts,
        'address' => text($input, 'address', 300),
        'hours' => $hours,
        'facebookPages' => $pages,
        'mapQuery' => text($input, 'mapQuery', 200),
    ];
}

function saveCoordonnees(array $input, array $user): void
{
    $data = validateCoordonnees($input);
    saveSetting('coordonnees', $data, $input['version'] ?? 0, $user, 'Coordonnées modifiées', $data['contacts']['whatsappHq']);
}
