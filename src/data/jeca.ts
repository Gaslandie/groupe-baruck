import type { ImageAsset } from "./media";
import { contacts } from "./site";

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

export type JecaEdition = {
  edition: 1 | 2 | 3;
  id: "edition-1" | "edition-2" | "edition-3";
  place: "Dakar · Sénégal" | "Conakry · Guinée";
  title: string;
  date: {
    iso: "2022-08-04" | "2023-12-02" | "2026-07-30";
    endIso: "2022-08-14" | "2023-12-08" | "2026-08-04";
    label: string;
  };
  tone: "paper" | "dark" | "white";
  grid: "seven" | "six" | "twelve";
  story?: {
    lead: string;
    paragraphs: string[];
    theme: string;
  };
  simpleLead?: string;
};

export type JecaEditionNavItem = {
  href: "#edition-1" | "#edition-2" | "#edition-3";
  number: "01" | "02" | "03";
  city: "Dakar" | "Conakry";
  dates: string;
};

export const jecaPortrait: ImageAsset = {
  src: "/images/jeca/president-fondateur.webp",
  alt: "MR Djoro Joël Shaloom Krasso, président fondateur de la JECA",
  width: 852,
  height: 1846,
};

export const goreeImage: ImageAsset = {
  src: "/images/jeca/ile-de-goree.jpeg",
  alt: "Vue de l’île de Gorée au Sénégal",
  width: 640,
  height: 480,
};

export const jecaEditions: JecaEdition[] = [
  {
    edition: 1,
    id: "edition-1",
    place: "Dakar · Sénégal",
    title: "La première rencontre",
    date: { iso: "2022-08-04", endIso: "2022-08-14", label: "Du 04 au 14 août 2022" },
    tone: "paper",
    grid: "seven",
    story: {
      lead: "Environ 50 personnes réunies autour de l’entrepreneuriat et de l’investissement en Afrique.",
      paragraphs: [
        "Les participants sont venus du Canada, des États-Unis, de la Côte d’Ivoire, du Togo, du Bénin, de France, d’Angleterre et d’Australie.",
        "Les échanges ont porté sur l’investissement en Afrique, avec des interventions consacrées à ce sujet.",
      ],
      theme: "Entrepreneuriat et investissement en Afrique",
    },
  },
  {
    edition: 2,
    id: "edition-2",
    place: "Dakar · Sénégal",
    title: "Deuxième édition",
    date: { iso: "2023-12-02", endIso: "2023-12-08", label: "Du 02 au 08 décembre 2023" },
    tone: "dark",
    grid: "seven",
    simpleLead: "La deuxième édition de la JECA s’est tenue une nouvelle fois à Dakar.",
  },
  {
    edition: 3,
    id: "edition-3",
    place: "Conakry · Guinée",
    title: "La JECA à Conakry",
    date: { iso: "2026-07-30", endIso: "2026-08-04", label: "Du 30 juillet au 04 août 2026" },
    tone: "white",
    grid: "twelve",
    simpleLead:
      "La troisième édition s’est tenue à Conakry, du 30 juillet au 04 août 2026 : les échanges entre responsables, puis l’accueil des invités et la remise des présents de la JECA.",
  },
];

export const jecaEditionNav: JecaEditionNavItem[] = [
  { href: "#edition-1", number: "01", city: "Dakar", dates: "04—14 août 2022" },
  { href: "#edition-2", number: "02", city: "Dakar", dates: "02—08 décembre 2023" },
  { href: "#edition-3", number: "03", city: "Conakry", dates: "30 juillet—04 août 2026" },
];

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
      {
        src: "/images/jeca/edition-3/07.webp",
        alt: "Poignée de main devant le visuel de la conférence de la JECA, à Conakry",
        width: 1400,
        height: 1058,
        layout: "wide",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/08.webp",
        alt: "Remise d’un tee-shirt de la JECA floqué au nom de Mme Noah Marie Françoise",
        width: 1400,
        height: 1027,
        layout: "standard",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/09.webp",
        alt: "Remise d’une casquette aux couleurs de la troisième édition",
        width: 1400,
        height: 1042,
        layout: "standard",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/10.webp",
        alt: "Prise de parole lors de l’accueil des invités à Conakry",
        width: 1163,
        height: 1280,
        layout: "tall",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/11.webp",
        alt: "Échange avant la conférence, dans les locaux de Baruck Communication à Conakry",
        width: 1400,
        height: 912,
        layout: "wide",
        caption: "Troisième édition · Conakry · 2026",
      },
      {
        src: "/images/jeca/edition-3/12.webp",
        alt: "Prise de parole devant la presse, aux côtés d’une hôtesse Baruck",
        width: 1280,
        height: 1118,
        layout: "standard",
        caption: "Troisième édition · Conakry · 2026",
      },
    ],
  },
];

export type JecaNextEdition = {
  message: string;
  whatsappHref: string;
  emailHref: string;
};

const nextEditionMessage = "Je souhaite être informé de la prochaine édition de la JECA";

/** Demandes d'information sur la prochaine édition : numéros et adresse jamais recopiés. */
export const jecaNextEdition: JecaNextEdition = {
  message: nextEditionMessage,
  whatsappHref: `${contacts.whatsappHq.href}?text=${encodeURIComponent(nextEditionMessage)}`,
  emailHref: `${contacts.email.href}?subject=${encodeURIComponent(
    "Prochaine édition de la JECA",
  )}&body=${encodeURIComponent(nextEditionMessage)}`,
};

export type JecaVideo = {
  /** Fichier déposé dans `public/videos/` ; la section n'existe que s'il est présent. */
  src: `/${string}`;
  poster?: `/${string}`;
  width: number;
  height: number;
  eyebrow: string;
  title: string;
  emphasis: string;
  caption: string;
  /** Ce que le président aborde, dans l'ordre : repères avant d'écouter. */
  chapters: { number: string; title: string; text: string }[];
};

export const jecaSpeechVideo = {
  src: "/videos/discours-pdg-jeca.mp4",
  poster: "/images/jeca/discours-pdg-jeca.jpg",
  width: 640,
  height: 368,
  eyebrow: "La parole du président",
  title: "Écouter la vision,",
  emphasis: "dans ses mots.",
  caption: "Prise de parole du président de la JECA devant la presse.",
  chapters: [
    {
      number: "01",
      title: "Se réunir",
      text: "Les États ne peuvent pas tout faire : il faut se réunir pour s’occuper de l’Afrique.",
    },
    {
      number: "02",
      title: "Dépasser la peur",
      text: "Beaucoup ont peur d’investir après des expériences qui n’ont pas fonctionné. La réponse de la JECA est de sensibiliser la diaspora.",
    },
    {
      number: "03",
      title: "Venir au Sénégal",
      text: "L’île de Gorée et le voyage de non-retour : la JECA a compris qu’elle devait aussi venir au Sénégal.",
    },
  ],
} satisfies JecaVideo;
