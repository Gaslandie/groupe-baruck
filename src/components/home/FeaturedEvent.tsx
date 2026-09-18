import Link from "next/link";

import type { NewsImage } from "@/data/actualites";
import { featuredEventEyebrow, featuredEventSlug } from "@/data/home";
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
    </section>
  );
}
