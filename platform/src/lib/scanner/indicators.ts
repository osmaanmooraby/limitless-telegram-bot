/**
 * Technical Indicators Engine
 * Calculates EMA, RSI, MACD, and volume metrics for confluence analysis
 */

export interface IndicatorResult {
  ema9: number
  ema21: number
  ema200: number
  rsi: number
  macdLine: number
  macdSignal: number
  macdHistogram: number
  avgVolume: number
  volumeRatio: number
  prevEma9: number
  prevEma21: number
  prevRsi: number
  prevMacdHistogram: number
}

/**
 * Calculates Exponential Moving Average
 */
export function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length < period) return []
  const k = 2 / (period + 1)
  const emas: number[] = []
  // Seed with SMA
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
  emas.push(ema)
  for (let i = period; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k)
    emas.push(ema)
  }
  return emas
}

/**
 * Calculates RSI (Relative Strength Index)
 */
export function calculateRSI(closes: number[], period: number = 14): number[] {
  if (closes.length < period + 1) return []
  const rsis: number[] = []
  let gains = 0
  let losses = 0

  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1]
    if (change >= 0) gains += change
    else losses -= change
  }

  let avgGain = gains / period
  let avgLoss = losses / period

  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1]
    const gain = change >= 0 ? change : 0
    const loss = change < 0 ? -change : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    rsis.push(100 - 100 / (1 + rs))
  }

  return rsis
}

/**
 * Calculates MACD (Moving Average Convergence Divergence)
 */
export function calculateMACD(
  closes: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macdLine: number[]; signalLine: number[]; histogram: number[] } {
  const fastEMA = calculateEMA(closes, fastPeriod)
  const slowEMA = calculateEMA(closes, slowPeriod)
  const offset = slowPeriod - fastPeriod
  const macdLine: number[] = []

  for (let i = 0; i < slowEMA.length; i++) {
    macdLine.push(fastEMA[i + offset] - slowEMA[i])
  }

  const signalLine = calculateEMA(macdLine, signalPeriod)
  const sigOffset = macdLine.length - signalLine.length
  const histogram: number[] = signalLine.map((sig, i) => macdLine[i + sigOffset] - sig)

  return { macdLine, signalLine, histogram }
}

/**
 * Calculates average volume over a period
 */
export function calculateAvgVolume(volumes: number[], period: number = 20): number {
  if (volumes.length < period) return 0
  const slice = volumes.slice(-period)
  return slice.reduce((a, b) => a + b, 0) / period
}

/**
 * Main function that calculates all indicators from OHLCV data
 */
export function calculateIndicators(
  closes: number[],
  volumes: number[]
): IndicatorResult | null {
  if (closes.length < 210) return null // Need at least 210 candles for EMA200

  const ema9arr = calculateEMA(closes, 9)
  const ema21arr = calculateEMA(closes, 21)
  const ema200arr = calculateEMA(closes, 200)
  const rsiArr = calculateRSI(closes, 14)
  const { macdLine, signalLine, histogram } = calculateMACD(closes)
  const avgVolume = calculateAvgVolume(volumes, 20)

  if (!ema9arr.length || !ema21arr.length || !ema200arr.length || !rsiArr.length || !histogram.length) {
    return null
  }

  const currentVolume = volumes[volumes.length - 1]

  return {
    ema9: ema9arr[ema9arr.length - 1],
    ema21: ema21arr[ema21arr.length - 1],
    ema200: ema200arr[ema200arr.length - 1],
    rsi: rsiArr[rsiArr.length - 1],
    macdLine: macdLine[macdLine.length - 1],
    macdSignal: signalLine[signalLine.length - 1],
    macdHistogram: histogram[histogram.length - 1],
    avgVolume,
    volumeRatio: avgVolume > 0 ? currentVolume / avgVolume : 1,
    prevEma9: ema9arr[ema9arr.length - 2],
    prevEma21: ema21arr[ema21arr.length - 2],
    prevRsi: rsiArr[rsiArr.length - 2],
    prevMacdHistogram: histogram[histogram.length - 2],
  }
}

/**
 * Detects RSI divergence
 */
export function detectRSIDivergence(
  closes: number[],
  rsiValues: number[],
  lookback: number = 10
): 'BULLISH' | 'BEARISH' | 'NONE' {
  if (closes.length < lookback || rsiValues.length < lookback) return 'NONE'

  const recentCloses = closes.slice(-lookback)
  const recentRsi = rsiValues.slice(-lookback)

  const priceHigh = Math.max(...recentCloses.slice(0, -1))
  const currentPrice = recentCloses[recentCloses.length - 1]
  const rsiHigh = Math.max(...recentRsi.slice(0, -1))
  const currentRsi = recentRsi[recentRsi.length - 1]

  const priceLow = Math.min(...recentCloses.slice(0, -1))
  const rsiLow = Math.min(...recentRsi.slice(0, -1))

  // Bearish divergence: price makes higher high, RSI makes lower high
  if (currentPrice > priceHigh && currentRsi < rsiHigh) return 'BEARISH'
  // Bullish divergence: price makes lower low, RSI makes higher low
  if (currentPrice < priceLow && currentRsi > rsiLow) return 'BULLISH'

  return 'NONE'
}

/**
 * Calculates CPR (Central Pivot Range)
 */
export function calculateCPR(high: number, low: number, close: number): {
  pivot: number
  bc: number
  tc: number
  r1: number
  r2: number
  s1: number
  s2: number
} {
  const pivot = (high + low + close) / 3
  const bc = (high + low) / 2
  const tc = pivot - bc + pivot
  const r1 = 2 * pivot - low
  const s1 = 2 * pivot - high
  const r2 = pivot + (high - low)
  const s2 = pivot - (high - low)

  return { pivot, bc, tc: Math.max(bc, tc), r1, r2, s1, s2 }
}
