<?php
declare(strict_types=1);

namespace Baruck;

final class ContactError extends \RuntimeException {}

/** Adresse unique, jamais fournie par le navigateur : aucun relais vers un tiers. */
function contactMailbox(mixed $value): string
{
    if (!is_string($value) || strlen($value) > 190 || preg_match('/[\r\n\x00-\x20\x7f]/', $value)
        || !filter_var($value, FILTER_VALIDATE_EMAIL)) throw new ContactError('Adresse invalide.', 422);
    return $value;
}

/** Cinq tentatives par adresse réseau et cent au total par heure, sous verrou. */
function contactLimit(string $ip, int $time): void
{
    if (!filter_var($ip, FILTER_VALIDATE_IP)) throw new ContactError('Origine invalide.', 403);
    $directory = config()['storage'] . '/contact';
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) throw new \RuntimeException('Stockage indisponible.');
    $file = $directory . '/limits.json';
    $lock = fopen($file, 'c+');
    if (!$lock) throw new \RuntimeException('Compteur indisponible.');
    try {
        if (!chmod($file, 0600) || !flock($lock, LOCK_EX)) throw new \RuntimeException('Compteur indisponible.');
        $raw = stream_get_contents($lock);
        $events = $raw === '' ? [] : json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
        if (!is_array($events)) throw new \RuntimeException('Compteur invalide.');
        $events = array_values(array_filter($events, fn($event) => is_array($event) && ($event['time'] ?? 0) > $time - 3600));
        $identity = hash('sha256', $ip);
        if (count($events) >= 100 || count(array_filter($events, fn($event) => ($event['ip'] ?? '') === $identity)) >= 5) {
            throw new ContactError('Trop de tentatives. Réessayez plus tard.', 429);
        }
        $events[] = ['ip' => $identity, 'time' => $time];
        $encoded = json_encode($events, JSON_THROW_ON_ERROR);
        rewind($lock);
        if (!ftruncate($lock, 0) || fwrite($lock, $encoded) !== strlen($encoded) || !fflush($lock)) throw new \RuntimeException('Compteur indisponible.');
    } finally { flock($lock, LOCK_UN); fclose($lock); }
}

/** Aucun message ni adresse e-mail de visiteur n'est enregistré dans le site. */
function sendContact(array $input, array $server): void
{
    $settings = config()['contact_mail'] ?? [];
    if (empty($settings['from'])) throw new ContactError('Envoi indisponible.', 503);
    $from = contactMailbox($settings['from']);
    $to = contactMailbox($settings['to'] ?? 'jokrasso2@gmail.com');
    // Paramètre de l'enveloppe strictement limité, sans donnée du visiteur.
    if (!preg_match('/^[a-zA-Z0-9._+-]+@groupebaruck\.com$/D', $from)) throw new ContactError('Envoi indisponible.', 503);
    if (array_diff(array_keys($input), ['name', 'email', 'phone', 'objet', 'message', 'botcheck'])) throw new ContactError('Champs invalides.', 422);
    if (($input['botcheck'] ?? false) !== false) throw new ContactError('Envoi refusé.', 422);
    $values = [];
    foreach (['name' => 120, 'email' => 190, 'phone' => 40, 'objet' => 80, 'message' => 5000] as $field => $max) {
        $value = $input[$field] ?? '';
        if (!is_string($value) || preg_match('//u', $value) !== 1 || preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/', $value)
            || preg_match_all('/./us', $value) > $max || ($field !== 'message' && preg_match('/[\r\n]/', $value))) {
            throw new ContactError('Champ invalide.', 422);
        }
        $values[$field] = trim($value);
    }
    if ($values['name'] === '' || preg_match_all('/./us', $values['message']) < 20) throw new ContactError('Champs incomplets.', 422);
    $email = contactMailbox($values['email']);
    $subjects = ['Studio photo', 'Photography studio', 'Hôtesses événementielles', 'Event hostesses', 'JECA', 'Espoir de Vie',
        'Partenariat ou collaboration', 'Partnership or collaboration', 'Autre demande', 'Other enquiry'];
    if (!in_array($values['objet'], $subjects, true)) throw new ContactError('Objet invalide.', 422);
    contactLimit($server['REMOTE_ADDR'] ?? '', time());
    $reference = bin2hex(random_bytes(8));
    $subject = 'Site Groupe Baruck - Nouveau message';
    $body = "Demande reçue depuis le site Groupe Baruck\nRéférence : $reference\n\n"
        . "Nom : {$values['name']}\nE-mail : $email\nTéléphone ou WhatsApp : {$values['phone']}\nObjet : {$values['objet']}\n\n{$values['message']}\n";
    $headers = ['From' => 'Groupe Baruck <' . $from . '>', 'Reply-To' => $email, 'MIME-Version' => '1.0',
        'Content-Type' => 'text/plain; charset=UTF-8', 'Content-Transfer-Encoding' => 'quoted-printable'];
    if (!mail($to, $subject, quoted_printable_encode(str_replace(["\r\n", "\r", "\n"], ["\n", "\n", "\r\n"], $body)), $headers, '-f' . $from)) {
        throw new ContactError('Envoi indisponible.', 503);
    }
}
