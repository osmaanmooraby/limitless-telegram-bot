/**
 * Confluence Signal Engine
 * Detects high-probability setups when multiple conditions align
 */

import { IndicatorResult, detectRSIDivergence } from './indicators'

export interface ConfluenceResult {
  triggered: boolean
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  signalType: string
  confidence: number
  strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG'
  conditions: string[]
  explanation: string
  targetPrice?: number
  stopLoss?: number
  riskRewardRatio?: number
}

function getStrength(confidence: number): 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG' {
  if (confidence >= 85) return 'VERY_STRONG'
  if (confidence >= 70) return 'STRONG'
  if (confidence >= 55) return 'MODERATE'
  return 'WEAK'
}

/**
 * Bullish EMA Crossover Confluence
 * EMA9 crosses above EMA21 with supporting conditions
 */
export function detectBullishCrossover(
  indicators: IndicatorResult,
  currentPrice: number,
  symbol: string
): ConfluenceResult | null {
  const { ema9, ema21, ema200, rsi, macdHistogram, volumeRatio, prevEma9, prevEma21 } = indicators

  // Primary condition: fresh EMA 9/21 bullish crossover
  const isCrossover = prevEma9 <= prevEma21 && ema9 > ema21
  if (!isCrossover) return null

  const conditions: string[] = ['✅ EMA 9 crossed above EMA 21 (bullish crossover)']
  let score = 40 // Base score for crossover

  // Supporting conditions
  if (currentPrice > ema200) {
    conditions.push('✅ Price is above EMA 200 (long-term uptrend)')
    score += 20
  } else {
    conditions.push('⚠️ Price is below EMA 200 (counter-trend signal)')
    score -= 10
  }

  if (rsi > 50 && rsi < 70) {
    conditions.push(`✅ RSI at ${rsi.toFixed(1)} — bullish momentum, not yet overbought`)
    score += 15
  } else if (rsi >= 70) {
    conditions.push(`⚠️ RSI at ${rsi.toFixed(1)} — overbought, caution advised`)
    score -= 5
  } else {
    conditions.push(`⚠️ RSI at ${rsi.toFixed(1)} — weak momentum`)
  }

  if (macdHistogram > 0) {
    conditions.push('✅ MACD histogram positive — bullish momentum confirmed')
    score += 15
  } else {
    conditions.push('⚠️ MACD histogram negative — diverging momentum')
    score -= 5
  }

  if (volumeRatio > 1.3) {
    conditions.push(`✅ Volume ${(volumeRatio * 100).toFixed(0)}% above average — strong participation`)
    score += 10
  } else {
    conditions.push(`⚠️ Volume near average — moderate participation`)
  }

  if (ema9 > ema21 * 1.001) {
    conditions.push('✅ EMA separation widening — momentum accelerating')
    score += 5
  }

  const confidence = Math.min(Math.max(score, 10), 95)

  const explanation =
    `${symbol} is showing bullish momentum. The short-term EMA (9) has just crossed above the medium-term EMA (21), ` +
    `signalling a potential shift in trend direction to the upside. ` +
    (currentPrice > ema200
      ? `The price remains above the long-term trend average (EMA 200), which supports bullish bias. `
      : `Note that the price is below the long-term EMA 200, so this may be a counter-trend bounce. `) +
    (rsi > 50
      ? `RSI above 50 confirms bullish momentum. `
      : `RSI below 50 suggests limited momentum. `) +
    `Look for continuation if price holds above EMA 21.`

  const stopLoss = ema21 * 0.99
  const targetPrice = currentPrice * (1 + (currentPrice - stopLoss) / currentPrice * 2)

  return {
    triggered: confidence >= 45,
    direction: 'BULLISH',
    signalType: 'BULLISH_CROSSOVER',
    confidence,
    strength: getStrength(confidence),
    conditions,
    explanation,
    targetPrice,
    stopLoss,
    riskRewardRatio: (targetPrice - currentPrice) / (currentPrice - stopLoss),
  }
}

/**
 * Bearish EMA Crossover Confluence
 */
