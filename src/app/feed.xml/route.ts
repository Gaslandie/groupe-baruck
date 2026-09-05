import { getAllArticles } from "@/lib/actualites";
import { renderRssFeed } from "@/lib/rss";

export const dynamic = "force-static";

export function GET() {
  return new Response(renderRssFeed(getAllArticles()), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
