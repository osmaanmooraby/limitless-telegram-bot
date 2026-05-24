/**
 * RSS Feed Fetcher — Cointelegraph
 *
 * Parses the Cointelegraph RSS feed and returns a normalised list of
 * articles ready to be stored in the database.
 *
 * Feed URL: https://cointelegraph.com/rss
 */

import Parser from 'rss-parser';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RawArticle {
  guid: string;
  title: string;
  url: string;
  description: string; // plain-text excerpt
  author?: string;
  category?: string;
  imageUrl?: string;
  publishedAt: Date;
}

// RSS custom fields Cointelegraph adds
type CustomFeed = Record<string, never>;
type CustomItem = {
  'media:content'?: { $?: { url?: string } };
  'media:thumbnail'?: { $?: { url?: string } };
  enclosure?: { url?: string };
};

// ─── Parser instance ─────────────────────────────────────────────────────────

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: [
      ['media:content', 'media:content'],
      ['media:thumbnail', 'media:thumbnail'],
    ],
  },
});

// Strip HTML tags from the description so we store clean text
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Extract a usable image URL from the RSS item
function extractImage(item: Parser.Item & CustomItem): string | undefined {
  return (
    item['media:content']?.$?.url ||
    item['media:thumbnail']?.$?.url ||
    item.enclosure?.url ||
    undefined
  );
}

// ─── Main fetch function ──────────────────────────────────────────────────────

/**
 * Fetches the latest articles from Cointelegraph RSS.
 * @param limit Maximum number of items to return (default 20)
 */
export async function fetchCointelegraphFeed(limit = 20): Promise<RawArticle[]> {
  const feedUrl = process.env.RSS_FEED_URL ?? 'https://cointelegraph.com/rss';

  const feed = await parser.parseURL(feedUrl);

  return feed.items
    .slice(0, limit)
    .filter((item) => item.guid && item.link && item.title)
    .map((item) => ({
      guid: item.guid!,
      title: item.title!,
      url: item.link!,
      description: stripHtml(item.contentSnippet ?? item.summary ?? item.content ?? ''),
      author: item.creator ?? (item as unknown as { author?: string }).author,
      category: Array.isArray(item.categories) ? item.categories[0] : undefined,
      imageUrl: extractImage(item as Parser.Item & CustomItem),
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    }));
}

/**
 * Picks the single most relevant article to feature today.
 * Priority: most recently published article that is not already in DB.
 * If you want smarter selection (e.g. engagement-based), swap this function.
 */
export function pickBestArticle(articles: RawArticle[]): RawArticle {
  // Articles come newest-first from the RSS feed; just pick the first one.
  // You can add keyword scoring or category filtering here.
  const preferred = articles.find((a) =>
    // Slightly prefer articles with images and a good description
    a.imageUrl && a.description.length > 80,
  );
  return preferred ?? articles[0];
}
