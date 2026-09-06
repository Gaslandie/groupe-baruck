<?php
declare(strict_types=1);

namespace Baruck;

/** Même liste de destinations que le chargeur Next. Le build reste le contrôle final. */
function validateDestination(string $destination, bool $image = false, string $alt = ''): void
{
    $destination = html_entity_decode($destination, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    if ($destination === '' || preg_match('/[\x00-\x20\\\\]/', $destination)) throw new ValidationError('Un lien contient un espace ou un caractère non autorisé.');
    if ($image) {
        if (trim($alt) === '') throw new ValidationError('Décrivez chaque image insérée dans le texte.');
        imagePath($destination);
        return;
    }
    if (str_starts_with($destination, '/') && !str_starts_with($destination, '//')) return;
    if (!preg_match('~^(?:https?://|mailto:|tel:|#)~i', $destination)) throw new ValidationError('Un lien utilise une adresse non prise en charge. Utilisez une adresse https://, un chemin /…, une ancre #…, mailto: ou tel:.');
}

function markdownWithoutCode(string $body): string
{
    $result = [];
    $fence = null;
    foreach (explode("\n", str_replace("\r\n", "\n", $body)) as $line) {
        if ($fence !== null) {
            if (preg_match('/^ {0,3}' . preg_quote($fence[0], '/') . '{' . $fence[1] . ',}\s*$/', $line)) $fence = null;
            $result[] = '';
        } elseif (preg_match('/^ {0,3}(`{3,}|~{3,})/', $line, $match)) {
            $fence = [$match[1][0], strlen($match[1])]; $result[] = '';
        } elseif (preg_match('/^(?: {4}|\t)/', $line)) $result[] = '';
        else $result[] = $line;
    }
    return preg_replace('/(`+)(?!`)(.*?)\1(?!`)/s', '', implode("\n", $result));
}

/** Lire une destination Markdown, y compris ses parenthèses équilibrées. */
function markdownDestination(string $source, int $offset): array
{
    $length = strlen($source);
    while ($offset < $length && ctype_space($source[$offset])) $offset++;
    if (($source[$offset] ?? '') === '<') {
        $end = strpos($source, '>', $offset + 1);
        if ($end === false) throw new ValidationError('Un lien possède une adresse incomplète.');
        return [substr($source, $offset + 1, $end - $offset - 1), $end + 1];
    }
    $start = $offset; $depth = 0;
    for (; $offset < $length; $offset++) {
        $char = $source[$offset];
        if ($char === '\\') { $offset++; continue; }
        if ($char === '(') $depth++;
        elseif ($char === ')') { if ($depth === 0) break; $depth--; }
        elseif (ctype_space($char) && $depth === 0) break;
    }
    return [substr($source, $start, $offset - $start), $offset];
}

function validateMarkdown(string $body): void
{
    $source = markdownWithoutCode($body);
    if (preg_match('~(?<!\\\\)<(?:[!?]|/?[a-z][a-z0-9-]*(?:\s|/?>))~i', $source)) throw new ValidationError('Utilisez du texte Markdown sans HTML. Les exemples de code peuvent être placés entre accents graves.');

    // Liens automatiques <https://…> et <nom@example.com>.
    preg_match_all('/<([^<>\r\n]+)>/', $source, $autolinks);
    foreach ($autolinks[1] as $destination) {
        if (filter_var($destination, FILTER_VALIDATE_EMAIL)) continue;
        validateDestination($destination);
    }
    // Définitions de référence : [nom]: /contact/ "Titre".
    $references = [];
    preg_match_all('/^ {0,3}\[([^\]\r\n]+)\]:[ \t]*(.*)$/m', $source, $definitions, PREG_SET_ORDER);
    foreach ($definitions as $definition) {
        [$destination] = markdownDestination($definition[2], 0);
        validateDestination($destination);
        $references[strtolower(trim($definition[1]))] = $destination;
    }

    $length = strlen($source);
    for ($index = 0; $index < $length; $index++) {
        if ($source[$index] === '\\') { $index++; continue; }
        if ($source[$index] !== '[') continue;
        $start = $index + 1; $depth = 1; $end = $start;
        for (; $end < $length; $end++) {
            if ($source[$end] === '\\') { $end++; continue; }
            if ($source[$end] === '[') $depth++;
            elseif ($source[$end] === ']' && --$depth === 0) break;
        }
        if ($depth !== 0) continue;
        $label = substr($source, $start, $end - $start);
        $image = $index > 0 && $source[$index - 1] === '!';
        $next = $end + 1;
        if (($source[$next] ?? '') === '(') {
            [$destination, $after] = markdownDestination($source, $next + 1);
            validateDestination($destination, $image, $label);
            $index = max($end, $after - 1);
        } else {
            $reference = $label;
            if (($source[$next] ?? '') === '[' && ($close = strpos($source, ']', $next + 1)) !== false) {
                $reference = substr($source, $next + 1, $close - $next - 1) ?: $label;
            }
            $destination = $references[strtolower(trim($reference))] ?? null;
            if ($destination !== null) validateDestination($destination, $image, $label);
            $index = $end;
        }
    }
}
