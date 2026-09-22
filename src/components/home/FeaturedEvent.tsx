import Link from "next/link";

import type { Article, NewsImage } from "@/data/actualites";
import {
  featuredAlsoSlugs,
  featuredAlsoTitle,
  featuredEventEyebrow,
  featuredEventSlug,
} from "@/data/home";
import { routes } from "@/data/site";
import { getArticle } from "@/lib/actualites";
import { asset } from "@/lib/asset";
import { formatDate } from "@/lib/date";

import { Icon } from "../ui/Icon";

/** Quatre photos suffisent à donner le ton sans alourdir l'accueil. */
const previewCount = 4;

/**
 * Photos d'aperçu d'un concours : une par groupe, pour montrer des passages
 * différents plutôt que deux fois le même.
 *
 * Un article qui a moins de quatre groupes est complété par sa couverture, puis
 * par les photos suivantes de chaque groupe, prises à tour de rôle (2026-09-22).
 * Sans ce complément, la grille de quatre colonnes restait trouée : la première
 * édition du Top Modèle n'a que deux groupes.
 */
function previewPhotos(groups: { photos: NewsImage[] }[], cover?: NewsImage): NewsImage[] {
  const photos = groups.map((group) => group.photos[0]).slice(0, previewCount);
  if (photos.length < previewCount && cover) photos.unshift(cover);

  const seen = new Set(photos.map((photo) => photo.src));
  const deepest = Math.max(0, ...groups.map((group) => group.photos.length));
  for (let rank = 1; rank < deepest && photos.length < previewCount; rank += 1) {
    for (const group of groups) {
      const photo = group.photos[rank];
      if (photos.length >= previewCount || !photo || seen.has(photo.src)) continue;
      seen.add(photo.src);
      photos.push(photo);
    }
  }

  return photos.slice(0, previewCount);
}

/**
 * Un concours présenté en entier : titre, date, chapeau, quatre photos et le
 * lien vers l'article. Tout vient de l'article, donc le corriger corrige aussi
 * l'accueil.
 *
 * Le sur-titre n'existe que pour l'événement de tête : les autres concours sont
 * déjà annoncés par l'intitulé de leur liste.
 */
function EventBlock({ article, eyebrow }: { article: Article; eyebrow?: string }) {
  const photos = previewPhotos(article.groups, article.cover);
  const href = `${routes.news}${article.slug}/`;

  return (
    <article className="reveal-stagger">
      <div className="reveal grid grid-cols-2 items-end gap-x-[clamp(2.5rem,6vw,6rem)] gap-y-8 max-desktop:grid-cols-1 max-desktop:items-start">
        <div>
          {eyebrow ? <p className="eyebrow light">{eyebrow}</p> : null}
          <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
            {article.title}
          </h2>
        </div>
        <div>
          <time
            dateTime={article.date}
            className="text-micro uppercase tracking-[.16em] text-[rgba(255,255,255,.55)]"
          >
            {formatDate(article.date)}
          </time>
          <p className="mb-0 mt-4 max-w-[560px] text-lead leading-[1.75] text-[rgba(255,255,255,.7)]">
            {article.excerpt}
          </p>
        </div>
      </div>

      {photos.length > 0 ? (
        <Link
          href={href}
          aria-label={`Voir l’article : ${article.title}`}
          tabIndex={-1}
          className="reveal-media mt-[clamp(2.5rem,5vw,4.5rem)] grid grid-cols-4 gap-[.7rem] max-tablet:grid-cols-2 max-tablet:gap-[.45rem]"
        >
          {photos.map((photo) => (
            <img
              key={photo.src}
              src={asset(photo.src as `/${string}`)}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full bg-ink-soft object-cover"
            />
          ))}
        </Link>
      ) : null}

      <Link href={href} className="text-link mt-[clamp(2.2rem,4vw,3.2rem)]">
        Voir l’événement <span><Icon name="arrow-up-right" /></span>
      </Link>
    </article>
  );
}

/**
 * Les concours organisés par le groupe, sur l'accueil (2026-09-18), remontés
 * sous le hero le 2026-09-22.
 *
 * L'événement de tête (`featuredEventSlug`) ouvre la section, puis les autres
 * concours (`featuredAlsoSlugs`) suivent sous leur intitulé. Depuis le
 * 2026-09-22, ils sont présentés comme lui — titre, date, chapeau et photos —
 * là où ils n'étaient qu'une liste de vignettes : le client veut voir ce que le
 * groupe a organisé, pas seulement en lire les titres.
 *
 * Rien n'est recopié ici : si un article passe en brouillon ou disparaît, son
 * bloc disparaît aussi, et la section reste entière. Sans l'événement de tête,
 * la section ne s'affiche pas plutôt que de casser la page.
 */
export function FeaturedEvent() {
  const article = getArticle(featuredEventSlug);

  if (!article) return null;

  // `flatMap` plutôt que `filter` : TypeScript garde ainsi le type sans `undefined`.
  const alsoArticles = featuredAlsoSlugs.flatMap((slug) => {
    const item = getArticle(slug);
    return item && item.slug !== article.slug ? [item] : [];
  });

  return (
    <section
      id="evenement"
      className="scroll-mt-[92px] bg-ink px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4.5rem,9vw,9rem)] text-ivory max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <EventBlock article={article} eyebrow={featuredEventEyebrow} />

      {alsoArticles.length > 0 ? (
        <div className="mt-[clamp(3.5rem,7vw,6rem)] border-t border-[rgba(255,255,255,.14)] pt-[clamp(2.4rem,4vw,3.6rem)]">
          <div className="reveal">
            <p className="eyebrow light">{featuredAlsoTitle}</p>
          </div>
          <div className="grid gap-[clamp(3.2rem,6vw,5rem)]">
            {alsoArticles.map((item) => (
              <EventBlock key={item.slug} article={item} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
