/**
 * GET /api/stats
 * Returns summary counts for the dashboard overview cards.
 */

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [
      totalArticles,
      totalPosts,
      pendingPosts,
      approvedPosts,
      postedPosts,
      failedPosts,
      manualPosts,
      recentErrors,
    ] = await Promise.all([
      db.article.count(),
      db.post.count(),
      db.post.count({ where: { status: 'pending' } }),
      db.post.count({ where: { status: 'approved' } }),
      db.post.count({ where: { status: 'posted' } }),
      db.post.count({ where: { status: 'failed' } }),
      db.post.count({ where: { status: 'manual' } }),
      db.log.count({
        where: {
          status:  'error',
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    // Posts per platform
    const platformCounts = await db.post.groupBy({
      by:         ['platform'],
      _count:     { _all: true },
      where:      { status: 'posted' },
    });

    return NextResponse.json({
      articles: { total: totalArticles },
      posts: {
        total:    totalPosts,
        pending:  pendingPosts,
        approved: approvedPosts,
        posted:   postedPosts,
        failed:   failedPosts,
        manual:   manualPosts,
      },
      platforms: Object.fromEntries(
        platformCounts.map((p) => [p.platform, p._count._all]),
      ),
      alerts: { recentErrors },
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