export function detectBearishCrossover(
  indicators: IndicatorResult,
  currentPrice: number,
  symbol: string
): ConfluenceResult | null {
  const { ema9, ema21, ema200, rsi, macdHistogram, volumeRatio, prevEma9, prevEma21 } = indicators

  const isCrossover = prevEma9 >= prevEma21 && ema9 < ema21
  if (!isCrossover) return null

  const conditions: string[] = ['✅ EMA 9 crossed below EMA 21 (bearish crossover)']
  let score = 40

  if (currentPrice < ema200) {
    conditions.push('✅ Price is below EMA 200 (long-term downtrend confirmed)')
    score += 20
  } else {
    conditions.push('⚠️ Price above EMA 200 — counter-trend short signal')
    score -= 10
  }

  if (rsi < 50 && rsi > 30) {
    conditions.push(`✅ RSI at ${rsi.toFixed(1)} — bearish momentum, not yet oversold`)
    score += 15
  } else if (rsi <= 30) {
    conditions.push(`⚠️ RSI at ${rsi.toFixed(1)} — oversold, potential bounce risk`)
    score -= 5
  }

  if (macdHistogram < 0) {
    conditions.push('✅ MACD histogram negative — bearish momentum confirmed')
    score += 15
  }

  if (volumeRatio > 1.3) {
    conditions.push(`✅ Volume ${(volumeRatio * 100).toFixed(0)}% above average — sellers dominating`)
    score += 10
  }

  const confidence = Math.min(Math.max(score, 10), 95)

  const explanation =
    `${symbol} is showing bearish momentum. The short-term EMA (9) has crossed below the medium-term EMA (21), ` +
    `indicating a potential downward trend shift. ` +
    (currentPrice < ema200
      ? `Price being below EMA 200 adds conviction to the bearish bias. `
      : `Be cautious — this is a counter-trend signal as price is still above EMA 200. `) +
    `Consider waiting for a retest of the EMA 21 from below before entering short.`

  const stopLoss = ema21 * 1.01
  const targetPrice = currentPrice * (1 - (stopLoss - currentPrice) / currentPrice * 2)

  return {
    triggered: confidence >= 45,
    direction: 'BEARISH',
    signalType: 'BEARISH_CROSSOVER',
    confidence,
    strength: getStrength(confidence),
    conditions,
    explanation,
    targetPrice,
    stopLoss,
    riskRewardRatio: (currentPrice - targetPrice) / (stopLoss - currentPrice),
  }
}

/**
 * Breakout Detection
 */
export function detectBreakout(
  indicators: IndicatorResult,
  currentPrice: number,
  recentHighs: number[],
  symbol: string
): ConfluenceResult | null {
  const { ema9, ema21, ema200, rsi, macdHistogram, volumeRatio } = indicators

  if (!recentHighs.length) return null
  const resistance = Math.max(...recentHighs.slice(-10))
  const isBreakout = currentPrice > resistance * 1.002 // 0.2% above resistance

  if (!isBreakout) return null

  const conditions: string[] = [`✅ Price broke above recent resistance at $${resistance.toFixed(2)}`]
  let score = 35

  if (volumeRatio > 1.5) {
    conditions.push(`✅ High volume breakout — ${(volumeRatio * 100).toFixed(0)}% above average`)
    score += 25
  } else if (volumeRatio > 1.2) {
    conditions.push(`✅ Above average volume — ${(volumeRatio * 100).toFixed(0)}% above average`)
    score += 15
  } else {
    conditions.push('⚠️ Low volume breakout — potential false break, wait for confirmation')
    score -= 10
  }

  if (currentPrice > ema200) {
    conditions.push('✅ Breakout occurring above EMA 200 — high probability setup')
    score += 20
  }

  if (rsi > 50 && rsi < 75) {
    conditions.push(`✅ RSI at ${rsi.toFixed(1)} — momentum supports breakout`)
    score += 10
  }

  if (macdHistogram > 0) {
    conditions.push('✅ MACD momentum positive — supports continued upside')
    score += 10
  }

  const confidence = Math.min(Math.max(score, 10), 95)

  const explanation =
    `${symbol} has broken above a key resistance level at $${resistance.toFixed(2)} with ` +
    (volumeRatio > 1.5 ? 'strong' : 'moderate') + ` volume participation. ` +
    `Breakouts with high volume are more likely to sustain. ` +
    `Watch for a retest of the broken resistance level as new support. ` +
    (volumeRatio < 1.2 ? `Low volume is a warning sign — wait for a second daily close above resistance. ` : '') +
    `Potential targets can be measured using the height of the prior consolidation range.`

  return {
    triggered: confidence >= 50,
    direction: 'BULLISH',
    signalType: 'BREAKOUT',
    confidence,
    strength: getStrength(confidence),
    conditions,
    explanation,
  }
}

