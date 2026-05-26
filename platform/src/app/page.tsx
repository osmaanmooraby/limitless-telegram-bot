'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingUp, Shield, Zap, BarChart3, Bell, BookOpen,
  ChevronRight, Star, Users, Activity, Lock, ArrowRight, CheckCircle
} from 'lucide-react'

const TICKER_DATA = [
  { symbol: 'BTC', price: '$67,450', change: '+2.14%', positive: true },
  { symbol: 'ETH', price: '$3,512', change: '+1.87%', positive: true },
  { symbol: 'SOL', price: '$178.32', change: '+3.21%', positive: true },
  { symbol: 'BNB', price: '$612.45', change: '-0.53%', positive: false },
  { symbol: 'XRP', price: '$0.623', change: '-1.12%', positive: false },
  { symbol: 'LINK', price: '$17.54', change: '+2.98%', positive: true },
  { symbol: 'AVAX', price: '$38.92', change: '-2.31%', positive: false },
  { symbol: 'ADA', price: '$0.452', change: '+0.87%', positive: true },
]

const FEATURES = [
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'EMA Confluence Scanner',
    description: 'Multi-timeframe scanner detecting EMA crossovers, RSI conditions, MACD momentum, and volume confirmation simultaneously.',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Signals',
    description: 'Institutional-grade signals with confidence scoring, risk/reward ratios, and plain English explanations of every trigger.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Educational Intelligence',
    description: 'Every signal explains WHY it triggered in beginner-friendly English. Learn while you trade.',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Multi-Channel Alerts',
    description: 'Receive signals via Telegram, email, browser push, and webhooks the moment setups form.',
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: 'Trading Journal',
    description: 'Log trades, track emotions, review win rate, and build data-driven discipline over time.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Multi-Exchange Coverage',
    description: 'Scan Binance, Bybit, Kraken, Bitget, MEXC, and KuCoin simultaneously via CCXT.',
  },
]

const PLAN_FEATURES = {
  free: [
    'Top 10 pairs scanner (1h timeframe)',
    'Basic EMA crossover signals',
    'Market overview dashboard',
    'Trading journal (10 trades)',
    'Community announcements',
  ],
  vip: [
    'Unlimited pairs & exchanges',
    'All timeframes (15m to 1W)',
    'Full confluence signal suite',
    'AI market commentary',
    'Real-time Telegram alerts',
    'Advanced trading journal',
    'VIP-only high confidence signals',
    'Priority support',
  ],
}

