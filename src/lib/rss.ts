import { categoryLabels, newsDescription, newsFeedTitle, type Article } from "@/data/actualites";
import { routes, site } from "@/data/site";

/** Échappement XML des cinq caractères réservés. Ni CDATA, ni bibliothèque. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const feedUrl = site.url + "feed.xml";
const newsUrl = site.url + routes.news.slice(1);

/** RSS 2.0 des articles publiés, dans l'ordre de getAllArticles(). */
export function renderRssFeed(articles: Article[]): string {
  const items = articles.map((article) => {
    const url = `${site.url}actualites/${article.slug}/`;

    return [
      "    <item>",
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate>`,
      `      <category>${escapeXml(categoryLabels[article.category])}</category>`,
      `      <description>${escapeXml(article.excerpt)}</description>`,
      "    </item>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(newsFeedTitle)}</title>`,
    `    <link>${escapeXml(newsUrl)}</link>`,
    `    <description>${escapeXml(newsDescription)}</description>`,
    "    <language>fr-FR</language>",
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