/**
 * Pullback to EMA Detection
 */
export function detectPullback(
  indicators: IndicatorResult,
  currentPrice: number,
  symbol: string
): ConfluenceResult | null {
  const { ema9, ema21, ema200, rsi, macdHistogram } = indicators

  // Bullish pullback: uptrend (above EMA200), price retraced to EMA21
  const isBullishTrend = currentPrice > ema200
  const isPulledBackToEMA21 = Math.abs(currentPrice - ema21) / ema21 < 0.005 // within 0.5%
  const isAboveEMA9Before = ema9 > ema21

  if (!isBullishTrend || !isPulledBackToEMA21) return null

  const conditions: string[] = [`✅ Price pulled back to EMA 21 ($${ema21.toFixed(2)}) in an uptrend`]
  let score = 40

  if (currentPrice > ema200) {
    conditions.push('✅ Still above EMA 200 — long-term uptrend intact')
    score += 20
  }

  if (rsi > 40 && rsi < 60) {
    conditions.push(`✅ RSI at ${rsi.toFixed(1)} — reset from overbought, healthy pullback`)
    score += 20
  }

  if (ema9 > ema21) {
    conditions.push('✅ EMA 9 above EMA 21 — short-term structure remains bullish')
    score += 15
  }

  if (macdHistogram > -0.001) {
    conditions.push('✅ MACD near neutral — momentum resetting, not reversing')
    score += 5
  }

  const confidence = Math.min(Math.max(score, 10), 95)

  const explanation =
    `${symbol} is in an established uptrend but has pulled back to test the EMA 21. ` +
    `This is a classic "buy the dip" scenario where the market offers a lower-risk entry opportunity. ` +
    `The price is still above the long-term trend average (EMA 200), which confirms we are buying in the ` +
    `direction of the dominant trend. ` +
    `A hold above EMA 21 suggests buyers are defending the level, which can lead to trend continuation.`

  const stopLoss = ema200 * 0.995
  const targetPrice = currentPrice * 1.04

  return {
    triggered: confidence >= 50,
    direction: 'BULLISH',
    signalType: 'PULLBACK',
    confidence,
    strength: getStrength(confidence),
    conditions,
    explanation,
    targetPrice,
    stopLoss,
    riskRewardRatio: (targetPrice - currentPrice) / (currentPrice - stopLoss),
  }
}

/**
 * RSI Divergence Signal
 */
