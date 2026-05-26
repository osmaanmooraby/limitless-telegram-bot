'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Zap, TrendingUp, TrendingDown, Crown, Filter, RefreshCw,
  ChevronDown, Minus, BookOpen, Target, Shield
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn, formatPrice, getSignalBgColor, getSignalColor, getConfidenceColor, getStrengthLabel, timeAgo } from '@/lib/utils'
import type { MarketSignal } from '@/types'

const TIMEFRAMES = ['All', '15m', '1h', '4h', '1d']
const EXCHANGES = ['All', 'binance', 'bybit', 'kraken', 'bitget', 'mexc', 'kucoin']

export default function SignalsPage() {
  const [signals, setSignals] = useState<MarketSignal[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filters, setFilters] = useState({ direction: 'All', timeframe: 'All', exchange: 'All' })

  async function fetchSignals() {
    setLoading(true)
    const params = new URLSearchParams({ limit: '50' })
    if (filters.direction !== 'All') params.set('direction', filters.direction)
    if (filters.timeframe !== 'All') params.set('timeframe', filters.timeframe)
    if (filters.exchange !== 'All') params.set('exchange', filters.exchange)

    try {
      const res = await fetch(`/api/signals?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}` }
      })
      const data = await res.json()
      if (data.success) setSignals(data.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchSignals() }, [filters])

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-3">
              <Zap className="w-6 h-6 text-gold-400" />
              Signal Feed
            </h1>
            <p className="text-white/40 text-sm mt-0.5">All confluence signals with educational explanations</p>
          </div>
          <button onClick={fetchSignals} className="flex items-center gap-2 text-sm text-white/50 hover:text-white glass-card px-3 py-2">
            <RefreshCw className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/30" />
            <span className="text-xs text-white/40 font-medium">FILTER BY:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', 'BULLISH', 'BEARISH'].map((d) => (
              <button
                key={d}
                onClick={() => setFilters((p) => ({ ...p, direction: d }))}
                className={cn(
                  'px-3 py-1 rounded text-xs font-medium transition-all',
                  filters.direction === d
                    ? d === 'BULLISH' ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : d === 'BEARISH' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                    : 'bg-white/[0.04] text-white/40 border border-white/5 hover:text-white/60'
                )}
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setFilters((p) => ({ ...p, timeframe: tf }))}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium transition-all',
                  filters.timeframe === tf
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                    : 'bg-white/[0.04] text-white/40 border border-white/5 hover:text-white/60'
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Signals */}
        <div className="space-y-3">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/4" />
                    <div className="h-3 bg-white/5 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))
          ) : signals.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Zap className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No signals yet</h3>
              <p className="text-white/40 text-sm">Run the scanner to generate new signals</p>
              <a href="/scanner" className="btn-gold inline-flex items-center gap-2 mt-4 text-sm py-2.5 px-5">
                Open Scanner
              </a>
            </div>
          ) : signals.map((signal, i) => (
            <motion.div
              key={signal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn('glass-card overflow-hidden border', getSignalBgColor(signal.direction))}
            >
              {/* Header */}
              <div
                className="p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(expanded === signal.id ? null : signal.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border', getSignalBgColor(signal.direction))}>
                    {signal.direction === 'BULLISH' ? <TrendingUp className="w-6 h-6 text-green-400" />
                      : signal.direction === 'BEARISH' ? <TrendingDown className="w-6 h-6 text-red-400" />
                      : <Minus className="w-6 h-6 text-yellow-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-display font-bold text-lg">{signal.symbol}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-md font-semibold border', getSignalBgColor(signal.direction), getSignalColor(signal.direction))}>
                        {signal.direction}
                      </span>
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded font-mono">{signal.timeframe}</span>
                      <span className="text-xs text-white/30 capitalize">{signal.exchange}</span>
                      {signal.isVipOnly && (
                        <span className="text-xs bg-gold-500/15 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" /> VIP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/50">
                      <span className="font-mono">${formatPrice(signal.currentPrice)}</span>
                      <span className="text-white/20">·</span>
                      <span>{signal.signalType.replace(/_/g, ' ')}</span>
                      <span className="text-white/20">·</span>
                      <span>{getStrengthLabel(signal.strength)}</span>
                      <span className="text-white/20">·</span>
                      <span>{timeAgo(signal.createdAt)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <div>
                      <div className={cn('text-2xl font-black', getConfidenceColor(signal.confidence))}>
                        {signal.confidence.toFixed(0)}%
                      </div>
                      <div className="text-xs text-white/30">confidence</div>
                    </div>
                    <ChevronDown className={cn('w-4 h-4 text-white/30 transition-transform', expanded === signal.id && 'rotate-180')} />
                  </div>
                </div>

                {/* Brief explanation preview */}
                <p className="mt-3 text-sm text-white/50 leading-relaxed line-clamp-2 ml-16">
                  {signal.explanation}
                </p>
              </div>

              {/* Expanded */}
              {expanded === signal.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="overflow-hidden border-t border-white/[0.06]"
                >
                  <div className="p-5 space-y-5">
                    {/* Conditions */}
                    <div>
                      <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3 font-semibold flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" /> Confluence Conditions
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {signal.conditions.map((c, ci) => (
                          <div key={ci} className="text-sm text-white/70 flex items-start gap-2">
                            {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Full explanation */}
                    <div className="bg-gold-500/5 border border-gold-500/15 rounded-xl p-4">
                      <h4 className="text-xs text-gold-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Educational Explanation
                      </h4>
                      <p className="text-sm text-white/75 leading-relaxed">{signal.explanation}</p>
                    </div>

                    {/* AI Commentary */}
                    {signal.aiCommentary && (
                      <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
                        <h4 className="text-xs text-blue-400 uppercase tracking-wider mb-2 font-semibold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> AI Commentary
                        </h4>
                        <p className="text-sm text-white/70 leading-relaxed">{signal.aiCommentary}</p>
                      </div>
                    )}

                    {/* Levels */}
                    {(signal.targetPrice || signal.stopLoss) && (
                      <div>
                        <h4 className="text-xs text-white/40 uppercase tracking-wider mb-3 font-semibold flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" /> Key Levels
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                          {signal.targetPrice && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                              <div className="text-xs text-green-400/70 mb-1">Take Profit</div>
                              <div className="font-bold text-green-400 text-lg">${formatPrice(signal.targetPrice)}</div>
                            </div>
                          )}
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                            <div className="text-xs text-white/40 mb-1">Current</div>
                            <div className="font-bold text-white text-lg">${formatPrice(signal.currentPrice)}</div>
                          </div>
                          {signal.stopLoss && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
                              <div className="text-xs text-red-400/70 mb-1">Stop Loss</div>
                              <div className="font-bold text-red-400 text-lg">${formatPrice(signal.stopLoss)}</div>
                            </div>
                          )}
                        </div>
                        {signal.riskRewardRatio && (
                          <div className="mt-2 text-center text-sm text-white/50">
                            Risk:Reward = <span className="font-bold text-white">{signal.riskRewardRatio.toFixed(1)}:1</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Indicators */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { label: 'EMA 9', value: signal.ema9 ? `$${formatPrice(signal.ema9)}` : 'N/A' },
                        { label: 'EMA 21', value: signal.ema21 ? `$${formatPrice(signal.ema21)}` : 'N/A' },
                        { label: 'EMA 200', value: signal.ema200 ? `$${formatPrice(signal.ema200)}` : 'N/A' },
                        { label: 'RSI', value: signal.rsi ? signal.rsi.toFixed(1) : 'N/A', color: signal.rsi && signal.rsi > 70 ? 'text-red-400' : signal.rsi && signal.rsi < 30 ? 'text-green-400' : '' },
                        { label: 'MACD', value: signal.macdHistogram ? signal.macdHistogram.toFixed(4) : 'N/A', color: (signal.macdHistogram || 0) > 0 ? 'text-green-400' : 'text-red-400' },
                        { label: 'Vol Ratio', value: signal.volumeRatio ? `${(signal.volumeRatio * 100).toFixed(0)}%` : 'N/A', color: (signal.volumeRatio || 0) > 1.3 ? 'text-blue-400' : '' },
                      ].map((ind) => (
                        <div key={ind.label} className="bg-black/30 rounded-lg p-2 text-center">
                          <div className="text-[10px] text-white/30 mb-1">{ind.label}</div>
                          <div className={cn('text-xs font-mono font-semibold', ind.color || 'text-white/70')}>{ind.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
