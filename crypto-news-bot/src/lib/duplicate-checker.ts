/**
 * Duplicate Checker
 *
 * Filters out RSS articles that have already been processed.
 * The `guid` field (RSS unique ID) is used as the deduplication key.
 */

import db from './db';
import { RawArticle } from './rss';

/**
 * Returns only articles whose GUIDs are NOT already in the database.
 */
export async function filterNewArticles(articles: RawArticle[]): Promise<RawArticle[]> {
  if (articles.length === 0) return [];

  const guids = articles.map((a) => a.guid);

  // Find which GUIDs already exist in the DB
  const existing = await db.article.findMany({
    where: { guid: { in: guids } },
    select: { guid: true },
  });

  const existingGuids = new Set(existing.map((e) => e.guid));

  const newArticles = articles.filter((a) => !existingGuids.has(a.guid));

  console.log(
    `[duplicate-checker] ${articles.length} fetched, ` +
      `${existingGuids.size} already seen, ` +
      `${newArticles.length} new`,
  );

  return newArticles;
}

/**
 * Checks whether a single article (by GUID) has already been processed.
 */
export async function isArticleProcessed(guid: string): Promise<boolean> {
  const article = await db.article.findUnique({
    where: { guid },
    select: { isProcessed: true },
  });
  return article?.isProcessed ?? false;
}
