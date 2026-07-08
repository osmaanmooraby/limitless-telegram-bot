import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { runFullScan } from '@/lib/scanner/engine'
import type { SupportedExchange } from '@/lib/scanner/exchange'

export async function POST(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const isVIP = payload.plan === 'VIP' || payload.plan === 'ENTERPRISE' || payload.role === 'ADMIN'

    const body = await request.json().catch(() => ({}))
    const {
      exchanges = ['binance'],
      symbols,
      timeframes = ['1h', '4h'],
      minConfidence = isVIP ? 55 : 65,
    } = body

    // Limit free users
    const maxSymbols = isVIP ? 50 : 10
    const allowedTimeframes = isVIP ? timeframes : timeframes.slice(0, 1)

    const results = await runFullScan({
      exchanges: exchanges as SupportedExchange[],
      symbols: symbols?.slice(0, maxSymbols),
      timeframes: allowedTimeframes,
      minConfidence,
      maxConcurrent: isVIP ? 8 : 3,
    })

    // Persist to DB if available
    try {
      const { prisma } = await import('@/lib/prisma')
      for (const result of results.slice(0, 20)) {
        await prisma.marketSignal.upsert({
          where: {
            id: `${result.symbol}-${result.exchange}-${result.timeframe}-${result.signalType}-${Date.now()}`,
          },
          update: {},
          create: {
            id: `${result.symbol}-${result.exchange}-${result.timeframe}-${result.signalType}-${Date.now()}`,
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
        }).catch(() => null) // Ignore individual upsert errors
      }
    } catch {
      // DB not available, continue
    }

    const filtered = isVIP ? results : results.filter((r) => !r.isVipOnly)

    return NextResponse.json({
      success: true,
      data: {
        signals: filtered,
        total: filtered.length,
        scannedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Scanner run error:', error)
    return NextResponse.json({ success: false, error: 'Scanner failed' }, { status: 500 })
  }
}
