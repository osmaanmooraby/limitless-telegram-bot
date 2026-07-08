/**
 * Exchange Integration Layer using CCXT
 * Supports: Binance, Bybit, Kraken, Bitget, MEXC, KuCoin
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const ccxt = require('ccxt')
import type { OHLCV } from '@/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exchangeInstances: Record<string, any> = {}

export type SupportedExchange = 'binance' | 'bybit' | 'kraken' | 'bitget' | 'mexc' | 'kucoin'

const EXCHANGE_CONFIG: Record<SupportedExchange, { id: string; options?: Record<string, unknown> }> = {
  binance: { id: 'binance', options: { defaultType: 'spot' } },
  bybit: { id: 'bybit', options: { defaultType: 'spot' } },
  kraken: { id: 'kraken' },
  bitget: { id: 'bitget', options: { defaultType: 'spot' } },
  mexc: { id: 'mexc', options: { defaultType: 'spot' } },
  kucoin: { id: 'kucoin' },
}

export function getExchange(exchangeId: SupportedExchange, apiKey?: string, secret?: string, password?: string): any {
  const cacheKey = apiKey ? `${exchangeId}-${apiKey.slice(0, 8)}` : exchangeId

  if (!exchangeInstances[cacheKey]) {
    const config = EXCHANGE_CONFIG[exchangeId]
    const ExchangeClass = ccxt[config.id]

    if (!ExchangeClass) {
      throw new Error(`Exchange ${exchangeId} not supported`)
    }

    exchangeInstances[cacheKey] = new ExchangeClass({
      apiKey: apiKey || '',
      secret: secret || '',
      password: password || '',
      enableRateLimit: true,
      ...config.options,
    })
  }

  return exchangeInstances[cacheKey]
}

export function getPublicExchange(exchangeId: SupportedExchange): any {
  return getExchange(exchangeId)
}

/**
 * Fetch OHLCV candlestick data
 */
export async function fetchOHLCV(
  exchangeId: SupportedExchange,
  symbol: string,
  timeframe: string = '1h',
  limit: number = 300
): Promise<OHLCV[]> {
  try {
    const exchange = getPublicExchange(exchangeId)
    await exchange.loadMarkets()
    const raw = await exchange.fetchOHLCV(symbol, timeframe, undefined, limit)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return raw.map((candle: any[]) => ({
      timestamp: candle[0] as number,
      open: candle[1] as number,
      high: candle[2] as number,
      low: candle[3] as number,
      close: candle[4] as number,
      volume: candle[5] as number,
    }))
  } catch (error) {
    console.error(`fetchOHLCV error for ${exchangeId}/${symbol}:`, error)
    return []
  }
}

/**
 * Fetch current ticker data
 */
export async function fetchTicker(
  exchangeId: SupportedExchange,
  symbol: string
): Promise<any | null> {
  try {
    const exchange = getPublicExchange(exchangeId)
    return await exchange.fetchTicker(symbol)
  } catch (error) {
    console.error(`fetchTicker error for ${exchangeId}/${symbol}:`, error)
    return null
  }
}

/**
 * Fetch multiple tickers efficiently
 */
export async function fetchTickers(
  exchangeId: SupportedExchange,
  symbols: string[]
): Promise<Record<string, any>> {
  try {
    const exchange = getPublicExchange(exchangeId)
    const tickers = await exchange.fetchTickers(symbols)
    return tickers
  } catch {
    // Fallback: fetch individually
    const results: Record<string, any> = {}
    await Promise.allSettled(
      symbols.map(async (symbol) => {
        const ticker = await fetchTicker(exchangeId, symbol)
        if (ticker) results[symbol] = ticker
      })
    )
    return results
  }
}

/**
 * Fetch top trading pairs by volume
 */
export async function fetchTopPairs(
  exchangeId: SupportedExchange,
  quoteCurrency: string = 'USDT',
  limit: number = 50
): Promise<string[]> {
  try {
    const exchange = getPublicExchange(exchangeId)
    await exchange.loadMarkets()

    const tickers = await exchange.fetchTickers()
    const pairs = Object.entries(tickers)
      .filter(([sym]) => sym.endsWith(`/${quoteCurrency}`))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort(([, a], [, b]) => ((b as any).quoteVolume || 0) - ((a as any).quoteVolume || 0))
      .slice(0, limit)
      .map(([sym]) => sym)

    return pairs
  } catch (error) {
    console.error(`fetchTopPairs error for ${exchangeId}:`, error)
    return DEFAULT_SCAN_PAIRS
  }
}

export const DEFAULT_SCAN_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT',
  'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT', 'SHIB/USDT', 'DOT/USDT',
  'LINK/USDT', 'MATIC/USDT', 'LTC/USDT', 'UNI/USDT', 'ATOM/USDT',
  'ETC/USDT', 'XLM/USDT', 'NEAR/USDT', 'APT/USDT', 'OP/USDT',
]

export const SUPPORTED_TIMEFRAMES = ['15m', '1h', '4h', '1d']

export const SUPPORTED_EXCHANGES: SupportedExchange[] = [
  'binance', 'bybit', 'kraken', 'bitget', 'mexc', 'kucoin'
]
