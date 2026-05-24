/**
 * POST /api/posts/[id]/publish
 * Immediately publishes a single post to its platform.
 * The post must be in "approved" or "pending" status.
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { publishPost } from '@/lib/social-poster';
import { Platform } from '@/lib/content-generator';
import { logEntry } from '@/lib/logger';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Only allow publishing pending or approved posts
    if (!['pending', 'approved', 'failed'].includes(post.status)) {
      return NextResponse.json(
        { error: `Post with status "${post.status}" cannot be published.` },
        { status: 400 },
      );
    }

    // Manual platforms cannot be auto-published
    if (['whatsapp', 'facebook_profile'].includes(post.platform)) {
      return NextResponse.json(
        { error: `Platform "${post.platform}" requires manual posting. Copy the content from the dashboard.` },
        { status: 400 },
      );
    }

    await logEntry('post', 'info', `Manual publish triggered for post ${id} on ${post.platform}`);

    const result = await publishPost(
      post.platform as Platform,
      post.content,
      post.imageUrl ?? undefined,
    );

    const updated = await db.post.update({
      where: { id },
      data:  {
        status:       result.success ? 'posted' : 'failed',
        postId:       result.postId,
        errorMessage: result.error,
        postedAt:     result.success ? new Date() : undefined,
      },
    });

    if (result.success) {
      await logEntry('post', 'success', `Post ${id} published to ${post.platform}`, {
        postId: result.postId,
      });
    } else {
      await logEntry('post', 'error', `Post ${id} failed on ${post.platform}`, {
        error: result.error,
      });
    }

    return NextResponse.json({ post: updated, result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
