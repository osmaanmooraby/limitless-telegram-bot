/**
 * AI Rewrite Engine — Powered by Claude (Anthropic)
 *
 * Takes a raw Cointelegraph article and rewrites it into clean,
 * original educational content suitable for social media audiences.
 *
 * Rules enforced:
 *  - No copy-paste of original text
 *  - Simple, beginner-friendly English
 *  - Calm, premium tone — no hype
 *  - No financial advice or exact trading signals
 *  - Source credit + link always included
 */

import Anthropic from '@anthropic-ai/sdk';
import { RawArticle } from './rss';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RewrittenContent {
  headline: string;    // One punchy sentence headline (max 12 words)
  summary: string;     // 3-4 sentence educational summary
  keyPoints: string[]; // Bullet-point takeaways (max 4)
  callToAction: string;// Soft CTA, e.g. "Read the full story below 👇"
  sourceCredit: string;// e.g. "Source: Cointelegraph — https://..."
  disclaimer: string;  // Standard disclaimer
}

// ─── Anthropic client ────────────────────────────────────────────────────────

function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
  return new Anthropic({ apiKey });
}

// ─── Rewrite function ─────────────────────────────────────────────────────────

/**
 * Uses Claude to rewrite the article into original social-ready content.
 */
export async function rewriteArticle(article: RawArticle): Promise<RewrittenContent> {
  const client = getAnthropicClient();

  const prompt = `
You are a professional crypto content writer for a premium educational social media brand.

Your job is to take the following Cointelegraph article and rewrite it into COMPLETELY ORIGINAL content.
Do NOT copy sentences word-for-word. Summarise, simplify, and educate.

Article Details:
- Title: ${article.title}
- URL: ${article.url}
- Published: ${article.publishedAt.toISOString()}
- Category: ${article.category ?? 'Crypto'}
- Description/Excerpt: ${article.description}

Writing Rules:
1. Write in simple English suitable for beginners (no jargon without explanation)
2. Calm, educational, premium tone — like a knowledgeable friend explaining crypto
3. No hype, no "to the moon", no extreme predictions
4. No financial advice, no "buy/sell this now"
5. No fake claims or exaggerated statements
6. Use emojis naturally (1-2 per section, not spammy)
7. Always credit the original source

Return a JSON object with EXACTLY this structure:
{
  "headline": "A punchy, 10-12 word summary of the story",
  "summary": "3-4 sentences explaining what happened, why it matters, and what it means for everyday crypto users. Write in plain English.",
  "keyPoints": [
    "First important takeaway in one sentence",
    "Second important takeaway in one sentence",
    "Third important takeaway in one sentence"
  ],
  "callToAction": "A soft, non-pushy call to action (e.g. 'Read the full story in the link below 👇')",
  "sourceCredit": "Source: Cointelegraph — ${article.url}",
  "disclaimer": "📌 This is educational content only — not financial advice. Always do your own research before making investment decisions."
}

Return ONLY the JSON object. No extra text. No markdown code blocks.
  `.trim();

  const message = await client.messages.create({
    model: process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('');

  // Parse the JSON response
  try {
    const parsed = JSON.parse(responseText.trim()) as RewrittenContent;

    // Validate required fields
    if (!parsed.headline || !parsed.summary || !parsed.keyPoints) {
      throw new Error('Missing required fields in AI response');
    }

    return parsed;
  } catch (err) {
    throw new Error(
      `Failed to parse AI rewrite response: ${err instanceof Error ? err.message : String(err)}\n\nRaw response: ${responseText}`,
    );
  }
}
