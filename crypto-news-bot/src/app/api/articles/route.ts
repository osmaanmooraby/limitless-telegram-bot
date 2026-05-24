/**
 * GET /api/articles
 * Returns a paginated list of fetched articles.
 *
 * Query params:
 *   page     (default 1)
 *   limit    (default 20)
 *   processed (true | false | all — default all)
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page      = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit     = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const processed = searchParams.get('processed');

    const where =
      processed === 'true'  ? { isProcessed: true }  :
      processed === 'false' ? { isProcessed: false } :
      {};

    const [articles, total] = await Promise.all([
      db.article.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
        include: {
          posts: {
            select: { id: true, platform: true, status: true },
          },
        },
      }),
      db.article.count({ where }),
    ]);

    return NextResponse.json({ articles, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
