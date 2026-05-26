import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'

// Mock signals for demo when DB is not available
function getMockSignals() {
  return [
    {
      id: '1',
      symbol: 'BTC/USDT',
      exchange: 'binance',
      timeframe: '4h',
      signalType: 'BULLISH_CROSSOVER',
      strength: 'STRONG',
      direction: 'BULLISH',
      confidence: 82,
      currentPrice: 67450.23,
      ema9: 67200.45,
      ema21: 66950.12,
      ema200: 62000.00,
      rsi: 58.4,
      macdLine: 245.32,
      macdSignal: 198.67,
      macdHistogram: 46.65,
      volume: 28500000000,
      avgVolume: 22000000000,
      volumeRatio: 1.30,
      conditions: [
        '✅ EMA 9 crossed above EMA 21 (bullish crossover)',
        '✅ Price is above EMA 200 (long-term uptrend)',
        '✅ RSI at 58.4 — bullish momentum, not yet overbought',
        '✅ MACD histogram positive — bullish momentum confirmed',
        '✅ Volume 130% above average — strong participation',
      ],
      explanation: 'BTC is showing bullish momentum. The short-term EMA (9) has just crossed above the medium-term EMA (21), signalling a potential shift in trend direction to the upside. The price remains above the long-term trend average (EMA 200), which supports bullish bias. RSI above 50 confirms bullish momentum.',
      aiCommentary: 'BTC remains structurally bullish above EMA 200. The fresh EMA 9/21 crossover combined with high volume suggests institutional buyers are stepping in. Next key resistance at $69,000.',
      targetPrice: 70200,
      stopLoss: 65800,
      riskRewardRatio: 2.1,
      isVipOnly: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: '2',
      symbol: 'ETH/USDT',
      exchange: 'binance',
      timeframe: '1h',
      signalType: 'PULLBACK',
      strength: 'STRONG',
      direction: 'BULLISH',
      confidence: 76,
      currentPrice: 3512.87,
      ema9: 3498.23,
      ema21: 3510.45,
      ema200: 3200.00,
      rsi: 51.2,
      macdLine: 12.45,
      macdSignal: 8.92,
      macdHistogram: 3.53,
      volume: 8500000000,
      avgVolume: 7200000000,
      volumeRatio: 1.18,
      conditions: [
        '✅ Price pulled back to EMA 21 ($3,510.45) in an uptrend',
        '✅ Still above EMA 200 — long-term uptrend intact',
        '✅ RSI at 51.2 — reset from overbought, healthy pullback',
        '✅ EMA 9 above EMA 21 — short-term structure remains bullish',
      ],
      explanation: 'ETH is in an established uptrend but has pulled back to test the EMA 21. This is a classic "buy the dip" scenario. The price is still above the long-term trend average (EMA 200), which confirms we are buying in the direction of the dominant trend.',
      aiCommentary: 'ETH showing a healthy pullback to EMA 21 support. This is a textbook buy-the-dip opportunity in a confirmed uptrend. Watch for rejection above $3,500 to confirm bullish continuation.',
      targetPrice: 3650,
      stopLoss: 3380,
      riskRewardRatio: 1.9,
      isVipOnly: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      symbol: 'SOL/USDT',
      exchange: 'binance',
      timeframe: '4h',
      signalType: 'BREAKOUT',
      strength: 'VERY_STRONG',
      direction: 'BULLISH',
      confidence: 88,
      currentPrice: 178.32,
      ema9: 174.56,
      ema21: 171.23,
      ema200: 145.00,
      rsi: 64.7,
      macdLine: 3.21,
      macdSignal: 2.45,
      macdHistogram: 0.76,
      volume: 4200000000,
      avgVolume: 2800000000,
      volumeRatio: 1.50,
      conditions: [
        '✅ Price broke above recent resistance at $175.50',
        '✅ High volume breakout — 150% above average',
        '✅ Breakout occurring above EMA 200 — high probability setup',
        '✅ RSI at 64.7 — momentum supports breakout',
        '✅ MACD positive — supports continued upside',
      ],
      explanation: 'SOL has broken above a key resistance level with strong volume participation. Breakouts with high volume are more likely to sustain. Watch for a retest of the broken resistance level as new support.',
      aiCommentary: 'SOL breaking out with conviction. Volume is 150% above average which adds significant credibility to this move. First target is $185, with potential extension to $195 if momentum holds.',
      targetPrice: 192,
      stopLoss: 168,
      riskRewardRatio: 2.4,
      isVipOnly: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '4',
      symbol: 'LINK/USDT',
      exchange: 'binance',
      timeframe: '1h',
      signalType: 'RSI_DIVERGENCE',
      strength: 'MODERATE',
      direction: 'BULLISH',
      confidence: 67,
      currentPrice: 17.54,
      ema9: 17.21,
      ema21: 17.45,
      ema200: 15.80,
      rsi: 42.3,
      macdLine: -0.12,
      macdSignal: -0.08,
      macdHistogram: -0.04,
      volume: 890000000,
      avgVolume: 750000000,
      volumeRatio: 1.19,
      conditions: [
        '✅ Bullish RSI divergence detected — price and RSI moving in opposite directions',
        '✅ Volume confirmation — 119% above average',
        '✅ Divergence in uptrend zone — high probability reversal',
      ],
      explanation: 'LINK is showing bullish RSI divergence — the price made a lower low, but the RSI made a higher low. This suggests that selling pressure is weakening even as price declines, which often precedes a bullish reversal.',
      isVipOnly: false,
      createdAt: new Date(Date.now() - 5400000).toISOString(),
    },
    {
      id: '5',
      symbol: 'XRP/USDT',
      exchange: 'bybit',
      timeframe: '4h',
      signalType: 'TREND_CONTINUATION',
      strength: 'STRONG',
      direction: 'BEARISH',
      confidence: 73,
      currentPrice: 0.6234,
      ema9: 0.6312,
      ema21: 0.6445,
      ema200: 0.7123,
      rsi: 38.2,
      macdLine: -0.0089,
      macdSignal: -0.0067,
      macdHistogram: -0.0022,
      volume: 3400000000,
      avgVolume: 2900000000,
      volumeRatio: 1.17,
      conditions: [
        '✅ Price below EMA 200 — long-term downtrend',
        '✅ EMA 9 below EMA 21 — short-term downtrend',
        '✅ RSI at 38.2 — strong bearish momentum',
        '✅ MACD negative — momentum supports bears',
      ],
      explanation: 'XRP is in a confirmed downtrend across multiple indicators. The trend alignment is bearish — price is below EMA 200 and the EMA 9 is below EMA 21. Trading with the trend gives you the best statistical edge.',
      isVipOnly: true,
      createdAt: new Date(Date.now() - 10800000).toISOString(),
    },
  ]
}

