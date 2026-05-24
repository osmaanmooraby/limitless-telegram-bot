/**
 * Platform-Specific Content Generator
 *
 * Takes the AI-rewritten content and formats it for each platform,
 * respecting character limits, tone, and platform conventions.
 *
 * Platforms:
 *   facebook_page     — Auto-post via Graph API (500–2000 chars ideal)
 *   x                 — Auto-post via Twitter API v2 (≤280 chars per tweet)
 *   linkedin          — Auto-post via LinkedIn API (700–1200 chars ideal)
 *   whatsapp          — Manual copy-paste (concise, conversational)
 *   facebook_profile  — Manual copy-paste (personal, storytelling tone)
 */

import { RewrittenContent } from './ai-rewrite';
import { RawArticle } from './rss';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Platform =
  | 'facebook_page'
  | 'x'
  | 'linkedin'
  | 'whatsapp'
  | 'facebook_profile';

export interface PlatformPost {
  platform: Platform;
  content: string;
  imagePrompt: string;
  // "auto" = safe to post via API | "manual" = requires copy-paste
  postingMode: 'auto' | 'manual';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Truncates text to maxLen, adding ellipsis if needed */
function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '…';
}

/** Formats bullet points as emoji list */
function bulletList(points: string[]): string {
  return points.map((p) => `• ${p}`).join('\n');
}

// ─── Platform Content Builders ───────────────────────────────────────────────

function buildFacebookPage(content: RewrittenContent, article: RawArticle): string {
  return `
🪙 ${content.headline}

${content.summary}

📋 Key Takeaways:
${bulletList(content.keyPoints)}

${content.callToAction}

${content.sourceCredit}

${content.disclaimer}

#CryptoNews #Bitcoin #Blockchain #CryptoEducation #Crypto2025
`.trim();
}

function buildX(content: RewrittenContent, article: RawArticle): string {
  // X has a 280-character limit. We create a concise tweet + link.
  // Typical strategy: headline + 1 key point + link
  const base = `🪙 ${content.headline}\n\n${content.keyPoints[0]}\n\n🔗 ${article.url}\n\n#Crypto #Bitcoin`;
  return truncate(base, 280);
}

function buildLinkedIn(content: RewrittenContent, article: RawArticle): string {
  return `
${content.headline} 🔍

${content.summary}

Here's what you need to know:

${bulletList(content.keyPoints)}

${content.callToAction}

${content.sourceCredit}

${content.disclaimer}

---
💡 Follow for daily crypto market updates and education.

#CryptoNews #Blockchain #DigitalAssets #CryptoEducation #Web3 #Bitcoin #Finance
`.trim();
}

function buildWhatsApp(content: RewrittenContent, article: RawArticle): string {
  // WhatsApp is conversational. Keep it concise and personal.
  // Marked as MANUAL — copy-paste required.
  return `
*🪙 Crypto Update — ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}*

*${content.headline}*

${content.summary}

*Key Points:*
${bulletList(content.keyPoints)}

${content.callToAction}

🔗 ${article.url}

_${content.disclaimer}_
`.trim();
}

function buildFacebookProfile(content: RewrittenContent, article: RawArticle): string {
  // Profile posts feel more personal. Marked as MANUAL — copy-paste required.
  return `
Just spotted something worth sharing in today's crypto news 👀

${content.headline}

${content.summary}

${bulletList(content.keyPoints)}

If you're watching the crypto space, this one's worth reading 👇
${article.url}

${content.disclaimer}

#Crypto #Bitcoin #Learning
`.trim();
}

// ─── Main Generator ───────────────────────────────────────────────────────────

/**
 * Generates platform-specific posts for all 5 platforms.
 */
export function generatePlatformPosts(
  content: RewrittenContent,
  article: RawArticle,
): PlatformPost[] {
  return [
    {
      platform: 'facebook_page',
      content: buildFacebookPage(content, article),
      imagePrompt: buildImagePrompt('facebook_page', content, article),
      postingMode: 'auto',
    },
    {
      platform: 'x',
      content: buildX(content, article),
      imagePrompt: buildImagePrompt('x', content, article),
      postingMode: 'auto',
    },
    {
      platform: 'linkedin',
      content: buildLinkedIn(content, article),
      imagePrompt: buildImagePrompt('linkedin', content, article),
      postingMode: 'auto',
    },
    {
      platform: 'whatsapp',
      content: buildWhatsApp(content, article),
      imagePrompt: buildImagePrompt('whatsapp', content, article),
      postingMode: 'manual', // ⚠️ No official WhatsApp API for groups
    },
    {
      platform: 'facebook_profile',
      content: buildFacebookProfile(content, article),
      imagePrompt: buildImagePrompt('facebook_profile', content, article),
      postingMode: 'manual', // ⚠️ Facebook does not allow bot posting to personal profiles
    },
  ];
}

// ─── Image Prompt Builder ─────────────────────────────────────────────────────

/**
 * Generates a DALL-E / Stable Diffusion image prompt optimised per platform.
 */
export function buildImagePrompt(
  platform: Platform,
  content: RewrittenContent,
  article: RawArticle,
): string {
  const topic = content.headline;
  const category = article.category ?? 'cryptocurrency';

  const styleMap: Record<Platform, string> = {
    facebook_page:
      'Clean, modern digital art. Wide 16:9 landscape format. Professional infographic style.',
    x:
      'Minimal, bold graphic. Square 1:1 format. High contrast. Eye-catching.',
    linkedin:
      'Professional, corporate style. Clean data-visualization aesthetic. Muted blue tones.',
    whatsapp:
      'Simple, colourful illustration. Square format. Friendly and approachable.',
    facebook_profile:
      'Personal, warm aesthetic. Slight depth of field. Lifestyle-tech fusion.',
  };

  return (
    `Digital illustration about: "${topic}". ` +
    `Topic: ${category}. ` +
    `Style: ${styleMap[platform]} ` +
    `Colour palette: deep navy, gold accents, clean white space. ` +
    `No text overlays. No logos. Photorealistic elements with subtle glow effects. ` +
    `Safe for all audiences. High quality, 4K.`
  );
}
