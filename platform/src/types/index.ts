export interface User {
  id: string
  email: string
  username: string
  fullName?: string
  avatarUrl?: string
  role: 'USER' | 'VIP' | 'ADMIN'
  plan: 'FREE' | 'VIP' | 'ENTERPRISE'
  planExpiresAt?: string
  telegramChatId?: string
  createdAt: string
}

export interface MarketSignal {
  id: string
  symbol: string
  exchange: string
  timeframe: string
  signalType: string
  strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG'
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  confidence: number
  currentPrice: number
  ema9?: number
  ema21?: number
  ema200?: number
  rsi?: number
  macdLine?: number
  macdSignal?: number
  macdHistogram?: number
  volume?: number
  avgVolume?: number
  volumeRatio?: number
  conditions: string[]
  explanation: string
  aiCommentary?: string
  targetPrice?: number
  stopLoss?: number
  riskRewardRatio?: number
  isVipOnly: boolean
  createdAt: string
}

export interface MarketTicker {
  symbol: string
  exchange: string
  price: number
  change24h: number
  changePercent24h: number
  high24h: number
  low24h: number
  volume24h: number
  quoteVolume24h: number
  lastUpdated: number
}

export interface OHLCV {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TechnicalIndicators {
  ema9: number
  ema21: number
  ema200: number
  rsi: number
  macdLine: number
  macdSignal: number
  macdHistogram: number
  avgVolume: number
  volumeRatio: number
}

export interface Trade {
  id: string
  userId: string
  symbol: string
  exchange: string
  direction: 'LONG' | 'SHORT'
  status: 'OPEN' | 'CLOSED' | 'CANCELLED'
  entryPrice: number
  exitPrice?: number
  stopLoss?: number
  takeProfit?: number
  quantity: number
  leverage: number
  pnl?: number
  pnlPercent?: number
  fees?: number
  notes?: string
  emotion?: string
  exitEmotion?: string
  tags: string[]
  screenshot?: string
  entryDate: string
  exitDate?: string
  createdAt: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w'
export type Exchange = 'binance' | 'bybit' | 'kraken' | 'bitget' | 'mexc' | 'kucoin'
