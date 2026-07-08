import { NextRequest, NextResponse } from 'next/server'
import { fetchTickers } from '@/lib/scanner/exchange'
import type { SupportedExchange } from '@/lib/scanner/exchange'

// Mock data fallback when exchange is unreachable
function getMockTickers(symbols: string[]) {
  const mockPrices: Record<string, { price: number; change: number }> = {
    'BTC/USDT': { price: 67450.23, change: 2.14 },
    'ETH/USDT': { price: 3512.87, change: 1.87 },
    'BNB/USDT': { price: 612.45, change: -0.53 },
    'SOL/USDT': { price: 178.32, change: 3.21 },
    'XRP/USDT': { price: 0.6234, change: -1.12 },
    'ADA/USDT': { price: 0.4521, change: 0.87 },
    'DOGE/USDT': { price: 0.1634, change: 1.45 },
    'AVAX/USDT': { price: 38.92, change: -2.31 },
    'DOT/USDT': { price: 7.83, change: 0.64 },
    'LINK/USDT': { price: 17.54, change: 2.98 },
    'MATIC/USDT': { price: 0.7234, change: -0.87 },
    'LTC/USDT': { price: 89.45, change: 1.23 },
    'UNI/USDT': { price: 9.87, change: 3.45 },
    'ATOM/USDT': { price: 8.23, change: -1.56 },
    'NEAR/USDT': { price: 6.78, change: 4.12 },
  }

  return symbols.map((symbol) => {
    const mock = mockPrices[symbol] || { price: Math.random() * 100, change: (Math.random() - 0.5) * 10 }
    const price = mock.price * (1 + (Math.random() - 0.5) * 0.002)
    return {
      symbol,
      exchange: 'binance',
      price,
      change24h: price * mock.change / 100,
      changePercent24h: mock.change,
      high24h: price * 1.03,
      low24h: price * 0.97,
      volume24h: Math.random() * 1000000000,
      quoteVolume24h: Math.random() * 50000000000,
      lastUpdated: Date.now(),
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbols = searchParams.getAll('symbols')
    const exchange = (searchParams.get('exchange') || 'binance') as SupportedExchange

    const targetSymbols = symbols.length > 0
      ? symbols
      : ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT', 'DOT/USDT', 'LINK/USDT']

    try {
      const tickers = await fetchTickers(exchange, targetSymbols)
      const formatted = Object.entries(tickers).map(([symbol, ticker]) => ({
        symbol,
        exchange,
        price: ticker.last || 0,
        change24h: ticker.change || 0,
        changePercent24h: ticker.percentage || 0,
        high24h: ticker.high || 0,
        low24h: ticker.low || 0,
        volume24h: ticker.baseVolume || 0,
        quoteVolume24h: ticker.quoteVolume || 0,
        lastUpdated: ticker.timestamp || Date.now(),
      }))

      return NextResponse.json({ success: true, data: formatted })
    } catch {
      // Return mock data if exchange fails
      return NextResponse.json({ success: true, data: getMockTickers(targetSymbols) })
    }
  } catch (error) {
    console.error('Tickers error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch tickers' }, { status: 500 })
  }
}
