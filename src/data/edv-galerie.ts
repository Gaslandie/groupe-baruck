import type { ImageAsset } from "./media";

export type EdvGalleryCategory = {
  /** Ancre et clé de l'onglet. */
  id: string;
  /** Libellé court, dans les onglets. */
  label: string;
  /** Titre de la galerie une fois l'onglet ouvert. */
  title: string;
  place: string;
  /** Date affichée seulement quand elle est confirmée par le client. */
  date?: string;
  text: string;
  photos: ImageAsset[];
};

/**
 * Galeries d'Espoir de Vie, par action (2026-09-18).
 *
 * Les photos viennent du dossier d'origine du client
 * (« HISTORIQUE DE LA FONDATION JOEL KRASSO ORPHELINAT »), un sous-dossier par
 * action. Sur 237 fichiers, 136 sont retenus : les montages carrés 3543 × 3543
 * avec du texte incrusté sont écartés (illisibles en vignette), ainsi que les
 * rafales quasi identiques et les prises floues ou très sombres. Chaque photo
 * est convertie en WebP, largeur maximale 1200 px.
 *
 * Ce fichier est écrit à la main pour les textes et engendré pour la liste des
 * fichiers : ne pas renuméroter les images sans refaire les deux.
 *
 * Deux formulations volontairement prudentes, arrêtées avec Mohamed le
 * 2026-09-18 : le repas partagé est daté du seul mois (« mars 2017 »), parce que
 * le dossier du client dit le 11 et la frise de l'orphelinat le 04 ; et le
 * soutien aux veuves nomme les deux villages, le dossier disant Zaroko et le
 * montage qu'il contient Divo, sans affirmer de lien entre les deux.
 */
