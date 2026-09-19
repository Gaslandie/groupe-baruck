import Link from "next/link";

import type { NewsImage } from "@/data/actualites";
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
 * Aperçu de l'événement mis en avant sur l'accueil (2026-09-18).
 *
 * Tout vient de l'article : titre, chapeau, date et photos. Rien n'est recopié
 * ici, donc corriger l'article corrige aussi l'accueil. Si l'article n'existe
 * pas ou passe en brouillon, la section ne s'affiche pas plutôt que de casser
 * la page.
 *
 * Les photos ne sont qu'un avant-goût : le lien mène à l'article, où chaque
 * candidat a son passage complet.
 *
 * Depuis le 2026-09-19, les autres concours du groupe (`featuredAlsoSlugs`)
 * apparaissent en petit sous l'événement principal : ils avaient chacun leur
 * article, mais l'accueil ne les mentionnait nulle part. Même principe que
 * ci-dessus : tout vient de l'article, un slug inconnu est ignoré.
 */
function previewPhotos(groups: { photos: NewsImage[] }[], cover?: NewsImage): NewsImage[] {
  // Une photo par groupe : l'aperçu montre des passages différents, pas deux
  // fois le même. Complété par la couverture si l'article a peu de groupes.
  const photos = groups.map((group) => group.photos[0]).slice(0, previewCount);
  if (photos.length < previewCount && cover) photos.unshift(cover);

  return photos.slice(0, previewCount);
}

export function FeaturedEvent() {
  const article = getArticle(featuredEventSlug);

  if (!article) return null;

  const photos = previewPhotos(article.groups, article.cover);
  const href = `${routes.news}${article.slug}/`;
  // `flatMap` plutôt que `filter` : TypeScript garde ainsi le type sans `undefined`.
  const alsoArticles = featuredAlsoSlugs.flatMap((slug) => {
    const item = getArticle(slug);
    return item && item.slug !== article.slug ? [item] : [];
  });

  return (
    <section
      id="evenement"
      className="reveal-stagger scroll-mt-[92px] bg-ink px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4.5rem,9vw,9rem)] text-ivory max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <div className="reveal grid grid-cols-2 items-end gap-x-[clamp(2.5rem,6vw,6rem)] gap-y-8 max-desktop:grid-cols-1 max-desktop:items-start">
        <div>
          <p className="eyebrow light">{featuredEventEyebrow}</p>
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

      {alsoArticles.length > 0 ? (
        <div className="reveal mt-[clamp(2.8rem,5vw,4.2rem)] border-t border-[rgba(255,255,255,.14)] pt-[clamp(1.8rem,3vw,2.6rem)]">
          <p className="eyebrow light">{featuredAlsoTitle}</p>
          <ul className="m-0 mt-[clamp(1.2rem,2vw,1.8rem)] grid list-none grid-cols-2 gap-[clamp(1.2rem,3vw,2.4rem)] p-0 max-tablet:grid-cols-1">
            {alsoArticles.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`${routes.news}${item.slug}/`}
                  className="group grid grid-cols-[clamp(96px,10vw,132px)_1fr] items-center gap-[clamp(.9rem,2vw,1.4rem)] no-underline transition-opacity duration-300 hover:opacity-80 focus-visible:opacity-80"
                >
                  {item.cover ? (
                    <img
                      src={asset(item.cover.src as `/${string}`)}
                      alt=""
                      width={item.cover.width}
                      height={item.cover.height}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/5] w-full bg-ink-soft object-cover"
                    />
                  ) : null}
                  <span className="block min-w-0">
                    <time
                      dateTime={item.date}
                      className="block text-micro uppercase tracking-[.16em] text-[rgba(255,255,255,.55)]"
                    >
                      {formatDate(item.date)}
                    </time>
                    <span className="mt-[.6rem] block text-balance font-display text-display-sm font-normal leading-[1.15] text-ivory">
                      {item.title}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
