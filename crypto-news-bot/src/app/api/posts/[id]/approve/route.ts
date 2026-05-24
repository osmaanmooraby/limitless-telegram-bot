/**
 * POST /api/posts/[id]/approve
 * Changes post status from "pending" → "approved".
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

    if (!['pending', 'failed'].includes(post.status)) {
      return NextResponse.json(
        { error: `Post cannot be approved from status "${post.status}"` },
        { status: 400 },
      );
    }

    const updated = await db.post.update({
      where: { id },
      data:  { status: 'approved', errorMessage: null },
    });

    return NextResponse.json({ post: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to approve post' }, { status: 500 });
  }
}
