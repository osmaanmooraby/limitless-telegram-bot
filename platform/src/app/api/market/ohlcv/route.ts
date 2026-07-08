import { NextRequest, NextResponse } from 'next/server'
import { fetchOHLCV } from '@/lib/scanner/exchange'
import type { SupportedExchange } from '@/lib/scanner/exchange'

// Generate mock OHLCV data for fallback
function generateMockOHLCV(symbol: string, limit: number) {
  const basePrices: Record<string, number> = {
    'BTC/USDT': 67450, 'ETH/USDT': 3512, 'SOL/USDT': 178, 'BNB/USDT': 612,
    'XRP/USDT': 0.623, 'ADA/USDT': 0.452, 'LINK/USDT': 17.54,
  }
  const base = basePrices[symbol] || 100
  const candles = []
  let price = base * 0.95
  const now = Date.now()
  const interval = 3600000 // 1h in ms

  for (let i = limit; i >= 0; i--) {
    const change = (Math.random() - 0.48) * 0.025
    const open = price
    const close = price * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = base * 1000 * (0.8 + Math.random() * 0.4)
    candles.push({ timestamp: now - i * interval, open, high, low, close, volume })
    price = close
  }
  return candles
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'BTC/USDT'
    const timeframe = searchParams.get('timeframe') || '1h'
    const exchange = (searchParams.get('exchange') || 'binance') as SupportedExchange
    const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 500)

    try {
      const candles = await fetchOHLCV(exchange, symbol, timeframe, limit)
      if (candles.length > 0) {
        return NextResponse.json({ success: true, data: candles })
      }
    } catch { /* fall through to mock */ }

    // Fallback to mock data
    const mock = generateMockOHLCV(symbol, limit)
    return NextResponse.json({ success: true, data: mock, mock: true })
  } catch (error) {
    console.error('OHLCV error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch OHLCV data' }, { status: 500 })
  }
}
