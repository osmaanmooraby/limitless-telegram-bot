/**
 * Market Scanner Engine
 * Orchestrates scanning of multiple pairs across exchanges and timeframes
 */

import { fetchOHLCV, DEFAULT_SCAN_PAIRS, SUPPORTED_TIMEFRAMES, SupportedExchange } from './exchange'
import { calculateIndicators } from './indicators'
import {
  detectBullishCrossover,
  detectBearishCrossover,
  detectBreakout,
  detectPullback,
  detectDivergenceSignal,
  detectTrendContinuation,
} from './confluence'
import { calculateRSI } from './indicators'

export interface ScanResult {
  symbol: string
  exchange: string
  timeframe: string
  signalType: string
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  confidence: number
  strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG'
  currentPrice: number
  indicators: {
    ema9: number
    ema21: number
    ema200: number
    rsi: number
    macdLine: number
    macdSignal: number
    macdHistogram: number
    volume: number
    avgVolume: number
    volumeRatio: number
  }
  conditions: string[]
  explanation: string
  targetPrice?: number
  stopLoss?: number
  riskRewardRatio?: number
  isVipOnly: boolean
  scannedAt: Date
}

/**
 * Scan a single symbol on one exchange/timeframe
 */
export async function scanSymbol(
  exchange: SupportedExchange,
  symbol: string,
  timeframe: string,
  minConfidence: number = 55
): Promise<ScanResult[]> {
  const results: ScanResult[] = []

  try {
    const candles = await fetchOHLCV(exchange, symbol, timeframe, 300)
    if (candles.length < 210) return results

    const closes = candles.map((c) => c.close)
    const highs = candles.map((c) => c.high)
    const volumes = candles.map((c) => c.volume)
    const currentPrice = closes[closes.length - 1]
    const currentVolume = volumes[volumes.length - 1]

    const indicators = calculateIndicators(closes, volumes)
    if (!indicators) return results

    const rsiValues = calculateRSI(closes, 14)

    const signalChecks = [
      detectBullishCrossover(indicators, currentPrice, symbol),
      detectBearishCrossover(indicators, currentPrice, symbol),
      detectBreakout(indicators, currentPrice, highs.slice(-20), symbol),
      detectPullback(indicators, currentPrice, symbol),
      detectDivergenceSignal(indicators, closes, rsiValues, symbol),
      detectTrendContinuation(indicators, currentPrice, symbol),
    ]

    for (const result of signalChecks) {
      if (result && result.triggered && result.confidence >= minConfidence) {
        results.push({
          symbol,
          exchange,
          timeframe,
          signalType: result.signalType,
          direction: result.direction,
          confidence: result.confidence,
          strength: result.strength,
          currentPrice,
          indicators: {
            ema9: indicators.ema9,
            ema21: indicators.ema21,
            ema200: indicators.ema200,
            rsi: indicators.rsi,
            macdLine: indicators.macdLine,
            macdSignal: indicators.macdSignal,
            macdHistogram: indicators.macdHistogram,
            volume: currentVolume,
            avgVolume: indicators.avgVolume,
            volumeRatio: indicators.volumeRatio,
          },
          conditions: result.conditions,
          explanation: result.explanation,
          targetPrice: result.targetPrice,
          stopLoss: result.stopLoss,
          riskRewardRatio: result.riskRewardRatio,
          isVipOnly: result.confidence >= 80,
          scannedAt: new Date(),
        })
      }
    }
  } catch (error) {
    console.error(`Scan error for ${exchange}/${symbol}/${timeframe}:`, error)
  }

  return results
}

/**
 * Full market scan across multiple pairs, exchanges, and timeframes
 */
export async function runFullScan(config: {
  exchanges?: SupportedExchange[]
  symbols?: string[]
  timeframes?: string[]
  minConfidence?: number
  maxConcurrent?: number
}): Promise<ScanResult[]> {
  const {
    exchanges = ['binance'],
    symbols = DEFAULT_SCAN_PAIRS.slice(0, 20),
    timeframes = ['1h', '4h'],
    minConfidence = 55,
    maxConcurrent = 5,
  } = config

  const allResults: ScanResult[] = []
  const tasks: Array<() => Promise<ScanResult[]>> = []

  for (const exchange of exchanges) {
    for (const symbol of symbols) {
      for (const timeframe of timeframes) {
        tasks.push(() => scanSymbol(exchange as SupportedExchange, symbol, timeframe, minConfidence))
      }
    }
  }

  // Process in batches to avoid rate limiting
  for (let i = 0; i < tasks.length; i += maxConcurrent) {
    const batch = tasks.slice(i, i + maxConcurrent)
    const batchResults = await Promise.allSettled(batch.map((t) => t()))
    for (const r of batchResults) {
      if (r.status === 'fulfilled') allResults.push(...r.value)
    }
    // Small delay between batches
    if (i + maxConcurrent < tasks.length) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Sort by confidence descending
  return allResults.sort((a, b) => b.confidence - a.confidence)
}
