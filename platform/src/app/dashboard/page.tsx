'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Zap, Activity, BarChart3,
  ArrowUpRight, ArrowDownRight, Crown, AlertTriangle, Eye,
  RefreshCw, Minus, Sparkles
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn, formatPrice, formatPercent, formatVolume, timeAgo, getSignalBgColor, getSignalColor, getConfidenceColor } from '@/lib/utils'
import type { MarketTicker, MarketSignal } from '@/types'

const COINS = ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT', 'DOT/USDT', 'LINK/USDT']

function FearGreedMeter({ value }: { value: number }) {
  const label = value <= 25 ? 'Extreme Fear' : value <= 40 ? 'Fear' : value <= 55 ? 'Neutral' : value <= 75 ? 'Greed' : 'Extreme Greed'
  const color = value <= 25 ? '#ef4444' : value <= 40 ? '#f97316' : value <= 55 ? '#eab308' : value <= 75 ? '#22c55e' : '#16a34a'

  return (
    <div className="text-center">
      <div className="relative w-32 h-16 mx-auto mb-3 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-8 border-white/5" />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-8 transition-all duration-1000"
          style={{
            borderColor: color,
            clipPath: `polygon(0 50%, 100% 50%, 100% 100%, 0 100%)`,
            transform: `translateX(-50%) rotate(${(value / 100) * 180 - 90}deg)`,
          }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl font-black" style={{ color }}>
          {value}
        </div>
      </div>
      <div className="text-sm font-semibold" style={{ color }}>{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const [tickers, setTickers] = useState<MarketTicker[]>([])
  const [signals, setSignals] = useState<MarketSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [fearGreed, setFearGreed] = useState<{ value: number; classification: string }>({ value: 62, classification: 'Greed' })
  const [marketSentiment, setMarketSentiment] = useState<string>('BULLISH')
  const [aiSummary, setAiSummary] = useState<string>('')
  const [aiLoading, setAiLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  async function fetchData() {
    try {
      const token = localStorage.getItem('auth_token') || ''
      const [tickerRes, signalRes, overviewRes] = await Promise.all([
        fetch(`/api/market/tickers?${COINS.map((c) => `symbols=${encodeURIComponent(c)}`).join('&')}`),
        fetch('/api/signals?limit=6', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/market/overview'),
      ])
      const [tickerData, signalData, overviewData] = await Promise.all([
        tickerRes.json(), signalRes.json(), overviewRes.json(),
      ])
      if (tickerData.success) setTickers(tickerData.data)
      if (signalData.success) setSignals(signalData.data)
      if (overviewData.success) {
        setFearGreed(overviewData.data.fearGreed)
        setMarketSentiment(overviewData.data.marketSentiment)
      }
      setLastUpdate(new Date())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function fetchAiSummary() {
    setAiLoading(true)
    try {
      const token = localStorage.getItem('auth_token') || ''
      const btc = tickers.find((t) => t.symbol === 'BTC/USDT')
      const res = await fetch('/api/ai/commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          type: 'market',
          signals: signals.slice(0, 3),
          btcPrice: btc?.price || 0,
          btcChange: btc?.changePercent24h || 0,
        }),
      })
      const data = await res.json()
      if (data.success && data.data?.summary) {
        setAiSummary(data.data.summary)
      } else if (data.error) {
        setAiSummary(data.error)
      }
    } catch {}
    setAiLoading(false)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  const btc = tickers.find((t) => t.symbol === 'BTC/USDT')
  const eth = tickers.find((t) => t.symbol === 'ETH/USDT')
  const topGainers = [...tickers].sort((a, b) => b.changePercent24h - a.changePercent24h).slice(0, 3)
  const topLosers = [...tickers].sort((a, b) => a.changePercent24h - b.changePercent24h).slice(0, 3)

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Market Intelligence</h1>
            <p className="text-white/40 text-sm mt-0.5">
              Updated {timeAgo(lastUpdate)}
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white glass-card px-3 py-2 hover:bg-white/[0.06] transition-all"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>

        {/* BTC + ETH hero cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {[btc, eth].map((coin, i) => {
            if (!coin) return (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-20 bg-white/5 rounded-lg" />
              </div>
            )
            const isPositive = coin.changePercent24h >= 0
            return (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn('glass-card p-6 hover:bg-white/[0.06] transition-all border', isPositive ? 'border-green-500/10' : 'border-red-500/10')}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="font-display font-bold text-lg">{coin.symbol.split('/')[0]}</div>
                    <div className="text-xs text-white/30">vs USDT · Binance</div>
                  </div>
                  <div className={cn('flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg',
                    isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400')}>
                    {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {formatPercent(coin.changePercent24h)}
                  </div>
                </div>
                <div className="font-display text-3xl font-black mb-3">
                  ${formatPrice(coin.price)}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">24h High</div>
                    <div className="text-sm font-medium text-green-400">${formatPrice(coin.high24h)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">24h Low</div>
                    <div className="text-sm font-medium text-red-400">${formatPrice(coin.low24h)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">Volume</div>
                    <div className="text-sm font-medium">${formatVolume(coin.quoteVolume24h)}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Market grid + Fear&Greed + Signals */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Market Overview */}
          <div className="lg:col-span-2 glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-gold-400" />
                Market Overview
              </h2>
              <span className="text-xs text-white/30 font-mono">{tickers.length} pairs</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-white/30 border-b border-white/5">
                    <th className="text-left px-4 py-3">Pair</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-right px-4 py-3">24h Change</th>
                    <th className="text-right px-4 py-3 hidden sm:table-cell">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array(8).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-white/[0.03] animate-pulse">
                        <td className="px-4 py-3"><div className="h-4 w-20 bg-white/5 rounded" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded ml-auto" /></td>
                        <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded ml-auto" /></td>
                        <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 w-16 bg-white/5 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : tickers.map((t, i) => {
                    const isPos = t.changePercent24h >= 0
                    return (
                      <tr key={t.symbol} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gold-400">
                              {t.symbol.split('/')[0].charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{t.symbol.split('/')[0]}</div>
                              <div className="text-xs text-white/30">USDT</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm font-medium">
                          ${formatPrice(t.price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn('text-sm font-semibold flex items-center justify-end gap-1',
                            isPos ? 'text-green-400' : 'text-red-400')}>
                            {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {formatPercent(t.changePercent24h)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-white/40 hidden sm:table-cell font-mono">
                          ${formatVolume(t.quoteVolume24h)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Fear & Greed */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold-400" />
                Fear & Greed Index
              </h3>
              <FearGreedMeter value={fearGreed.value} />
              <div className="mt-3 text-center text-xs text-white/30">
                Market is in{' '}
                <span className={
                  fearGreed.value <= 25 ? 'text-red-400' :
                  fearGreed.value <= 40 ? 'text-orange-400' :
                  fearGreed.value <= 55 ? 'text-yellow-400' :
                  fearGreed.value <= 75 ? 'text-green-400' : 'text-emerald-400'
                }>
                  {fearGreed.classification}
                </span>{' '}territory
              </div>
              <div className={cn(
                'mt-3 text-center text-xs font-semibold px-3 py-1 rounded-full border',
                marketSentiment === 'BULLISH' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                marketSentiment === 'BEARISH' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
              )}>
                {marketSentiment} MARKET
              </div>

              {/* AI Summary */}
              {aiSummary ? (
                <div className="mt-3 bg-gold-500/5 border border-gold-500/10 rounded-lg p-3">
                  <div className="text-xs text-gold-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Summary
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{aiSummary}</p>
                </div>
              ) : (
                <button
                  onClick={fetchAiSummary}
                  disabled={aiLoading}
                  className="mt-3 w-full text-xs bg-gold-500/10 hover:bg-gold-500/15 text-gold-400 border border-gold-500/20 rounded-lg py-2 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  {aiLoading ? 'Generating...' : 'AI Market Summary'}
                </button>
              )}
            </div>

            {/* Top Movers */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Top Gainers
              </h3>
              <div className="space-y-2">
                {topGainers.map((t) => (
                  <div key={t.symbol} className="flex items-center justify-between">
                    <span className="text-sm">{t.symbol.split('/')[0]}</span>
                    <span className="text-sm font-semibold text-green-400">{formatPercent(t.changePercent24h)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/5 mt-3 pt-3">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  Top Losers
                </h3>
                <div className="space-y-2">
                  {topLosers.map((t) => (
                    <div key={t.symbol} className="flex items-center justify-between">
                      <span className="text-sm">{t.symbol.split('/')[0]}</span>
                      <span className="text-sm font-semibold text-red-400">{formatPercent(t.changePercent24h)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Signals */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-gold-400" />
              Latest Signals
            </h2>
            <a href="/signals" className="text-xs text-gold-400 hover:text-gold-300 transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="p-4 animate-pulse flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : signals.length === 0 ? (
              <div className="p-12 text-center">
                <Zap className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/40">No signals yet. Run the scanner to detect setups.</p>
                <a href="/scanner" className="btn-gold inline-flex items-center gap-2 mt-4 text-sm py-2 px-4">
                  Open Scanner
                </a>
              </div>
            ) : signals.map((signal) => (
              <div key={signal.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', getSignalBgColor(signal.direction))}>
                    {signal.direction === 'BULLISH' ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : signal.direction === 'BEARISH' ? (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    ) : (
                      <Minus className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm">{signal.symbol}</span>
                      <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', getSignalBgColor(signal.direction), getSignalColor(signal.direction))}>
                        {signal.direction}
                      </span>
                      <span className="text-xs text-white/30 font-mono">{signal.timeframe}</span>
                      {signal.isVipOnly && (
                        <span className="text-xs bg-gold-500/15 text-gold-400 border border-gold-500/20 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" /> VIP
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{signal.explanation}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={cn('text-lg font-bold', getConfidenceColor(signal.confidence))}>
                      {signal.confidence.toFixed(0)}%
                    </div>
                    <div className="text-xs text-white/30">{timeAgo(signal.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
