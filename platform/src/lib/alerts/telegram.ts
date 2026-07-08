/**
 * Telegram Alert Service
 * Sends signal notifications via Telegram Bot API
 */

import type { MarketSignal } from '@/types'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

export async function sendTelegramMessage(chatId: string, text: string, parseMode: 'HTML' | 'Markdown' = 'HTML'): Promise<boolean> {
  if (!BOT_TOKEN || !chatId) return false

  try {
    const res = await fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode, disable_web_page_preview: true }),
    })
    const data = await res.json()
    return data.ok === true
  } catch (err) {
    console.error('Telegram send error:', err)
    return false
  }
}

export function formatSignalMessage(signal: MarketSignal): string {
  const directionEmoji = signal.direction === 'BULLISH' ? '🟢' : signal.direction === 'BEARISH' ? '🔴' : '🟡'
  const strengthEmoji = signal.confidence >= 80 ? '🔥' : signal.confidence >= 65 ? '⚡' : '📊'
  const vipTag = signal.isVipOnly ? ' 👑 <b>VIP</b>' : ''

  return `${directionEmoji} <b>${signal.symbol}</b> — ${signal.direction}${vipTag}
${strengthEmoji} Confidence: <b>${signal.confidence.toFixed(0)}%</b> | ${signal.timeframe.toUpperCase()} | ${signal.exchange}

📌 <b>Signal:</b> ${signal.signalType.replace(/_/g, ' ')}
💰 <b>Price:</b> $${formatPrice(signal.currentPrice)}
${signal.targetPrice ? `🎯 <b>Target:</b> $${formatPrice(signal.targetPrice)}` : ''}
${signal.stopLoss ? `🛡 <b>Stop:</b> $${formatPrice(signal.stopLoss)}` : ''}
${signal.riskRewardRatio ? `⚖️ <b>R:R</b> ${signal.riskRewardRatio.toFixed(1)}:1` : ''}

📖 <i>${signal.explanation.substring(0, 200)}${signal.explanation.length > 200 ? '...' : ''}</i>

<a href="https://10xlimitless.com/signals">View Full Analysis →</a>
<b>10X Limitless</b> | Where Real Traders Are Made`
}

export function formatMarketSummaryMessage(summary: string, btcPrice: number, btcChange: number): string {
  const emoji = btcChange >= 0 ? '📈' : '📉'
  return `${emoji} <b>10X Market Update</b>

🪙 BTC: <b>$${btcPrice.toLocaleString()}</b> (${btcChange >= 0 ? '+' : ''}${btcChange.toFixed(2)}%)

${summary}

<a href="https://10xlimitless.com/dashboard">Open Dashboard →</a>`
}

function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (price >= 1) return price.toFixed(2)
  return price.toFixed(6)
}

/**
 * Send a signal alert to a specific Telegram chat
 */
export async function sendSignalAlert(chatId: string, signal: MarketSignal): Promise<boolean> {
  const message = formatSignalMessage(signal)
  return sendTelegramMessage(chatId, message)
}

/**
 * Broadcast a signal to all users who have Telegram alerts enabled
 * In production, this would query the DB for users with active Telegram alert configs
 */
export async function broadcastSignalAlert(signal: MarketSignal, chatIds: string[]): Promise<void> {
  const message = formatSignalMessage(signal)
  await Promise.allSettled(
    chatIds.map((chatId) => sendTelegramMessage(chatId, message))
  )
}
