'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, TrendingDown, Lock, Activity, BarChart3, AlertTriangle } from 'lucide-react'

function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0, duration = 2000 }: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = 0
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (value - start) * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  )
}

function SparklineSVG({ trend }: { trend: 'up' | 'down' }) {
  const points = trend === 'up'
    ? '0,20 8,18 16,22 24,15 32,17 40,12 48,14 56,8 64,10 72,5 80,3'
    : '0,5 8,8 16,3 24,10 32,12 40,15 48,13 56,18 64,16 72,20 80,22'

  return (
    <svg width="80" height="24" viewBox="0 0 80 24" className="mt-2">
      <polyline
        fill="none"
        stroke={trend === 'up' ? '#10B981' : '#EF4444'}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const priceCards = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67240, change: 2.4, trend: 'up' as const },
  { symbol: 'ETH', name: 'Ethereum', price: 3890, change: 1.8, trend: 'up' as const },
  { symbol: 'SOL', name: 'Solana', price: 172, change: 3.1, trend: 'up' as const },
]

function SentimentGauge() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="glass-card rounded-xl p-6 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-gold" size={18} />
        <h4 className="text-sm font-medium text-silver-light uppercase tracking-wider">Market Sentiment</h4>
      </div>
      <div className="relative w-40 h-20 mb-2">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={inView ? { pathLength: 0.68 } : {}}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
          <span className="text-2xl font-bold text-gold-light">68</span>
        </div>
      </div>
      <span className="text-emerald text-sm font-semibold">Greed</span>
    </div>
  )
}

export default function TradingDashboard() {
  const titleRef = useRef<HTMLDivElement>(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-100px' })

  return (
    <section id="trading" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0d0d0d] to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald/3 blur-[200px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-emerald text-sm tracking-[0.3em] uppercase mb-4"
          >
            Live Intelligence
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold gradient-text-gold"
          >
            Trading Intelligence
          </motion.h2>
        </div>

        {/* Row 1: Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {priceCards.map((card, i) => (
            <motion.div
              key={card.symbol}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="glass-card rounded-xl p-6 group hover:gold-glow transition-all duration-500 border border-emerald/10 hover:border-emerald/30"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-lg font-bold text-offwhite">{card.symbol}</span>
                  <span className="text-xs text-silver/60 ml-2">{card.name}</span>
                </div>
                {card.trend === 'up' ? (
                  <TrendingUp className="text-emerald" size={20} />
                ) : (
                  <TrendingDown className="text-red-500" size={20} />
                )}
              </div>
              <div className="text-2xl md:text-3xl font-bold text-offwhite mb-1">
                $<AnimatedNumber value={card.price} decimals={0} />
              </div>
              <div className={`text-sm font-semibold ${card.trend === 'up' ? 'text-emerald' : 'text-red-500'}`}>
                {card.trend === 'up' ? '+' : '-'}{card.change}%
              </div>
              <SparklineSVG trend={card.trend} />
            </motion.div>
          ))}
        </div>

        {/* Row 2: Sentiment, EMA, Fear & Greed */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SentimentGauge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-gold" size={18} />
              <h4 className="text-sm font-medium text-silver-light uppercase tracking-wider">EMA Status</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver/80">20 EMA</span>
                <span className="text-sm font-semibold text-emerald">Above</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver/80">50 EMA</span>
                <span className="text-sm font-semibold text-emerald">Above</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver/80">200 EMA</span>
                <span className="text-sm font-semibold text-emerald">Above</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gold/10">
                <span className="text-xs text-gold font-semibold uppercase tracking-wider">Bullish Alignment</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="text-gold" size={18} />
              <h4 className="text-sm font-medium text-silver-light uppercase tracking-wider">Fear &amp; Greed</h4>
            </div>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-full h-3 rounded-full overflow-hidden bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '68%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #EF4444, #F59E0B, #10B981)',
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between text-xs text-silver/60">
              <span>Extreme Fear</span>
              <span>Extreme Greed</span>
            </div>
            <div className="text-center mt-3">
              <span className="text-3xl font-bold text-emerald">68</span>
              <span className="text-sm text-silver/80 ml-2">Greed</span>
            </div>
          </motion.div>
        </div>

        {/* Row 3: Liquidation Zone & VIP Bias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-xl p-6 border border-red-500/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-400" size={18} />
              <h4 className="text-sm font-medium text-silver-light uppercase tracking-wider">Liquidation Zones</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver/80">Support Zone</span>
                <span className="text-lg font-bold text-red-400">$64,800</span>
              </div>
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver/80">Resistance Zone</span>
                <span className="text-lg font-bold text-emerald">$71,200</span>
              </div>
              <p className="text-xs text-silver/50 mt-2">Key levels where large liquidation clusters are concentrated</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative glass-card rounded-xl p-6 overflow-hidden border border-gold/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-gold" size={18} />
              <h4 className="text-sm font-medium text-silver-light uppercase tracking-wider">VIP Market Bias</h4>
            </div>
            {/* Blurred content */}
            <div className="filter blur-md select-none pointer-events-none">
              <p className="text-sm text-silver/80 mb-2">Current bias: Bullish continuation expected above $66,400. Watching for institutional accumulation...</p>
              <p className="text-sm text-silver/80">Key invalidation level at $63,200. Risk-reward favors longs 3:1...</p>
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40">
              <Lock className="text-gold mb-2" size={32} />
              <span className="text-gold font-semibold text-sm">Premium Members Only</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
