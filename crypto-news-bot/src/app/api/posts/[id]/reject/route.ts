/**
 * POST /api/posts/[id]/reject
 * Changes post status to "rejected". The post will not be published.
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    if (post.status === 'posted') {
      return NextResponse.json(
        { error: 'Cannot reject a post that has already been published.' },
        { status: 400 },
      );
    }

    const updated = await db.post.update({
      where: { id },
      data:  { status: 'rejected' },
    });

    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to reject post' }, { status: 500 });
  }
}
