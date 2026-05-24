/**
 * Social Media Poster
 *
 * Handles publishing approved posts to each platform via official APIs.
 *
 * Auto-posting platforms (safe official APIs):
 *   ✅ X (Twitter)        — twitter-api-v2
 *   ✅ Facebook Page      — Meta Graph API
 *   ✅ LinkedIn           — LinkedIn v2 API (UGC Posts)
 *
 * Manual-only platforms (no safe official posting API):
 *   ⚠️  WhatsApp Group    — Returns content for copy-paste
 *   ⚠️  Facebook Profile  — Returns content for copy-paste
 */

import { TwitterApi } from 'twitter-api-v2';
import fetch from 'node-fetch';
import { Platform } from './content-generator';
import { logEntry } from './logger';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PostResult {
  success: boolean;
  postId?: string;   // External ID returned by the platform
  error?: string;
}

// ─── X (Twitter) ─────────────────────────────────────────────────────────────

async function postToX(content: string, imageUrl?: string): Promise<PostResult> {
  const client = new TwitterApi({
    appKey:    process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken:  process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!,
  });

  // If we have an image, upload it first then attach to tweet
  let mediaId: string | undefined;
  if (imageUrl) {
    try {
      // Download the image buffer
      const res = await fetch(imageUrl);
      const buffer = await res.buffer();
      const contentType = res.headers.get('content-type') ?? 'image/png';
      const uploaded = await client.v1.uploadMedia(buffer, { mimeType: contentType });
      mediaId = uploaded;
    } catch {
      // Non-fatal — post without image
      console.warn('[social-poster] X: could not upload image, posting text-only');
    }
  }

  const tweet = await client.v2.tweet({
    text: content,
    ...(mediaId ? { media: { media_ids: [mediaId] } } : {}),
  });

  return { success: true, postId: tweet.data.id };
}

// ─── Facebook Page ────────────────────────────────────────────────────────────

async function postToFacebookPage(content: string, imageUrl?: string): Promise<PostResult> {
  const pageId    = process.env.FACEBOOK_PAGE_ID!;
  const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN!;

  let endpoint: string;
  let body: Record<string, string>;

  if (imageUrl) {
    // Post with photo
    endpoint = `https://graph.facebook.com/v19.0/${pageId}/photos`;
    body = {
      caption:      content,
      url:          imageUrl,
      access_token: pageToken,
    };
  } else {
    // Post text only
    endpoint = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    body = {
      message:      content,
      access_token: pageToken,
    };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as { id?: string; error?: { message: string } };

  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `HTTP ${res.status}`);
  }

  return { success: true, postId: data.id };
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────

async function postToLinkedIn(content: string, imageUrl?: string): Promise<PostResult> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN!;
  const authorUrn   = process.env.LINKEDIN_PERSON_URN!; // e.g. "urn:li:person:XXXXXXXX"

  // Step 1 (optional): Upload image as a LinkedIn asset if imageUrl is provided
  let imageAsset: string | undefined;
  if (imageUrl) {
    try {
      // LinkedIn requires a two-step image upload; skip for brevity and post text-only
      // A full implementation would use the LinkedIn Asset Upload API
      console.log('[social-poster] LinkedIn: image upload not implemented, posting text-only');
    } catch {
      // Non-fatal
    }
  }

  // Step 2: Create the UGC post
  const postBody = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: content },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(postBody),
  });

  const data = (await res.json()) as { id?: string; message?: string };

  if (!res.ok) {
    throw new Error(data.message ?? `HTTP ${res.status}`);
  }

  return { success: true, postId: data.id };
}

// ─── Main dispatcher ──────────────────────────────────────────────────────────

/**
 * Posts to a given platform. Throws on missing credentials or API errors.
 * Returns { success: false, error } for recoverable failures so the
 * scheduler can log them without crashing.
 */
export async function publishPost(
  platform: Platform,
  content: string,
  imageUrl?: string,
): Promise<PostResult> {
  try {
    switch (platform) {
      case 'x':
        return await postToX(content, imageUrl);

      case 'facebook_page':
        return await postToFacebookPage(content, imageUrl);

      case 'linkedin':
        return await postToLinkedIn(content, imageUrl);

      case 'whatsapp':
      case 'facebook_profile':
        // These platforms require manual posting — they are never auto-published.
        return {
          success: false,
          error: `Platform "${platform}" requires manual posting. Content is ready in the dashboard.`,
        };

      default:
        return { success: false, error: `Unknown platform: ${platform}` };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await logEntry('post', 'error', `Failed to post to ${platform}: ${message}`, { platform });
    return { success: false, error: message };
  }
}

/**
 * Checks whether the required environment variables are configured
 * for a given platform. Useful for pre-flight checks.
 */
export function isPlatformConfigured(platform: Platform): boolean {
  switch (platform) {
    case 'x':
      return !!(
        process.env.TWITTER_API_KEY &&
        process.env.TWITTER_API_SECRET &&
        process.env.TWITTER_ACCESS_TOKEN &&
        process.env.TWITTER_ACCESS_SECRET
      );
    case 'facebook_page':
      return !!(process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ACCESS_TOKEN);
    case 'linkedin':
      return !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN);
    case 'whatsapp':
    case 'facebook_profile':
      return false; // Always manual
    default:
      return false;
  }
}
