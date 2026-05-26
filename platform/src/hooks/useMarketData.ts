'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { MarketTicker, MarketSignal, OHLCV } from '@/types'

export function useMarketTickers(
  symbols: string[] = ['BTC/USDT', 'ETH/USDT'],
  refreshMs = 12000
) {
  const [tickers, setTickers] = useState<MarketTicker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const symbolKey = symbols.join(',')

  const fetch_ = useCallback(async () => {
    try {
      const params = symbols.map((s) => `symbols=${encodeURIComponent(s)}`).join('&')
      const res = await fetch(`/api/market/tickers?${params}`)
      const data = await res.json()
      if (data.success) { setTickers(data.data); setError(null) }
    } catch { setError('Failed to fetch tickers') }
    finally { setLoading(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolKey])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, refreshMs)
    return () => clearInterval(id)
  }, [fetch_, refreshMs])

  return { tickers, loading, error, refetch: fetch_ }
}

export function useOHLCV(
  symbol: string,
  timeframe: string = '1h',
  exchange: string = 'binance',
  limit: number = 200
) {
  const [candles, setCandles] = useState<OHLCV[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ symbol, timeframe, exchange, limit: String(limit) })
        const res = await fetch(`/api/market/ohlcv?${params}`)
        const data = await res.json()
        if (!cancelled && data.success) setCandles(data.data)
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [symbol, timeframe, exchange, limit])

  return { candles, loading }
}

export function useSignals(
  filters?: { exchange?: string; timeframe?: string; direction?: string; limit?: number },
  refreshMs = 30000
) {
  const [signals, setSignals] = useState<MarketSignal[]>([])
  const [loading, setLoading] = useState(true)
  const filterKey = JSON.stringify(filters)

  const fetch_ = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters?.exchange) params.set('exchange', filters.exchange)
      if (filters?.timeframe) params.set('timeframe', filters.timeframe)
      if (filters?.direction) params.set('direction', filters.direction)
      if (filters?.limit) params.set('limit', String(filters.limit))

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''
      const res = await fetch(`/api/signals?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      const data = await res.json()
      if (data.success) setSignals(data.data)
    } catch { /* ignore */ }
    finally { setLoading(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, refreshMs)
    return () => clearInterval(id)
  }, [fetch_, refreshMs])

  return { signals, loading, refetch: fetch_ }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unread, setUnread] = useState(0)

  const fetch_ = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''
    if (!token) return
    try {
      const res = await fetch('/api/user/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data)
        setUnread(data.data.filter((n: any) => !n.isRead).length)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetch_()
    const id = setInterval(fetch_, 60000)
    return () => clearInterval(id)
  }, [fetch_])

  const markRead = useCallback(async (id?: string) => {
    const token = localStorage.getItem('auth_token') || ''
    await fetch('/api/user/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id }),
    }).catch(() => null)
    fetch_()
  }, [fetch_])

  return { notifications, unread, markRead, refetch: fetch_ }
}
