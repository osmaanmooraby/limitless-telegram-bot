'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen, Plus, TrendingUp, TrendingDown, Target, X,
  BarChart3, Trophy, AlertTriangle, Calendar, DollarSign, Download
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn, formatPrice, formatPercent } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { Trade } from '@/types'

const EMOTIONS = ['Confident', 'Nervous', 'FOMO', 'Calm', 'Greedy', 'Patient', 'Anxious', 'Disciplined']

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [stats, setStats] = useState({ totalTrades: 0, totalPnl: 0, winRate: 0, wins: 0, losses: 0 })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    symbol: 'BTC/USDT', exchange: 'binance', direction: 'LONG', entryPrice: '',
    exitPrice: '', stopLoss: '', takeProfit: '', quantity: '', leverage: '1',
    notes: '', emotion: '', tags: '', entryDate: new Date().toISOString().slice(0, 16),
  })

  async function fetchTrades() {
    const token = localStorage.getItem('auth_token') || ''
    try {
      const res = await fetch('/api/journal', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (data.success) {
        setTrades(data.data.trades)
        setStats(data.data.stats)
      }
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchTrades() }, [])

  function exportToCsv() {
    if (trades.length === 0) { toast.error('No trades to export'); return }
    const headers = ['Symbol', 'Exchange', 'Direction', 'Status', 'Entry Price', 'Exit Price', 'Quantity', 'Leverage', 'P&L', 'P&L %', 'Emotion', 'Notes', 'Entry Date', 'Exit Date']
    const rows = trades.map((t) => [
      t.symbol, t.exchange, t.direction, t.status,
      t.entryPrice, t.exitPrice ?? '', t.quantity, t.leverage,
      t.pnl ?? '', t.pnlPercent ?? '',
      t.emotion ?? '', `"${(t.notes ?? '').replace(/"/g, '""')}"`,
      t.entryDate, t.exitDate ?? ''
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trades_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Trades exported')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('auth_token') || ''
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          entryPrice: parseFloat(form.entryPrice),
          exitPrice: form.exitPrice ? parseFloat(form.exitPrice) : undefined,
          stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : undefined,
          takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : undefined,
          quantity: parseFloat(form.quantity),
          leverage: parseFloat(form.leverage),
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Trade logged!')
        setShowForm(false)
        fetchTrades()
        setForm({ symbol: 'BTC/USDT', exchange: 'binance', direction: 'LONG', entryPrice: '', exitPrice: '', stopLoss: '', takeProfit: '', quantity: '', leverage: '1', notes: '', emotion: '', tags: '', entryDate: new Date().toISOString().slice(0, 16) })
      } else {
        toast.error(data.error || 'Failed to log trade')
      }
    } catch {
      toast.error('Error saving trade')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-gold-400" />
              Trading Journal
            </h1>
            <p className="text-white/40 text-sm mt-0.5">Track trades, emotions, and build data-driven discipline</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCsv}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white glass-card px-3 py-2 hover:bg-white/[0.06] transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
            <button onClick={() => setShowForm(true)} className="btn-gold flex items-center gap-2 text-sm py-2.5 px-4">
              <Plus className="w-4 h-4" />
              Log Trade
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Trades', value: stats.totalTrades, icon: <BarChart3 className="w-4 h-4 text-gold-400" /> },
            { label: 'Win Rate', value: `${stats.winRate.toFixed(1)}%`, icon: <Trophy className="w-4 h-4 text-green-400" />, color: 'text-green-400' },
            { label: 'Total P&L', value: `$${formatPrice(Math.abs(stats.totalPnl))}`, prefix: stats.totalPnl >= 0 ? '+' : '-', icon: <DollarSign className="w-4 h-4" />, color: stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400' },
            { label: 'W/L Ratio', value: `${stats.wins}/${stats.losses}`, icon: <Target className="w-4 h-4 text-blue-400" /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-xs text-white/40">{stat.label}</span>
              </div>
              <div className={cn('font-display text-2xl font-bold', stat.color || 'text-white')}>
                {stat.prefix || ''}{stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Trade Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-elevated gold-border w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl font-bold">Log New Trade</h2>
                  <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Symbol *</label>
                      <input value={form.symbol} onChange={(e) => setForm((p) => ({ ...p, symbol: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
                        placeholder="BTC/USDT" required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Exchange *</label>
                      <select value={form.exchange} onChange={(e) => setForm((p) => ({ ...p, exchange: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40">
                        {['binance', 'bybit', 'kraken', 'bitget', 'mexc', 'kucoin'].map((ex) => (
                          <option key={ex} value={ex} className="bg-zinc-900 capitalize">{ex}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Direction *</label>
                    <div className="flex gap-3">
                      {(['LONG', 'SHORT'] as const).map((d) => (
                        <button key={d} type="button" onClick={() => setForm((p) => ({ ...p, direction: d }))}
                          className={cn('flex-1 py-2 rounded-lg text-sm font-semibold border transition-all flex items-center justify-center gap-2',
                            form.direction === d
                              ? d === 'LONG' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-white/5 text-white/40 border-white/10')}>
                          {d === 'LONG' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Entry Price *</label>
                      <input type="number" step="any" value={form.entryPrice} onChange={(e) => setForm((p) => ({ ...p, entryPrice: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
                        placeholder="0.00" required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Exit Price (optional)</label>
                      <input type="number" step="any" value={form.exitPrice} onChange={(e) => setForm((p) => ({ ...p, exitPrice: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
                        placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Stop Loss</label>
                      <input type="number" step="any" value={form.stopLoss} onChange={(e) => setForm((p) => ({ ...p, stopLoss: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
                        placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Take Profit</label>
                      <input type="number" step="any" value={form.takeProfit} onChange={(e) => setForm((p) => ({ ...p, takeProfit: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
                        placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Quantity *</label>
                      <input type="number" step="any" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
                        placeholder="0.00" required />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1.5">Leverage</label>
                      <input type="number" min="1" value={form.leverage} onChange={(e) => setForm((p) => ({ ...p, leverage: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40"
                        placeholder="1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Pre-Trade Emotion</label>
                    <div className="flex flex-wrap gap-2">
                      {EMOTIONS.map((em) => (
                        <button key={em} type="button" onClick={() => setForm((p) => ({ ...p, emotion: p.emotion === em ? '' : em }))}
                          className={cn('px-2.5 py-1 rounded text-xs font-medium transition-all border',
                            form.emotion === em ? 'bg-gold-500/20 text-gold-400 border-gold-500/30' : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60')}>
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Entry Date *</label>
                    <input type="datetime-local" value={form.entryDate} onChange={(e) => setForm((p) => ({ ...p, entryDate: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40" required />
                  </div>

                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">Notes</label>
                    <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-500/40 resize-none"
                      rows={3} placeholder="Why did you take this trade? What was your thesis?" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost flex-1 py-2.5">Cancel</button>
                    <button type="submit" className="btn-gold flex-1 py-2.5">Save Trade</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* Trade List */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-400" />
              Trade History ({stats.totalTrades})
            </h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-white/30">Loading trades...</div>
          ) : trades.length === 0 ? (
            <div className="p-16 text-center">
              <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No trades logged yet</h3>
              <p className="text-white/40 text-sm mb-4">Start tracking your trades to build insights and improve your edge.</p>
              <button onClick={() => setShowForm(true)} className="btn-gold text-sm py-2.5 px-5 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Log First Trade
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-white/30 border-b border-white/5">
                    <th className="text-left px-4 py-3">Symbol</th>
                    <th className="text-left px-4 py-3">Direction</th>
                    <th className="text-right px-4 py-3">Entry</th>
                    <th className="text-right px-4 py-3">Exit</th>
                    <th className="text-right px-4 py-3">P&L</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Emotion</th>
                    <th className="text-left px-4 py-3 hidden lg:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{trade.symbol}</div>
                        <div className="text-xs text-white/30 capitalize">{trade.exchange}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded',
                          trade.direction === 'LONG' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')}>
                          {trade.direction === 'LONG' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {trade.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-sm">${formatPrice(trade.entryPrice)}</td>
                      <td className="px-4 py-3 text-right font-mono text-sm">
                        {trade.exitPrice ? `$${formatPrice(trade.exitPrice)}` : <span className="text-white/30">—</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {trade.pnl !== undefined && trade.pnl !== null ? (
                          <div className={cn('font-semibold text-sm', trade.pnl >= 0 ? 'text-green-400' : 'text-red-400')}>
                            {trade.pnl >= 0 ? '+' : ''}${formatPrice(Math.abs(trade.pnl))}
                          </div>
                        ) : <span className="text-white/30 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-white/40">{trade.emotion || '—'}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={cn('text-xs px-2 py-0.5 rounded',
                          trade.status === 'OPEN' ? 'bg-blue-500/15 text-blue-400' :
                          trade.status === 'CLOSED' ? 'bg-white/10 text-white/50' :
                          'bg-red-500/15 text-red-400')}>
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