export default function HomePage() {
  const [currentTicker, setCurrentTicker] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTicker((prev) => (prev + 1) % TICKER_DATA.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* Live Ticker Bar */}
      <div className="bg-black/60 border-b border-white/5 py-2 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...TICKER_DATA, ...TICKER_DATA].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-6 text-xs font-mono">
              <span className="text-gold-400 font-semibold">{item.symbol}/USDT</span>
              <span className="text-white/70">{item.price}</span>
              <span className={item.positive ? 'text-green-400' : 'text-red-400'}>{item.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
              <span className="text-black font-black text-sm">10X</span>
            </div>
            <span className="font-display font-bold text-lg text-white">
              <span className="gold-gradient-text">10X</span> Limitless
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="nav-link">Features</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#about" className="nav-link">About</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
            <Link href="/auth/register" className="btn-gold text-sm py-2 px-4">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center bg-grid">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 text-xs text-gold-400 font-medium mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                Live across 6 exchanges · 20+ pairs · 4 timeframes
              </div>

              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
                Trade With{' '}
                <span className="gold-gradient-text">Institutional</span>
                <br />Intelligence
              </h1>

              <p className="text-xl text-white/60 max-w-2xl mb-8 leading-relaxed">
                Multi-exchange EMA confluence scanner that identifies high-probability setups
                and explains every signal in plain English. Not gambling — systematic edge.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/auth/register" className="btn-gold inline-flex items-center justify-center gap-2 text-base py-4 px-8">
                  Start Free — No Credit Card
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/dashboard" className="btn-ghost inline-flex items-center justify-center gap-2 text-base py-4 px-8">
                  <Activity className="w-4 h-4" />
                  View Live Dashboard
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gold-500" />
                  <span>920+ active traders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold-500" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gold-500" />
                  <span>Bank-grade encryption</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Signal Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 hidden xl:block"
          >
            <div className="w-80 glass-card-elevated p-5 gold-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-white/40 font-mono">LIVE SIGNAL</span>
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Just now
                </span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-display font-bold text-xl">BTC/USDT</div>
                  <div className="text-xs text-white/40">Binance · 4H</div>
                </div>
                <div className="signal-badge-bullish">BULLISH</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                <div className="text-xs font-semibold text-green-400 mb-1">EMA Crossover + Volume</div>
                <div className="text-xs text-white/60 leading-relaxed">
                  EMA 9 crossed above EMA 21 while price remains above EMA 200. Volume 130% above average confirms buyers stepping in.
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-xs text-white/40">Confidence</div>
                  <div className="font-bold text-green-400">82%</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-xs text-white/40">R:R</div>
                  <div className="font-bold text-white">2.1:1</div>
                </div>
                <div className="bg-black/30 rounded-lg p-2">
                  <div className="text-xs text-white/40">RSI</div>
                  <div className="font-bold text-white">58.4</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Built For <span className="gold-gradient-text">Serious Traders</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Every feature is designed around one principle: confluence-based, educational, systematic edge.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:bg-white/[0.06] hover:border-gold-500/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-4 group-hover:bg-gold-500/15 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exchanges */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white/30 text-sm mb-8 font-medium tracking-wider uppercase">Connected Exchanges</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Binance', 'Bybit', 'Kraken', 'Bitget', 'MEXC', 'KuCoin'].map((ex) => (
              <div key={ex} className="text-white/40 font-display font-bold text-lg hover:text-gold-400 transition-colors cursor-default">
                {ex}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Simple <span className="gold-gradient-text">Pricing</span>
            </h2>
            <p className="text-white/50">Start free, upgrade when ready.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="glass-card p-8">
              <div className="mb-6">
                <div className="text-white/40 text-sm font-medium mb-2">FREE PLAN</div>
                <div className="font-display text-4xl font-black">$0<span className="text-xl text-white/40 font-normal">/mo</span></div>
              </div>
              <ul className="space-y-3 mb-8">
                {PLAN_FEATURES.free.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-ghost w-full text-center block">
                Get Started Free
              </Link>
            </div>

            {/* VIP */}
            <div className="relative glass-card p-8 border-gold-500/30 bg-gold-500/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-600 to-gold-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <div className="mb-6">
                <div className="text-gold-400 text-sm font-medium mb-2">VIP PLAN</div>
                <div className="font-display text-4xl font-black gold-gradient-text">$49<span className="text-xl text-white/40 font-normal">/mo</span></div>
              </div>
              <ul className="space-y-3 mb-8">
                {PLAN_FEATURES.vip.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                    <CheckCircle className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register" className="btn-gold w-full text-center block">
                Upgrade to VIP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-5xl font-black mb-6">
              Where Real Traders<br /><span className="gold-gradient-text">Are Made</span>
            </h2>
            <p className="text-white/50 text-xl mb-10">
              Join 920+ traders who stopped gambling and started trading with systematic edge.
            </p>
            <Link href="/auth/register" className="btn-gold inline-flex items-center gap-2 text-lg py-4 px-10">
              Start Your Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
              <span className="text-black font-black text-xs">10X</span>
            </div>
            <span className="font-display font-bold text-white/80">10X Limitless Intelligence</span>
          </div>
          <p className="text-white/30 text-sm">© 2025 10X Limitless. Not financial advice. Trade responsibly.</p>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/70 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
