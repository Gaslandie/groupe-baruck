<?php
declare(strict_types=1);

// Copier en config.local.php, hors de la racine publique du sous-domaine.
return [
    'environment' => 'production',
    'origin' => 'https://admin.groupebaruck.com',
    'site_url' => 'https://groupebaruck.com',
    'database' => [
        'dsn' => 'mysql:host=localhost;dbname=CPANEL_baruck;charset=utf8mb4',
        'user' => 'CPANEL_baruck',
        'password' => '',
    ],
    // À n'activer que si PHP n'est joignable qu'à travers un proxy de confiance qui
    // termine TLS et pose X-Forwarded-Proto. Sur Apache/cPanel en direct : laisser absent.
    // 'trusted_proxy' => true,
    'storage' => __DIR__ . '/storage',
    // Envoi par le serveur de l'hébergement. Activer avec une boîte existante
    // @groupebaruck.com ; une valeur vide désactive l'envoi. Aucun mot de passe.
    'contact_mail' => ['from' => '', 'to' => 'jokrasso2@gmail.com'],
    // Les codes utilisent par défaut l’expéditeur contact_mail.from. Le destinataire
    // est toujours l’adresse du compte enregistrée en base, jamais celle du formulaire.
    // Production : conserver « mail ». « file » est réservé aux essais locaux privés.
    // Modifier l’identifiant avec la commande CLI change-email, sans changer les
    // coordonnées publiques ni contact_mail.to. Aucun destinataire de test ici.
    'login_mail' => ['from' => '', 'transport' => 'mail'],
];
