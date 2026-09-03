type EdvSectionNavItem = {
  href: `#${string}`;
  number: string;
  title: string;
  subtitle: string;
};

type EdvPillar = {
  number: string;
  title: string;
  text: string;
};

type EdvImpactItem = {
  value: string;
  label: string;
};

type EdvDate = {
  iso: `${number}-${number}-${number}`;
  label: string;
};

type EdvTimelineItem = {
  date?: EdvDate;
  step?: string;
  title: string;
  text: string;
};

type EdvAction = {
  number: `0${1 | 2 | 3 | 4 | 5 | 6}`;
  date?: EdvDate;
  period?: string;
  place: string;
  title: string;
  text: string;
  highlight?: string;
  tone?: "featured" | "dark";
};

type EdvCountry = {
  code: "CI" | "GN" | "BF";
  number: string;
  title: string;
  text: string;
};

type EdvCollaboration = {
  number: string;
  title: string;
  text: string;
};

export const edvSectionNav = [
  { href: "#mission", number: "01", title: "Notre mission", subtitle: "Protéger et accompagner" },
  { href: "#orphelinat", number: "02", title: "L’orphelinat", subtitle: "Une histoire depuis 2017" },
  { href: "#actions", number: "03", title: "Nos actions", subtitle: "Des engagements concrets" },
  { href: "#presence", number: "04", title: "Notre présence", subtitle: "Trois pays d’engagement" },
] satisfies EdvSectionNavItem[];

export const edvPillars = [
  { number: "01", title: "Protéger", text: "Offrir un cadre sûr aux enfants orphelins et vulnérables." },
  {
    number: "02",
    title: "Éduquer",
    text: "Faciliter la scolarisation par la remise de fournitures et de kits scolaires.",
  },
  { number: "03", title: "Nourrir & soigner", text: "Apporter une aide alimentaire et soutenir l’accès aux soins." },
  {
    number: "04",
    title: "Accompagner",
    text: "Soutenir les veuves, les mères et les familles confrontées à la précarité.",
  },
  {
    number: "05",
    title: "Agir",
    text: "Aller sur le terrain et fédérer les bonnes volontés autour d’actions concrètes.",
  },
] satisfies EdvPillar[];

export const edvImpact = [
  { value: "2015", label: "Premières actions de solidarité" },
  { value: "100", label: "Jouets remis aux enfants de Grôh" },
  { value: "200", label: "Orphelins accompagnés à la rentrée 2016–2017" },
  { value: "2017", label: "Accueil des premiers pensionnaires" },
  { value: "03", label: "Pays d’intervention" },
] satisfies EdvImpactItem[];

export const edvTimeline = [
  {
    step: "Étape 01",
    title: "Construction",
    text: "Édification du bâtiment destiné à accueillir et accompagner les enfants.",
  },
  {
    step: "Étape 02",
    title: "Aménagement",
    text: "Préparation des dortoirs, des berceaux, de la cuisine et des espaces de vie.",
  },
  {
    date: { iso: "2017-02-11", label: "11 février 2017" },
    title: "Premiers pensionnaires",
    text: "Accueil des premiers enfants avant l’ouverture officielle de l’établissement.",
  },
  {
    date: { iso: "2017-02-15", label: "15 février 2017" },
    title: "Inauguration",
    text: "Ouverture officielle en présence des communautés et des autorités invitées.",
  },
  {
    date: { iso: "2017-03-04", label: "04 mars 2017" },
    title: "Un repas partagé",
    text: "Le président fondateur partage un moment de convivialité avec les enfants accueillis.",
  },
] satisfies EdvTimelineItem[];

export const edvActions = [
  {
    number: "01",
    date: { iso: "2015-12-23", label: "23 décembre 2015" },
    place: "Grôh · Département d’Hiré · Côte d’Ivoire",
    title: "Un Noël pour les enfants",
    text: "Cent jouets remis aux enfants du village autour d’un arbre de Noël et d’un moment de partage.",
    highlight: "100 jouets",
    tone: "featured",
  },
  {
    number: "02",
    period: "Rentrées scolaires",
    place: "Zaroko et Divo · Côte d’Ivoire",
    title: "Favoriser l’accès à l’école",
    text: "Distribution de cartables, cahiers, fournitures et vivres aux enfants orphelins, dont 200 bénéficiaires au quartier Dialogue de Divo pour la rentrée 2016–2017.",
  },
  {
    number: "03",
    period: "Actions communautaires",
    place: "Côte d’Ivoire",
    title: "Soutenir les femmes et les familles",
    text: "Dons aux mères, aide alimentaire aux veuves et accompagnement de petites initiatives génératrices de revenus.",
  },
  {
    number: "04",
    period: "2017",
    place: "Orphelinat · Divo · Zaroko · Côte d’Ivoire",
    title: "Vêtir et chausser dignement",
    text: "Des vêtements ont été remis aux enfants de l’orphelinat. Des chaussures ont ensuite été distribuées aux enfants démunis de Divo, puis, le 3 juin 2017, aux enfants du village de Zaroko.",
    highlight: "4 000 chaussures à Divo · 2 000 à Zaroko",
  },
  {
    number: "05",
    period: "Solidarité associative",
    place: "Fondation Marie Rose Guiro",
    title: "Unir les forces",
    text: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiro pour accompagner ses bénéficiaires.",
  },
  {
    number: "06",
    period: "Rayonnement africain",
    place: "Guinée et Burkina Faso",
    title: "Porter l’espoir au-delà des frontières",
    text: "Soutien aux enfants de la rue, partage avec des personnes sans-abri et actions en faveur de la santé, de l’alimentation et de l’éducation.",
    tone: "dark",
  },
] satisfies EdvAction[];

export const edvCountries = [
  {
    code: "CI",
    number: "01",
    title: "Côte d’Ivoire",
    text: "Grôh, Hiré, Zaroko et Divo : jouets, kits scolaires, aide aux familles, vêtements, chaussures et construction de l’orphelinat.",
  },
  {
    code: "GN",
    number: "02",
    title: "Guinée",
    text: "Des actions autour du droit à la santé, à une alimentation équilibrée, à la protection et à l’éducation.",
  },
  {
    code: "BF",
    number: "03",
    title: "Burkina Faso",
    text: "Soutien aux enfants de la rue et moments de partage avec des personnes sans-abri pendant une tournée africaine.",
  },
] satisfies EdvCountry[];

export const edvCollaborations = [
  {
    number: "01",
    title: "Fondation Marie Rose Guiro",
    text: "Des vivres et des produits non alimentaires ont été remis pour accompagner ses bénéficiaires.",
  },
  {
    number: "02",
    title: "Église M.C.A",
    text: "Des actions de solidarité ont été menées auprès des mamans à l’occasion de la fête des Mères.",
  },
  {
    number: "03",
    title: "Ouverture associative",
    text: "L’orphelinat a reçu la visite d’une organisation française venue rencontrer les enfants et les équipes.",
  },
] satisfies EdvCollaboration[];
