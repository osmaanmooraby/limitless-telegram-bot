/**
 * Image Generator — OpenAI DALL-E 3
 *
 * Generates images from text prompts using the OpenAI Images API.
 * If OPENAI_API_KEY is not set, this step is gracefully skipped
 * and the post is saved with just the prompt (no image URL).
 *
 * You can swap DALL-E for Stable Diffusion / Replicate by replacing
 * the `generateImageFromPrompt` function body.
 */

import OpenAI from 'openai';
import { Platform } from './content-generator';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GeneratedImage {
  url: string;        // Temporary URL from OpenAI (expires ~1 hour)
  revisedPrompt: string; // DALL-E often refines the prompt — log it
}

// ─── Size mapping per platform ────────────────────────────────────────────────

const sizeMap: Record<Platform, '1024x1024' | '1792x1024' | '1024x1792'> = {
  facebook_page: '1792x1024',    // Landscape — great for Page posts
  x:             '1024x1024',    // Square — standard for tweet cards
  linkedin:      '1792x1024',    // Landscape — LinkedIn banner style
  whatsapp:      '1024x1024',    // Square — works well in chats
  facebook_profile: '1024x1024', // Square — looks good in feed
};

// ─── Main generator ───────────────────────────────────────────────────────────

/**
 * Generates a single image for the given platform and prompt.
 * Returns null if OPENAI_API_KEY is missing (graceful skip).
 */
export async function generateImageFromPrompt(
  prompt: string,
  platform: Platform,
): Promise<GeneratedImage | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.log('[image-generator] OPENAI_API_KEY not set — skipping image generation.');
    return null;
  }

  const client = new OpenAI({ apiKey });

  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: sizeMap[platform],
    quality: 'standard', // Use "hd" for higher quality (costs 2x)
    style: 'natural',    // "vivid" = more dramatic, "natural" = realistic
  });

  const imageData = response.data?.[0];

  if (!imageData?.url) {
    throw new Error('OpenAI returned no image URL in the response.');
  }

  return {
    url: imageData.url,
    revisedPrompt: imageData.revised_prompt ?? prompt,
  };
}

/**
 * Generates images for multiple platforms.
 * Errors per-platform are caught so one failure doesn't block others.
 */
export async function generateImagesForPlatforms(
  prompts: Array<{ platform: Platform; prompt: string }>,
): Promise<Map<Platform, GeneratedImage | null>> {
  const results = new Map<Platform, GeneratedImage | null>();

  for (const { platform, prompt } of prompts) {
    try {
      const image = await generateImageFromPrompt(prompt, platform);
      results.set(platform, image);

      // Small delay between API calls to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(
        `[image-generator] Failed for platform "${platform}":`,
        err instanceof Error ? err.message : err,
      );
      results.set(platform, null);
    }
  }

  return results;
}
