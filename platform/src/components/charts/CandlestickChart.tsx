'use client'
import { useEffect, useRef, useState } from 'react'
import { useOHLCV } from '@/hooks/useMarketData'
import { cn } from '@/lib/utils'

interface CandlestickChartProps {
  symbol: string
  exchange?: string
  timeframe?: string
  height?: number
  showVolume?: boolean
  className?: string
}

const TIMEFRAMES = ['15m', '1h', '4h', '1d']

export default function CandlestickChart({
  symbol,
  exchange = 'binance',
  timeframe: initialTf = '1h',
  height = 360,
  showVolume = true,
  className,
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const candleSeriesRef = useRef<any>(null)
  const volumeSeriesRef = useRef<any>(null)
  const [timeframe, setTimeframe] = useState(initialTf)
  const [chartReady, setChartReady] = useState(false)

  const { candles, loading } = useOHLCV(symbol, timeframe, exchange, 200)

  // Initialize chart
  useEffect(() => {
    if (!containerRef.current) return
    let chart: any = null

    async function init() {
      const { createChart, CrosshairMode, LineStyle } = await import('lightweight-charts')

      if (!containerRef.current) return
      chart = createChart(containerRef.current, {
        width: containerRef.current.clientWidth,
        height,
        layout: {
          background: { color: 'transparent' },
          textColor: 'rgba(255, 255, 255, 0.5)',
        },
        grid: {
          vertLines: { color: 'rgba(255, 255, 255, 0.04)' },
          horzLines: { color: 'rgba(255, 255, 255, 0.04)' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: { color: 'rgba(212, 175, 55, 0.3)', style: LineStyle.Dashed },
          horzLine: { color: 'rgba(212, 175, 55, 0.3)', style: LineStyle.Dashed },
        },
        rightPriceScale: {
          borderColor: 'rgba(255, 255, 255, 0.06)',
          textColor: 'rgba(255, 255, 255, 0.4)',
        },
        timeScale: {
          borderColor: 'rgba(255, 255, 255, 0.06)',
          timeVisible: true,
          secondsVisible: false,
        },
      })

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderUpColor: '#22c55e',
        borderDownColor: '#ef4444',
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      })

      if (showVolume) {
        const volumeSeries = chart.addHistogramSeries({
          color: 'rgba(212, 175, 55, 0.2)',
          priceFormat: { type: 'volume' },
          priceScaleId: 'volume',
        })
        chart.priceScale('volume').applyOptions({
          scaleMargins: { top: 0.8, bottom: 0 },
        })
        volumeSeriesRef.current = volumeSeries
      }

      // Handle resize
      const ro = new ResizeObserver(() => {
        if (containerRef.current) {
          chart.applyOptions({ width: containerRef.current.clientWidth })
        }
      })
      if (containerRef.current) ro.observe(containerRef.current)

      chartRef.current = chart
      candleSeriesRef.current = candleSeries
      setChartReady(true)

      return () => { ro.disconnect(); chart?.remove() }
    }

    const cleanup = init()
    return () => { cleanup.then((fn) => fn && fn()) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, showVolume])

  // Update data when candles change
  useEffect(() => {
    if (!chartReady || !candleSeriesRef.current || candles.length === 0) return

    const formatted = candles.map((c) => ({
      time: Math.floor(c.timestamp / 1000) as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))

    candleSeriesRef.current.setData(formatted)

    if (volumeSeriesRef.current && showVolume) {
      const volumeData = candles.map((c) => ({
        time: Math.floor(c.timestamp / 1000) as any,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      }))
      volumeSeriesRef.current.setData(volumeData)
    }

    chartRef.current?.timeScale().fitContent()
  }, [candles, chartReady, showVolume])

  return (
    <div className={cn('relative', className)}>
      {/* Timeframe selector */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-xs text-white/30 mr-2 font-medium">{symbol}</span>
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={cn(
              'px-2.5 py-1 rounded text-xs font-medium transition-all',
              timeframe === tf
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'text-white/30 hover:text-white/60 hover:bg-white/5'
            )}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div className="relative rounded-xl overflow-hidden bg-black/20 border border-white/[0.05]">
        {loading && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#080808]/60 backdrop-blur-sm"
            style={{ height }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin" />
              <span className="text-xs text-white/30">Loading chart…</span>
            </div>
          </div>
        )}
        <div ref={containerRef} style={{ height }} />
      </div>
    </div>
  )
}
