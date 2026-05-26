/**
 * Cron Scanner Route
 * Called by Vercel Cron or an external scheduler every 15 minutes.
 * Runs the full scan and persists signals + sends alerts to subscribed users.
 *
 * Vercel cron.json:
 *   { "crons": [{ "path": "/api/cron/scan", "schedule": "0,15,30,45 * * * *" }] }
 *
 * Secure with CRON_SECRET env var.
 */
import { NextRequest, NextResponse } from 'next/server'
import { runFullScan } from '@/lib/scanner/engine'
import type { SupportedExchange } from '@/lib/scanner/exchange'

export async function GET(request: NextRequest) {
  // Validate cron secret
  const secret = request.headers.get('x-cron-secret') || request.nextUrl.searchParams.get('secret')
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const startedAt = Date.now()

  try {
    // Run the scan on default config
    const results = await runFullScan({
      exchanges: ['binance'] as SupportedExchange[],
      timeframes: ['1h', '4h'],
      minConfidence: 60,
      maxConcurrent: 5,
    })

    let saved = 0
    let alertsSent = 0

    // Persist results and send alerts
    try {
      const { prisma } = await import('@/lib/prisma')

      for (const result of results.slice(0, 30)) {
        try {
          const signal = await prisma.marketSignal.create({
            data: {
              symbol: result.symbol,
              exchange: result.exchange,
              timeframe: result.timeframe,
              signalType: result.signalType as any,
              strength: result.strength as any,
              direction: result.direction,
              confidence: result.confidence,
              currentPrice: result.currentPrice,
              ema9: result.indicators.ema9,
              ema21: result.indicators.ema21,
              ema200: result.indicators.ema200,
              rsi: result.indicators.rsi,
              macdLine: result.indicators.macdLine,
              macdSignal: result.indicators.macdSignal,
              macdHistogram: result.indicators.macdHistogram,
              volume: result.indicators.volume,
              avgVolume: result.indicators.avgVolume,
              volumeRatio: result.indicators.volumeRatio,
              conditions: result.conditions,
              explanation: result.explanation,
              targetPrice: result.targetPrice,
              stopLoss: result.stopLoss,
              riskRewardRatio: result.riskRewardRatio,
              isVipOnly: result.isVipOnly,
            },
          })
          saved++

          // Find users with Telegram alerts for this signal
          if (result.confidence >= 70) {
            const alertUsers = await prisma.user.findMany({
              where: {
                telegramChatId: { not: null },
                plan: { in: ['VIP', 'ENTERPRISE'] },
              },
              select: { telegramChatId: true },
              take: 100,
            })

            if (alertUsers.length > 0) {
              const { broadcastSignalAlert } = await import('@/lib/alerts/telegram')
              const formattedSignal = {
                ...signal,
                conditions: Array.isArray(signal.conditions) ? signal.conditions as string[] : [],
                createdAt: signal.createdAt.toISOString(),
              } as any

              const chatIds = alertUsers
                .map((u) => u.telegramChatId)
                .filter((id): id is string => id !== null)

              await broadcastSignalAlert(formattedSignal, chatIds)
              alertsSent += chatIds.length
            }
          }
        } catch { /* individual signal errors don't abort the run */ }
      }
    } catch {
      // DB not available — scan still ran, just not persisted
    }

    const elapsed = Date.now() - startedAt
    return NextResponse.json({
      success: true,
      data: {
        signalsFound: results.length,
        signalsSaved: saved,
        alertsSent,
        elapsedMs: elapsed,
        ranAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Cron scan error:', error)
    return NextResponse.json({ success: false, error: 'Scan failed' }, { status: 500 })
  }
}