export function detectDivergenceSignal(
  indicators: IndicatorResult,
  closes: number[],
  rsiValues: number[],
  symbol: string
): ConfluenceResult | null {
  const divergence = detectRSIDivergence(closes, rsiValues)
  if (divergence === 'NONE') return null

  const { ema200, volumeRatio } = indicators
  const currentPrice = closes[closes.length - 1]
  const isBullish = divergence === 'BULLISH'

  const conditions: string[] = [
    `✅ ${isBullish ? 'Bullish' : 'Bearish'} RSI divergence detected — price and RSI moving in opposite directions`
  ]
  let score = 45

  if (volumeRatio > 1.2) {
    conditions.push(`✅ Volume confirmation — ${(volumeRatio * 100).toFixed(0)}% above average`)
    score += 15
  }

  if (isBullish && currentPrice > ema200) {
    conditions.push('✅ Divergence in uptrend zone — high probability reversal')
    score += 20
  } else if (!isBullish && currentPrice < ema200) {
    conditions.push('✅ Divergence in downtrend zone — high probability reversal')
    score += 20
  }

  const confidence = Math.min(Math.max(score, 10), 90)

  const explanation = isBullish
    ? `${symbol} is showing bullish RSI divergence — the price made a lower low, but the RSI made a higher low. ` +
      `This suggests that selling pressure is weakening even as price declines, which often precedes a bullish reversal. ` +
      `Divergence signals require patience and should be combined with a price action trigger (like a bullish candle pattern) before entering.`
    : `${symbol} is showing bearish RSI divergence — the price made a higher high, but RSI made a lower high. ` +
      `This means buying momentum is fading despite price moving up, often signalling an approaching reversal. ` +
      `Wait for a bearish candle confirmation or breakdown below support before shorting.`

  return {
    triggered: confidence >= 50,
    direction: isBullish ? 'BULLISH' : 'BEARISH',
    signalType: 'RSI_DIVERGENCE',
    confidence,
    strength: getStrength(confidence),
    conditions,
    explanation,
  }
}

/**
 * Trend Continuation Signal
 */
export function detectTrendContinuation(
  indicators: IndicatorResult,
  currentPrice: number,
  symbol: string
): ConfluenceResult | null {
  const { ema9, ema21, ema200, rsi, macdHistogram, volumeRatio } = indicators

  const isBullishTrend = currentPrice > ema200 && ema9 > ema21
  const isBearishTrend = currentPrice < ema200 && ema9 < ema21

  if (!isBullishTrend && !isBearishTrend) return null

  const isBullish = isBullishTrend
  const conditions: string[] = []
  let score = 30

  if (isBullish) {
    conditions.push('✅ Price above EMA 200 — long-term uptrend')
    conditions.push('✅ EMA 9 above EMA 21 — short-term uptrend')
    score += 25

    if (rsi > 55 && rsi < 70) {
      conditions.push(`✅ RSI at ${rsi.toFixed(1)} — strong bullish momentum`)
      score += 20
    }
    if (macdHistogram > 0) {
      conditions.push('✅ MACD positive — momentum supports bulls')
      score += 15
    }
    if (volumeRatio > 1.2) {
      conditions.push(`✅ Volume ${(volumeRatio * 100).toFixed(0)}% above average`)
      score += 10
    }
  } else {
    conditions.push('✅ Price below EMA 200 — long-term downtrend')
    conditions.push('✅ EMA 9 below EMA 21 — short-term downtrend')
    score += 25

    if (rsi < 45 && rsi > 30) {
      conditions.push(`✅ RSI at ${rsi.toFixed(1)} — strong bearish momentum`)
      score += 20
    }
    if (macdHistogram < 0) {
      conditions.push('✅ MACD negative — momentum supports bears')
      score += 15
    }
  }

  const confidence = Math.min(Math.max(score, 10), 88)

  const explanation = isBullish
    ? `${symbol} is in a confirmed multi-timeframe uptrend. All major trend indicators align — ` +
      `price is above the long-term EMA 200, the short-term EMA 9 is above EMA 21, and momentum indicators ` +
      `support continued upward movement. In trending markets, the highest probability trades are in the ` +
      `direction of the trend. Consider entering on minor pullbacks to EMA 9 or EMA 21.`
    : `${symbol} is in a confirmed downtrend across multiple indicators. The trend alignment is bearish — ` +
      `price is below EMA 200 and the EMA 9 is below EMA 21. Trading with the trend gives you the best ` +
      `statistical edge. Look for short entries on bounces to the EMA 9 or 21.`

  return {
    triggered: confidence >= 50,
    direction: isBullish ? 'BULLISH' : 'BEARISH',
    signalType: 'TREND_CONTINUATION',
    confidence,
    strength: getStrength(confidence),
    conditions,
    explanation,
  }
}