export const edvGalleryCategories: EdvGalleryCategory[] = [
  {
    id: "groh-jouets",
    label: "Grôh",
    title: "Mille jouets pour les enfants de Grôh",
    place: "Grôh · Département d’Hiré · Côte d’Ivoire",
    date: "23 décembre 2015",
    text: "Un arbre de Noël dressé au village, mille jouets remis aux enfants et un moment de partage avec les familles.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/groh-jouets/01.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/02.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/03.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/04.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/05.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/06.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/07.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/08.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/09.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/groh-jouets/10.webp", alt: "Remise de jouets aux enfants du village de Grôh autour d’un arbre de Noël", width: 1200, height: 866 },
    ],
  },
  {
    id: "fondation-rose-guiro",
    label: "Fondation Marie Rose Guiraud",
    title: "Unir les forces avec la Fondation Marie Rose Guiraud",
    place: "Côte d’Ivoire",
    text: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiraud, pour accompagner ses bénéficiaires.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/fondation-rose-guiro/01.webp", alt: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiraud", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/fondation-rose-guiro/02.webp", alt: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiraud", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/fondation-rose-guiro/03.webp", alt: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiraud", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/fondation-rose-guiro/04.webp", alt: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiraud", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/fondation-rose-guiro/05.webp", alt: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiraud", width: 1200, height: 866 },
    ],
  },
  {
    id: "kits-divo",
    label: "Kits scolaires · Divo",
    title: "Deux cents élèves outillés au quartier Dialogue",
    place: "Quartier Dialogue · Divo · Côte d’Ivoire",
    date: "28 septembre 2016",
    text: "Cartables, cahiers, fournitures et vivres distribués aux enfants orphelins pour la rentrée académique 2016-2017.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/kits-divo/01.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/02.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/03.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 900 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/04.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 900 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/05.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/06.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/07.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/08.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/09.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/10.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/11.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/12.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/13.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-divo/14.webp", alt: "Distribution de cartables et de fournitures aux enfants du quartier Dialogue, à Divo", width: 1200, height: 866 },
    ],
  },
  {
    id: "kits-zaroko",
    label: "Kits scolaires · Zaroko",
    title: "La rentrée des enfants de Zaroko",
    place: "Zaroko · Côte d’Ivoire",
    text: "Des kits scolaires remis aux enfants orphelins du village au moment de la rentrée académique.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/01.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/02.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/03.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/04.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/05.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/06.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/07.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/08.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/09.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/10.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/11.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/12.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/13.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/14.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/15.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/kits-zaroko/16.webp", alt: "Remise de kits scolaires aux enfants du village de Zaroko", width: 1200, height: 800 },
    ],
  },
  {
    id: "veuves-zaroko",
    label: "Veuves de Zaroko",
    title: "Soutien aux femmes veuves",
    place: "Zaroko et Divo · Côte d’Ivoire",
    text: "Des vivres remis aux femmes veuves du village, en soutien aux familles qu’elles portent seules.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/01.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/02.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/03.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/04.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/05.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/06.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/07.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/08.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/09.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/veuves-zaroko/10.webp", alt: "Remise de vivres aux femmes veuves du village de Zaroko", width: 1200, height: 866 },
    ],
  },
  {
    id: "fete-des-meres",
    label: "Fête des mères",
    title: "La fête des mères au village",
    place: "Zaroko · Côte d’Ivoire",
    date: "2015",
    text: "Une journée pour les mères du village, avec des présents remis à chacune.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/fete-des-meres/01.webp", alt: "Célébration de la fête des mères avec les femmes du village de Zaroko", width: 1200, height: 900 },
      { src: "/images/espoir-de-vie/galerie/fete-des-meres/02.webp", alt: "Célébration de la fête des mères avec les femmes du village de Zaroko", width: 1200, height: 900 },
      { src: "/images/espoir-de-vie/galerie/fete-des-meres/03.webp", alt: "Célébration de la fête des mères avec les femmes du village de Zaroko", width: 1200, height: 900 },
      { src: "/images/espoir-de-vie/galerie/fete-des-meres/04.webp", alt: "Célébration de la fête des mères avec les femmes du village de Zaroko", width: 1200, height: 900 },
      { src: "/images/espoir-de-vie/galerie/fete-des-meres/05.webp", alt: "Célébration de la fête des mères avec les femmes du village de Zaroko", width: 1200, height: 900 },
    ],
  },
  {
    id: "orphelinat-construction",
    label: "Le chantier",
    title: "L’orphelinat en construction",
    place: "Divo · Côte d’Ivoire",
    date: "25 octobre 2016",
    text: "Visite du chantier pendant l’édification du bâtiment destiné à accueillir et accompagner les enfants.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/01.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/02.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/03.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 1662 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/04.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 1662 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/05.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/06.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/07.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/08.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/09.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/10.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/11.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/12.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 1662 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/13.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-construction/14.webp", alt: "Visite du chantier de l’orphelinat Espoir de Vie pendant sa construction", width: 1200, height: 866 },
    ],
  },
  {
    id: "visite-avant-finition",
    label: "Avant la finition",
    title: "La visite avant l’ameublement",
    place: "Divo · Côte d’Ivoire",
    text: "Le bâtiment achevé, avant l’installation du mobilier : les chambres, la salle de classe et les espaces communs.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/01.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/02.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/03.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/04.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/05.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/06.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/07.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/08.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/09.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/10.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/11.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/12.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/13.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/visite-avant-finition/14.webp", alt: "Visite de l’orphelinat Espoir de Vie achevé, avant l’installation du mobilier", width: 1200, height: 866 },
    ],
  },
  {
    id: "premiers-pensionnaires",
    label: "Premiers pensionnaires",
    title: "Les premiers enfants accueillis",
    place: "Divo · Côte d’Ivoire",
    date: "11 février 2017",
    text: "L’orphelinat accueille ses premiers pensionnaires, quelques jours avant son ouverture officielle.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/01.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/02.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/03.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/04.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/05.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/06.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/07.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 1800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/08.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 1800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/09.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 1800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/10.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/11.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 1800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/12.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/13.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/premiers-pensionnaires/14.webp", alt: "Accueil des premiers pensionnaires de l’orphelinat Espoir de Vie", width: 1200, height: 866 },
    ],
  },
  {
    id: "orphelinat-ouverture",
    label: "L’ouverture officielle",
    title: "L’ouverture officielle de l’orphelinat",
    place: "Divo · Côte d’Ivoire",
    date: "15 février 2017",
    text: "L’orphelinat ouvre ses portes en présence des autorités de la ville, avec cortège, discours et rappel des droits de l’enfant.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/01.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/02.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/03.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/04.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/05.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/06.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/07.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/08.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/09.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/10.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/11.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/12.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/13.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/14.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/15.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/16.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/17.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 866 },
      { src: "/images/espoir-de-vie/galerie/orphelinat-ouverture/18.webp", alt: "Ouverture officielle de l’orphelinat Espoir de Vie en présence des autorités", width: 1200, height: 866 },
    ],
  },
  {
    id: "repas-partage",
    label: "Le repas partagé",
    title: "Le partage du repas",
    place: "Divo · Côte d’Ivoire",
    date: "mars 2017",
    text: "Un repas préparé et servi aux enfants de l’orphelinat, partagé autour de la même table.",
    photos: [
      { src: "/images/espoir-de-vie/galerie/repas-partage/01.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/02.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/03.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/04.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/05.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/06.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/07.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/08.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/09.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/10.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/11.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/12.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/13.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/14.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/15.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
      { src: "/images/espoir-de-vie/galerie/repas-partage/16.webp", alt: "Repas préparé et partagé avec les enfants de l’orphelinat Espoir de Vie", width: 1200, height: 800 },
    ],
  },
];

/** Nombre total de photos publiées, affiché en tête de galerie. */
export const edvGalleryPhotoCount = edvGalleryCategories.reduce(
  (total, category) => total + category.photos.length,
  0,
);
