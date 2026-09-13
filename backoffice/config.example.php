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
];