export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request)
    const { searchParams } = new URL(request.url)

    const exchange = searchParams.get('exchange')
    const timeframe = searchParams.get('timeframe')
    const direction = searchParams.get('direction')
    const limit = parseInt(searchParams.get('limit') || '20')

    const isVIP = payload?.plan === 'VIP' || payload?.plan === 'ENTERPRISE' || payload?.role === 'ADMIN'

    try {
      const { prisma } = await import('@/lib/prisma')
      const where: Record<string, unknown> = {}
      if (exchange) where.exchange = exchange
      if (timeframe) where.timeframe = timeframe
      if (direction) where.direction = direction
      if (!isVIP) where.isVipOnly = false

      const signals = await prisma.marketSignal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      const formatted = signals.map((s: any) => ({
        ...s,
        conditions: Array.isArray(s.conditions) ? s.conditions : JSON.parse(s.conditions as string),
        createdAt: s.createdAt.toISOString(),
      }))

      return NextResponse.json({ success: true, data: formatted })
    } catch {
      // Return mock data if DB unavailable
      let mockSignals = getMockSignals()
      if (!isVIP) mockSignals = mockSignals.filter((s) => !s.isVipOnly)
      if (direction) mockSignals = mockSignals.filter((s) => s.direction === direction)
      if (timeframe) mockSignals = mockSignals.filter((s) => s.timeframe === timeframe)

      return NextResponse.json({ success: true, data: mockSignals.slice(0, limit) })
    }
  } catch (error) {
    console.error('Signals error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch signals' }, { status: 500 })
  }
}
