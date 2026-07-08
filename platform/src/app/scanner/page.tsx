'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scan, Play, Square, TrendingUp, TrendingDown, Zap,
  Filter, Crown, ChevronDown, RefreshCw, ArrowUpRight, Minus
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn, formatPrice, getSignalBgColor, getSignalColor, getConfidenceColor, getStrengthLabel, timeAgo } from '@/lib/utils'
import toast from 'react-hot-toast'

const EXCHANGES = ['binance', 'bybit', 'kraken', 'bitget', 'mexc', 'kucoin']
const TIMEFRAMES = ['15m', '1h', '4h', '1d']
const SIGNAL_TYPES = ['All', 'BULLISH_CROSSOVER', 'BEARISH_CROSSOVER', 'BREAKOUT', 'PULLBACK', 'RSI_DIVERGENCE', 'TREND_CONTINUATION']

const TOP_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT',
  'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT', 'DOT/USDT', 'LINK/USDT',
  'MATIC/USDT', 'LTC/USDT', 'UNI/USDT', 'ATOM/USDT', 'NEAR/USDT',
  'APT/USDT', 'OP/USDT', 'ARB/USDT', 'SUI/USDT', 'INJ/USDT',
]

interface ScanResult {
  symbol: string; exchange: string; timeframe: string
  signalType: string; direction: string; confidence: number
  strength: string; currentPrice: number; isVipOnly: boolean
  conditions: string[]; explanation: string
  targetPrice?: number; stopLoss?: number; riskRewardRatio?: number
  indicators: { ema9: number; ema21: number; ema200: number; rsi: number; volumeRatio: number }
  scannedAt: string
}

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<ScanResult[]>([])
  const [config, setConfig] = useState({
    exchanges: ['binance'],
    timeframes: ['1h'],
    minConfidence: 60,
    signalFilter: 'All',
    directionFilter: 'All',
  })
  const [expanded, setExpanded] = useState<string | null>(null)
  const [scannedAt, setScannedAt] = useState<Date | null>(null)

  async function runScan() {
    setScanning(true)
    setResults([])
    const loadingToast = toast.loading('Scanning markets...')

    try {
      const token = localStorage.getItem('auth_token') || ''
      const res = await fetch('/api/scanner/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          exchanges: config.exchanges,
          symbols: TOP_PAIRS,
          timeframes: config.timeframes,
          minConfidence: config.minConfidence,
        }),
      })
      const data = await res.json()
      toast.dismiss(loadingToast)

      if (data.success) {
        setResults(data.data.signals)
        setScannedAt(new Date())
        toast.success(`Found ${data.data.signals.length} signals across ${config.exchanges.length} exchange(s)`)
      } else {
        toast.error(data.error || 'Scan failed')
      }
    } catch (e) {
      toast.dismiss(loadingToast)
      toast.error('Scanner error. Check connection.')
    } finally {
      setScanning(false)
    }
  }

  function toggleExchange(ex: string) {
    setConfig((prev) => ({
      ...prev,
      exchanges: prev.exchanges.includes(ex)
        ? prev.exchanges.filter((e) => e !== ex)
        : [...prev.exchanges, ex],
    }))
  }

  function toggleTimeframe(tf: string) {
    setConfig((prev) => ({
      ...prev,
      timeframes: prev.timeframes.includes(tf)
        ? prev.timeframes.filter((t) => t !== tf)
        : [...prev.timeframes, tf],
    }))
  }

  const filtered = results.filter((r) => {
    if (config.signalFilter !== 'All' && r.signalType !== config.signalFilter) return false
    if (config.directionFilter !== 'All' && r.direction !== config.directionFilter) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-3">
              <Scan className="w-6 h-6 text-gold-400" />
              Market Scanner
            </h1>
            <p className="text-white/40 text-sm mt-0.5">
              EMA confluence detection across multiple exchanges and timeframes
            </p>
          </div>
          {scannedAt && (
            <span className="text-xs text-white/30 font-mono">
              Last scan: {timeAgo(scannedAt)}
            </span>
          )}
        </div>

        {/* Config */}
        <div className="glass-card p-5 space-y-5">
          {/* Exchanges */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block font-medium">Exchanges</label>
            <div className="flex flex-wrap gap-2">
              {EXCHANGES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => toggleExchange(ex)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize',
                    config.exchanges.includes(ex)
                      ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                      : 'bg-white/[0.04] text-white/40 border border-white/5 hover:border-white/10'
                  )}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* Timeframes */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider mb-3 block font-medium">Timeframes</label>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  onClick={() => toggleTimeframe(tf)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    config.timeframes.includes(tf)
                      ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                      : 'bg-white/[0.04] text-white/40 border border-white/5 hover:border-white/10'
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Min Confidence + Run */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-white/40 uppercase tracking-wider mb-2 block font-medium">
                Min Confidence: <span className="text-gold-400">{config.minConfidence}%</span>
              </label>
              <input
                type="range"
                min={40}
                max={90}
                step={5}
                value={config.minConfidence}
                onChange={(e) => setConfig((prev) => ({ ...prev, minConfidence: +e.target.value }))}
                className="w-full accent-yellow-500"
              />
            </div>
            <button
              onClick={runScan}
              disabled={scanning || config.exchanges.length === 0 || config.timeframes.length === 0}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all',
                scanning
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'btn-gold'
              )}
            >
              {scanning ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Scanning...</>
              ) : (
                <><Play className="w-4 h-4" /> Run Scanner</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-white/50">
                <Filter className="w-4 h-4" />
                <span>{filtered.length} of {results.length} signals</span>
              </div>
              <div className="flex gap-2 ml-auto">
                {['All', 'BULLISH', 'BEARISH'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setConfig((prev) => ({ ...prev, directionFilter: d }))}
                    className={cn(
                      'px-3 py-1 rounded text-xs font-medium transition-all',
                      config.directionFilter === d
                        ? d === 'BULLISH' ? 'bg-green-500/20 text-green-400'
                          : d === 'BEARISH' ? 'bg-red-500/20 text-red-400'
                          : 'bg-gold-500/15 text-gold-400'
                        : 'bg-white/[0.04] text-white/40 hover:text-white/60'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Signal cards */}
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((result, i) => (
                  <motion.div
                    key={`${result.symbol}-${result.exchange}-${result.timeframe}-${result.signalType}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn('glass-card overflow-hidden border', getSignalBgColor(result.direction))}
                  >
                    {/* Main row */}
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpanded(expanded === `${i}` ? null : `${i}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center shrink-0', getSignalBgColor(result.direction))}>
                          {result.direction === 'BULLISH' ? (
                            <TrendingUp className="w-5 h-5 text-green-400" />
                          ) : result.direction === 'BEARISH' ? (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          ) : (
                            <Minus className="w-5 h-5 text-yellow-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-display font-bold text-base">{result.symbol}</span>
                            <span className={cn('text-xs px-2 py-0.5 rounded font-medium border', getSignalBgColor(result.direction), getSignalColor(result.direction))}>
                              {result.direction}
                            </span>
                            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded font-mono">{result.timeframe}</span>
                            <span className="text-xs text-white/30 capitalize bg-white/5 px-2 py-0.5 rounded">{result.exchange}</span>
                            {result.isVipOnly && (
                              <span className="text-xs bg-gold-500/15 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded flex items-center gap-0.5">
                                <Crown className="w-2.5 h-2.5" /> VIP
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-white/40 mt-1">
                            {result.signalType.replace(/_/g, ' ')} · ${formatPrice(result.currentPrice)}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className={cn('text-xl font-black', getConfidenceColor(result.confidence))}>
                            {result.confidence.toFixed(0)}%
                          </div>
                          <div className="text-xs text-white/30">{getStrengthLabel(result.strength)}</div>
                        </div>

                        <ChevronDown className={cn('w-4 h-4 text-white/30 shrink-0 transition-transform', expanded === `${i}` && 'rotate-180')} />
                      </div>

                      {/* Indicator pills */}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="text-xs bg-black/30 px-2 py-1 rounded font-mono">EMA9 {formatPrice(result.indicators.ema9)}</span>
                        <span className="text-xs bg-black/30 px-2 py-1 rounded font-mono">EMA21 {formatPrice(result.indicators.ema21)}</span>
                        <span className="text-xs bg-black/30 px-2 py-1 rounded font-mono">EMA200 {formatPrice(result.indicators.ema200)}</span>
                        <span className={cn('text-xs px-2 py-1 rounded font-mono',
                          result.indicators.rsi > 70 ? 'bg-red-500/20 text-red-400' :
                          result.indicators.rsi < 30 ? 'bg-green-500/20 text-green-400' :
                          'bg-black/30')}>
                          RSI {result.indicators.rsi.toFixed(1)}
                        </span>
                        <span className={cn('text-xs px-2 py-1 rounded font-mono',
                          result.indicators.volumeRatio > 1.3 ? 'bg-blue-500/20 text-blue-400' : 'bg-black/30')}>
                          Vol {(result.indicators.volumeRatio * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {expanded === `${i}` && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-white/[0.06] pt-4 space-y-4">
                            {/* Conditions */}
                            <div>
                              <h4 className="text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">Confluence Conditions</h4>
                              <div className="space-y-1.5">
                                {result.conditions.map((c, ci) => (
                                  <div key={ci} className="text-sm text-white/70">{c}</div>
                                ))}
                              </div>
                            </div>

                            {/* Educational explanation */}
                            <div className="bg-gold-500/5 border border-gold-500/10 rounded-lg p-4">
                              <h4 className="text-xs text-gold-400 uppercase tracking-wider mb-2 font-medium flex items-center gap-1.5">
                                <Zap className="w-3 h-3" /> Signal Explanation
                              </h4>
                              <p className="text-sm text-white/70 leading-relaxed">{result.explanation}</p>
                            </div>

                            {/* Levels */}
                            {(result.targetPrice || result.stopLoss) && (
                              <div className="grid grid-cols-3 gap-3">
                                {result.targetPrice && (
                                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                                    <div className="text-xs text-green-400 mb-1">Target</div>
                                    <div className="font-bold text-green-400">${formatPrice(result.targetPrice)}</div>
                                  </div>
                                )}
                                {result.stopLoss && (
                                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                                    <div className="text-xs text-red-400 mb-1">Stop Loss</div>
                                    <div className="font-bold text-red-400">${formatPrice(result.stopLoss)}</div>
                                  </div>
                                )}
                                {result.riskRewardRatio && (
                                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                                    <div className="text-xs text-white/40 mb-1">R:R</div>
                                    <div className="font-bold">{result.riskRewardRatio.toFixed(1)}:1</div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!scanning && results.length === 0 && (
          <div className="glass-card p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
              <Scan className="w-8 h-8 text-gold-400" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-2">Ready to Scan</h3>
            <p className="text-white/40 max-w-md mx-auto text-sm leading-relaxed">
              Configure your exchanges and timeframes above, then hit <strong className="text-white">Run Scanner</strong> to
              detect EMA confluence setups across the market.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
