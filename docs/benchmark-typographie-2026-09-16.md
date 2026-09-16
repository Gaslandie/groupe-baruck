# Benchmark typographie — 2026-09-16

Objectif : remplacer la police des titres du site. Jusqu'ici `--font-display`
valait `Georgia, "Times New Roman", serif`, c'est-à-dire **aucune police
livrée** : chaque appareil affichait celle qu'il avait sous la main.

## Ce qui a été relevé (16 septembre 2026)

Relevé par `curl` sur les pages d'accueil, en cherchant les `font-family` et les
fichiers `.woff2` dans le HTML et les feuilles de style servies.

| Site | Accès | Police des titres relevée |
| --- | --- | --- |
| Heirs Holdings (holding, Nigeria) | 200 | `Mulish` (Google Fonts), sans-serif, aucune police de titre distincte |
| Dangote (groupe, Nigeria) | 200 | `Montserrat` + `Abhaya Libre`, `Roboto`, `Open Sans` (Google Fonts) |
| Richemont (luxe, Suisse) | 200 | police **sur mesure**, `.woff2` au nom illisible, non licenciable |
| LVMH (luxe, France) | 200 | page rendue côté client, aucune `font-family` exploitable dans le HTML |
| Teyliom Group (groupe, Sénégal) | échec (connexion refusée) | non relevé |
| Guicopres (groupe, Guinée) | échec (connexion refusée) | non relevé |
| Kering (luxe, France) | échec (connexion refusée) | non relevé |

Les accès en échec le sont restés avec un en-tête de navigateur complet ; rien
n'a été deviné à leur sujet.

## Ce qu'on en retient

1. Les groupes africains comparables se contentent d'une Google Font
   sans-serif. Personne n'y travaille la police de titre : c'est un terrain
   libre pour se distinguer.
2. Les groupes de luxe, eux, paient une police dessinée pour eux. Hors budget,
   et impossible à copier — mais cela confirme que le caractère du site passe
   par la police des titres.
3. Conclusion pour Baruck : une police de titre **auto-hébergée, sous licence
   libre**, distincte de l'Inter du texte courant.

## Comparaison des candidates (fichier latin, Google Fonts, 16/09/2026)

| Police | Poids du fichier | Ce qui joue pour | Ce qui joue contre |
| --- | --- | --- | --- |
| **Fraunces** (retenue) | 66 Ko + 80 Ko d'italique | variable, axe `opsz` : contraste fort dans les grands titres, dessin plus solide dans les petits ; chaleureuse, un caractère qui ne ressemble pas aux concurrents | italique à charger en plus (le site s'en sert dans les titres) |
| Playfair Display | 38 Ko | classique, très lisible | très répandue ; ses déliés fins cassent sur écran clair |
| Newsreader | 129 Ko | bon rendu éditorial | la plus lourde, et moins marquée |
| Instrument Serif | 22 Ko | très légère, très élégante | un seul graissage, trop fine pour les petits titres |

Couverture vérifiée du sous-ensemble latin retenu : `U+0000-00FF`,
`U+0152-0153` (Œ, œ) et `U+2000-206F` (apostrophe typographique). Tous les
accents français sont couverts.

## Ce qui a été appliqué

- `src/app/fonts/fraunces-latin.woff2` et `fraunces-latin-italic.woff2`,
  chargées par `next/font/local` dans `src/app/layout.tsx` (variable
  `--font-fraunces`), comme Inter.
- `--font-display: var(--font-fraunces), Georgia, "Times New Roman", serif` dans
  `globals.css` : Georgia ne sert plus que de secours pendant le chargement.
- Inter n'a pas changé : le texte courant reste identique.
- Licence : SIL Open Font License 1.1 (usage web autorisé, y compris
  commercial). Source : Google Fonts, famille Fraunces v38.

## Ce qui reste à trancher

- Fraunces a deux axes de fantaisie (`SOFT`, `WONK`) non demandés ici : le
  fichier livré est la version sage. On peut les activer si Mohamed veut un
  dessin plus marqué.
- Vérifier le rendu sur iPhone et sur un écran Windows : c'est justement ce que
  Georgia ne garantissait pas.
