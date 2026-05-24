/**
 * Main Automation Orchestrator
 *
 * This is the central function that runs the full daily pipeline:
 *
 *  1. Fetch latest articles from Cointelegraph RSS
 *  2. Filter out duplicates (already-seen GUIDs)
 *  3. Pick the best article for today
 *  4. Save article to DB
 *  5. AI-rewrite using Claude
 *  6. Generate platform-specific content for all 5 platforms
 *  7. Generate image prompts (and optionally images via DALL-E)
 *  8. Save all posts to DB with status "pending" (or "manual" for WhatsApp/Profile)
 *  9. Auto-publish approved posts (if AUTO_PUBLISH=true in .env)
 * 10. Log every step
 *
 * Called by:
 *   - automation/scheduler.ts  (daily cron)
 *   - automation/run.ts        (manual trigger)
 *   - /api/run-automation      (dashboard trigger)
 */

import db from './db';
import { fetchCointelegraphFeed, pickBestArticle, RawArticle } from './rss';
import { filterNewArticles } from './duplicate-checker';
import { rewriteArticle } from './ai-rewrite';
import { generatePlatformPosts, Platform } from './content-generator';
import { generateImagesForPlatforms } from './image-generator';
import { publishPost, isPlatformConfigured } from './social-poster';
import { log } from './logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AutomationResult {
  success: boolean;
  articleTitle?: string;
  articleUrl?: string;
  postsCreated: number;
  postsPublished: number;
  error?: string;
  skipped?: boolean;
  skipReason?: string;
}

// ─── Main runner ──────────────────────────────────────────────────────────────

export async function runDailyAutomation(): Promise<AutomationResult> {
  await log.info('scheduler', '🚀 Daily automation started');

  try {
    // ── Step 1: Fetch RSS ──────────────────────────────────────────────────
    await log.info('fetch', 'Fetching Cointelegraph RSS feed…');
    let articles: RawArticle[];

    try {
      articles = await fetchCointelegraphFeed(30);
      await log.success('fetch', `Fetched ${articles.length} articles from RSS`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await log.error('fetch', `RSS fetch failed: ${msg}`);
      return { success: false, postsCreated: 0, postsPublished: 0, error: msg };
    }

    // ── Step 2: Duplicate filter ───────────────────────────────────────────
    const newArticles = await filterNewArticles(articles);

    if (newArticles.length === 0) {
      await log.info('fetch', 'No new articles found — all already processed. Skipping.');
      return {
        success: true,
        postsCreated: 0,
        postsPublished: 0,
        skipped: true,
        skipReason: 'All recent articles have already been processed.',
      };
    }

    // ── Step 3: Pick best article ──────────────────────────────────────────
    const article = pickBestArticle(newArticles);
    await log.info('fetch', `Selected article: "${article.title}"`, { url: article.url });

    // ── Step 4: Save article to DB ─────────────────────────────────────────
    const savedArticle = await db.article.create({
      data: {
        guid:        article.guid,
        title:       article.title,
        url:         article.url,
        description: article.description,
        author:      article.author,
        category:    article.category,
        imageUrl:    article.imageUrl,
        publishedAt: article.publishedAt,
      },
    });

    // ── Step 5: AI Rewrite ─────────────────────────────────────────────────
    await log.info('generate', 'Rewriting article with Claude AI…');
    let rewritten;

    try {
      rewritten = await rewriteArticle(article);
      await log.success('generate', 'Article rewritten successfully');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await log.error('generate', `AI rewrite failed: ${msg}`);

      // Mark the article so we don't retry it immediately
      await db.article.update({
        where: { id: savedArticle.id },
        data: { isProcessed: true },
      });

      return { success: false, postsCreated: 0, postsPublished: 0, error: msg };
    }

    // ── Step 6: Generate platform-specific content ─────────────────────────
    await log.info('generate', 'Generating platform-specific content…');
    const platformPosts = generatePlatformPosts(rewritten, article);
    await log.success('generate', `Generated content for ${platformPosts.length} platforms`);

    // ── Step 7: Generate images (optional) ────────────────────────────────
    await log.info('image', 'Generating images via DALL-E 3…');
    const imageResults = await generateImagesForPlatforms(
      platformPosts.map((p) => ({ platform: p.platform as Platform, prompt: p.imagePrompt })),
    );

    const generatedCount = Array.from(imageResults.values()).filter(Boolean).length;
    await log.info('image', `Generated ${generatedCount}/${platformPosts.length} images`);

    // ── Step 8: Save posts to DB ───────────────────────────────────────────
    await log.info('generate', 'Saving posts to database…');
    let postsCreated = 0;

    for (const p of platformPosts) {
      const imageResult = imageResults.get(p.platform as Platform);

      // Status:
      //   "manual"  — copy-paste platforms (WhatsApp, Facebook Profile)
      //   "pending" — auto platforms awaiting approval
      const status = p.postingMode === 'manual' ? 'manual' : 'pending';

      await db.post.create({
        data: {
          articleId:   savedArticle.id,
          platform:    p.platform,
          content:     p.content,
          imagePrompt: p.imagePrompt,
          imageUrl:    imageResult?.url ?? undefined,
          status,
        },
      });

      postsCreated++;
    }

    await log.success('generate', `${postsCreated} posts saved to database`);

    // Mark article as processed
    await db.article.update({
      where: { id: savedArticle.id },
      data: { isProcessed: true },
    });

    // ── Step 9: Auto-publish (if enabled) ─────────────────────────────────
    let postsPublished = 0;
    const autoPublish = process.env.AUTO_PUBLISH === 'true';

    if (autoPublish) {
      await log.info('post', 'AUTO_PUBLISH=true — publishing approved posts…');

      const pendingPosts = await db.post.findMany({
        where: {
          articleId: savedArticle.id,
          status:    'pending',
        },
      });

      for (const post of pendingPosts) {
        const platform = post.platform as Platform;
        if (!isPlatformConfigured(platform)) {
          await log.warn('post', `Platform "${platform}" not configured — skipping`);
          continue;
        }

        const result = await publishPost(platform, post.content, post.imageUrl ?? undefined);

        await db.post.update({
          where: { id: post.id },
          data: {
            status:       result.success ? 'posted' : 'failed',
            postId:       result.postId,
            errorMessage: result.error,
            postedAt:     result.success ? new Date() : undefined,
          },
        });

        if (result.success) {
          postsPublished++;
          await log.success('post', `✅ Posted to ${platform}`, { postId: result.postId });
        } else {
          await log.error('post', `❌ Failed to post to ${platform}`, { error: result.error });
        }

        // Rate-limit buffer between posts
        await new Promise((r) => setTimeout(r, 1000));
      }
    } else {
      await log.info('post', 'AUTO_PUBLISH=false — posts are pending manual approval in dashboard');
    }

    await log.success('scheduler', `✅ Daily automation complete — ${postsCreated} posts created, ${postsPublished} published`);

    return {
      success:        true,
      articleTitle:   article.title,
      articleUrl:     article.url,
      postsCreated,
      postsPublished,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await log.error('scheduler', `Unhandled automation error: ${msg}`);
    return { success: false, postsCreated: 0, postsPublished: 0, error: msg };
  }
}
