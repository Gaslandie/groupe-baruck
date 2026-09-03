import type { ImageAsset } from "./media";

export type GalleryPhoto = {
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
  layout: "wide" | "tall" | "standard";
  caption: string;
};

export type JecaGallery = {
  edition: 1 | 2 | 3;
  caption: string;
  photos: GalleryPhoto[];
};

export const jecaPortrait: ImageAsset = {
  src: "/images/jeca/president-fondateur.webp",
  alt: "Djoro Joël Shaloom Krasso, président fondateur de la JECA",
  width: 852,
  height: 1846,
};

export const goreeImage: ImageAsset = {
  src: "/images/jeca/ile-de-goree.jpeg",
  alt: "Vue de l’île de Gorée au Sénégal",
  width: 640,
  height: 480,
};

export const jecaGalleries: JecaGallery[] = [
  {
    edition: 1,
    caption: "Première édition · Dakar · 2022",
    photos: [
      {
        src: "/images/jeca/edition-1/01.jpeg",
        alt: "Participants réunis lors de la première édition du forum JECA à Dakar",
        width: 1080,
        height: 718,
        layout: "wide",
        caption: "Première édition · Dakar · 2022",
      },
      {
        src: "/images/jeca/edition-1/02.jpeg",
        alt: "Participante à la première édition du forum JECA",
        width: 718,
        height: 1080,
        layout: "tall",
        caption: "Première édition · Dakar · 2022",
      },
      {
        src: "/images/jeca/edition-1/03.jpeg",
        alt: "Accueil lors de la première édition du forum JECA",
        width: 1080,
        height: 718,
        layout: "standard",
        caption: "Première édition · Dakar · 2022",
      },
      {
        src: "/images/jeca/edition-1/04.jpeg",
        alt: "Participant devant le visuel de la première édition",
        width: 1080,
        height: 718,
        layout: "standard",
        caption: "Première édition · Dakar · 2022",
      },
      {
        src: "/images/jeca/edition-1/05.jpeg",
        alt: "Intervention pendant la première édition du forum JECA",
        width: 1080,
        height: 718,
        layout: "wide",
        caption: "Première édition · Dakar · 2022",
      },
      {
        src: "/images/jeca/edition-1/06.jpeg",
        alt: "Échange entre participants pendant la première édition",
        width: 1080,
        height: 718,
        layout: "standard",
        caption: "Première édition · Dakar · 2022",
      },
      {
        src: "/images/jeca/edition-1/07.jpeg",
        alt: "Participants en échange pendant la première édition",
        width: 1080,
        height: 718,
        layout: "standard",
        caption: "Première édition · Dakar · 2022",
      },
    ],
  },
  {
    edition: 2,
    caption: "Deuxième édition · Dakar · 2023",
    photos: [
      {
        src: "/images/jeca/edition-2/01.jpeg",
        alt: "Assemblée de la deuxième édition de la JECA à Dakar",
        width: 1080,
        height: 810,
        layout: "wide",
        caption: "Deuxième édition · Dakar · 2023",
      },
      {
        src: "/images/jeca/edition-2/02.jpeg",
        alt: "Photo de groupe pendant la deuxième édition de la JECA",
        width: 1080,
        height: 720,
        layout: "standard",
        caption: "Deuxième édition · Dakar · 2023",
      },
      {
        src: "/images/jeca/edition-2/03.jpeg",
        alt: "Prise de parole pendant la deuxième édition de la JECA",
        width: 1080,
        height: 720,
        layout: "standard",
        caption: "Deuxième édition · Dakar · 2023",
      },
      {
        src: "/images/jeca/edition-2/04.jpeg",
        alt: "Participants à la deuxième édition de la JECA",
        width: 1080,
        height: 720,
        layout: "wide",
        caption: "Deuxième édition · Dakar · 2023",
      },
      {
        src: "/images/jeca/edition-2/05.jpeg",
        alt: "Intervenants pendant la deuxième édition de la JECA",
        width: 1080,
        height: 720,
        layout: "standard",
        caption: "Deuxième édition · Dakar · 2023",
      },
      {
        src: "/images/jeca/edition-2/06.jpeg",
        alt: "Photo collective de la deuxième édition de la JECA",
        width: 1080,
        height: 720,
        layout: "standard",
        caption: "Deuxième édition · Dakar · 2023",
      },
      {
        src: "/images/jeca/edition-2/07.jpeg",
        alt: "Participants réunis à Dakar pour la deuxième édition",
        width: 1080,
        height: 810,
        layout: "wide",
        caption: "Deuxième édition · Dakar · 2023",
      },
    ],
  },
  {
    edition: 3,
    caption: "Troisième édition · Conakry · 2026",
    photos: [
      {
        src: "/images/jeca/edition-3/01.jpeg",
        alt: "Le président et le vice-président lors de la troisième édition à Conakry",
        width: 1280,
        height: 720,
        layout: "wide",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/02.jpeg",
        alt: "Le président et le vice-président devant le visuel de la troisième édition",
        width: 1280,
        height: 720,
        layout: "standard",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/03.jpeg",
        alt: "Le président et le vice-président pendant la troisième édition",
        width: 1280,
        height: 720,
        layout: "standard",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/04.jpeg",
        alt: "Échange entre le président et le vice-président lors de la troisième édition",
        width: 1280,
        height: 720,
        layout: "standard",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/05.jpeg",
        alt: "Le président et le vice-président réunis à Conakry",
        width: 1280,
        height: 720,
        layout: "wide",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/06.jpeg",
        alt: "Le président et le vice-président se saluant lors de la troisième édition",
        width: 1280,
        height: 720,
        layout: "standard",
        caption: "Troisième édition · Conakry · 2026",
      },
    ],
  },
];
