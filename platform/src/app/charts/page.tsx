'use client'
import { useState } from 'react'
import { BarChart3, Plus, X, Star } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CandlestickChart from '@/components/charts/CandlestickChart'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const DEFAULT_PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT']
const ALL_PAIRS = [
  'BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT',
  'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT', 'DOT/USDT', 'LINK/USDT',
  'MATIC/USDT', 'LTC/USDT', 'UNI/USDT', 'NEAR/USDT', 'OP/USDT',
  'ARB/USDT', 'APT/USDT', 'SUI/USDT', 'INJ/USDT', 'SEI/USDT',
]

export default function ChartsPage() {
  const [activePair, setActivePair] = useState('BTC/USDT')
  const [watchlist, setWatchlist] = useState(DEFAULT_PAIRS)
  const [exchange, setExchange] = useState('binance')
  const [addInput, setAddInput] = useState('')
  const [showAddPanel, setShowAddPanel] = useState(false)

  function addToWatchlist(symbol: string) {
    if (watchlist.includes(symbol)) { toast.error('Already in list'); return }
    if (watchlist.length >= 8) { toast.error('Max 8 charts'); return }
    setWatchlist((prev) => [...prev, symbol])
    toast.success(`Added ${symbol}`)
    setAddInput('')
  }

  function removeFromWatchlist(symbol: string) {
    setWatchlist((prev) => prev.filter((s) => s !== symbol))
    if (activePair === symbol) setActivePair(watchlist[0] || 'BTC/USDT')
  }

  const filteredPairs = ALL_PAIRS.filter((p) =>
    p.toLowerCase().includes(addInput.toLowerCase()) && !watchlist.includes(p)
  )

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-gold-400" />
              Charts
            </h1>
            <p className="text-white/40 text-sm mt-0.5">Live TradingView-powered candlestick charts</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              {['binance', 'bybit', 'kraken', 'bitget', 'mexc', 'kucoin'].map((ex) => (
                <option key={ex} value={ex} className="bg-zinc-900 capitalize">{ex}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddPanel(!showAddPanel)}
              className="flex items-center gap-2 btn-gold text-sm py-2 px-4"
            >
              <Plus className="w-4 h-4" /> Add Pair
            </button>
          </div>
        </div>

        {/* Add pair panel */}
        {showAddPanel && (
          <div className="glass-card p-4 gold-border">
            <div className="flex items-center gap-3 mb-3">
              <input
                value={addInput}
                onChange={(e) => setAddInput(e.target.value.toUpperCase())}
                placeholder="Search pairs (e.g. BTC)"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
              />
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredPairs.slice(0, 20).map((p) => (
                <button
                  key={p}
                  onClick={() => addToWatchlist(p)}
                  className="text-xs bg-white/5 hover:bg-gold-500/15 hover:text-gold-400 border border-white/10 hover:border-gold-500/30 px-3 py-1.5 rounded-lg transition-all font-medium"
                >
                  {p.split('/')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pair tabs */}
        <div className="flex gap-1 flex-wrap">
          {watchlist.map((pair) => (
            <div key={pair} className={cn(
              'flex items-center gap-1 rounded-lg border transition-all',
              activePair === pair
                ? 'bg-gold-500/15 border-gold-500/30'
                : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.07]'
            )}>
              <button
                onClick={() => setActivePair(pair)}
                className={cn('px-3 py-2 text-sm font-semibold',
                  activePair === pair ? 'text-gold-400' : 'text-white/60')}
              >
                {pair.split('/')[0]}
              </button>
              {watchlist.length > 1 && (
                <button
                  onClick={() => removeFromWatchlist(pair)}
                  className="pr-2 text-white/20 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Main chart */}
        <div className="glass-card p-5">
          <CandlestickChart
            symbol={activePair}
            exchange={exchange}
            height={450}
            showVolume={true}
          />
        </div>

        {/* Mini charts grid for other watchlist pairs */}
        {watchlist.filter((p) => p !== activePair).length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-white/40 mb-3">Other Watchlist Pairs</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlist.filter((p) => p !== activePair).map((pair) => (
                <div
                  key={pair}
                  className="glass-card p-4 cursor-pointer hover:border-gold-500/20 transition-all"
                  onClick={() => setActivePair(pair)}
                >
                  <CandlestickChart
                    symbol={pair}
                    exchange={exchange}
                    timeframe="1h"
                    height={180}
                    showVolume={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
