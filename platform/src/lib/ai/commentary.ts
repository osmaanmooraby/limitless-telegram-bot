/**
 * AI Market Commentary using Anthropic Claude
 * Generates concise, institutional-grade signal analysis
 */

import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

export interface SignalContext {
  symbol: string
  exchange: string
  timeframe: string
  direction: string
  signalType: string
  confidence: number
  currentPrice: number
  ema9: number
  ema21: number
  ema200: number
  rsi: number
  macdHistogram: number
  volumeRatio: number
  conditions: string[]
}

/**
 * Generate AI commentary for a single signal
 */
export async function generateSignalCommentary(ctx: SignalContext): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return generateFallbackCommentary(ctx)
  }

  try {
    const claude = getClient()

    const prompt = `You are a professional crypto market analyst writing a brief, institutional-grade commentary for a trading signal.

Signal Data:
- Pair: ${ctx.symbol} on ${ctx.exchange}
- Timeframe: ${ctx.timeframe}
- Direction: ${ctx.direction}
- Signal Type: ${ctx.signalType.replace(/_/g, ' ')}
- Confidence: ${ctx.confidence.toFixed(0)}%
- Current Price: $${ctx.currentPrice.toFixed(2)}
- EMA 9: $${ctx.ema9.toFixed(2)} | EMA 21: $${ctx.ema21.toFixed(2)} | EMA 200: $${ctx.ema200.toFixed(2)}
- RSI: ${ctx.rsi.toFixed(1)}
- MACD Histogram: ${ctx.macdHistogram > 0 ? 'Positive' : 'Negative'} (${ctx.macdHistogram.toFixed(4)})
- Volume: ${(ctx.volumeRatio * 100).toFixed(0)}% of average

Write a 2-3 sentence institutional commentary. Be direct, factual, and professional.
Mention the key technical context, what it means for price action, and one risk factor.
Do NOT use phrases like "I think" or "you should". Write as if for a Bloomberg terminal brief.`

    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0]
    if (text.type === 'text') return text.text.trim()
    return generateFallbackCommentary(ctx)
  } catch (err) {
    console.error('AI commentary error:', err)
    return generateFallbackCommentary(ctx)
  }
}

/**
 * Generate AI market summary for the dashboard
 */
export async function generateMarketSummary(
  topSignals: SignalContext[],
  btcPrice: number,
  btcChange: number
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY || topSignals.length === 0) {
    return generateFallbackSummary(btcPrice, btcChange)
  }

  try {
    const claude = getClient()
    const bullish = topSignals.filter((s) => s.direction === 'BULLISH').length
    const bearish = topSignals.filter((s) => s.direction === 'BEARISH').length

    const prompt = `You are a crypto market analyst writing a 2-sentence market summary for a trading dashboard.

Current snapshot:
- BTC: $${btcPrice.toFixed(0)} (${btcChange >= 0 ? '+' : ''}${btcChange.toFixed(2)}% 24h)
- Active signals: ${bullish} bullish, ${bearish} bearish across ${topSignals.length} pairs
- Top signal: ${topSignals[0]?.symbol} ${topSignals[0]?.direction} (${topSignals[0]?.confidence.toFixed(0)}% confidence)
- Avg RSI: ${(topSignals.slice(0, 5).reduce((s, sig) => s + sig.rsi, 0) / Math.min(5, topSignals.length)).toFixed(1)}

Write a concise market summary in plain English. No hype, no advice. Just the technical picture.`

    const message = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0]
    if (text.type === 'text') return text.text.trim()
    return generateFallbackSummary(btcPrice, btcChange)
  } catch {
    return generateFallbackSummary(btcPrice, btcChange)
  }
}

function generateFallbackCommentary(ctx: SignalContext): string {
  const priceVsEMA200 = ctx.currentPrice > ctx.ema200 ? 'above' : 'below'
  const momentumStr = ctx.macdHistogram > 0 ? 'positive' : 'negative'
  const volumeStr = ctx.volumeRatio > 1.3 ? 'elevated' : ctx.volumeRatio > 1.0 ? 'average' : 'below-average'

  if (ctx.direction === 'BULLISH') {
    return `${ctx.symbol} trades ${priceVsEMA200} the long-term EMA 200 with ${momentumStr} MACD momentum and ${volumeStr} volume participation (${(ctx.volumeRatio * 100).toFixed(0)}% of avg). ` +
      `RSI at ${ctx.rsi.toFixed(1)} suggests ${ctx.rsi < 70 ? 'room for continuation before overbought territory' : 'caution as momentum is stretched'}. ` +
      `Key support at EMA 21 ($${ctx.ema21.toFixed(2)}) — a close below invalidates the setup.`
  } else {
    return `${ctx.symbol} is trading ${priceVsEMA200} EMA 200 with ${momentumStr} MACD and ${volumeStr} volume. ` +
      `RSI at ${ctx.rsi.toFixed(1)} ${ctx.rsi < 30 ? 'is approaching oversold — potential for a relief bounce' : 'confirms bearish momentum has room to extend'}. ` +
      `EMA 21 ($${ctx.ema21.toFixed(2)}) now acts as overhead resistance.`
  }
}

function generateFallbackSummary(btcPrice: number, btcChange: number): string {
  const trend = btcChange >= 2 ? 'in a bullish day' : btcChange <= -2 ? 'under selling pressure' : 'consolidating'
  return `BTC is ${trend} at $${btcPrice.toLocaleString()}, ${btcChange >= 0 ? 'up' : 'down'} ${Math.abs(btcChange).toFixed(2)}% in the last 24 hours. ` +
    `Monitor EMA confluence setups for high-probability entries — scanner is actively tracking multiple pairs.`
}
