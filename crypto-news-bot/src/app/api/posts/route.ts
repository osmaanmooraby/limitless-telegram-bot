/**
 * GET /api/posts
 * Returns all posts with optional status filter.
 *
 * Query params:
 *   status   (pending | approved | posted | failed | rejected | manual | all)
 *   platform (facebook_page | x | linkedin | whatsapp | facebook_profile | all)
 *   page     (default 1)
 *   limit    (default 20)
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status   = searchParams.get('status');
    const platform = searchParams.get('platform');
    const page     = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit    = Math.min(100, parseInt(searchParams.get('limit') ?? '20'));

    const where: Record<string, unknown> = {};
    if (status   && status   !== 'all') where.status   = status;
    if (platform && platform !== 'all') where.platform = platform;

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip:    (page - 1) * limit,
        take:    limit,
        include: {
          article: {
            select: { id: true, title: true, url: true, publishedAt: true },
          },
        },
      }),
      db.post.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
