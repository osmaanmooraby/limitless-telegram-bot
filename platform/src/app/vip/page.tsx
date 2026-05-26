'use client'
import { motion } from 'framer-motion'
import {
  Crown, Zap, Bell, BarChart3, TrendingUp, Lock, CheckCircle, ArrowRight, Sparkles
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn } from '@/lib/utils'

const VIP_FEATURES = [
  { icon: <Zap className="w-5 h-5" />, title: 'All-Timeframe Scanner', description: 'Scan from 15m to 1W across 6 exchanges simultaneously. Free users limited to 1h on Binance.' },
  { icon: <Crown className="w-5 h-5" />, title: 'Exclusive VIP Signals', description: 'High-confidence signals (80%+) with tighter confluence requirements. Only shown to VIP members.' },
  { icon: <Bell className="w-5 h-5" />, title: 'Instant Telegram Alerts', description: 'Get push notifications to your Telegram the second a signal fires. Never miss a setup again.' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'AI Market Commentary', description: 'Anthropic AI-powered market analysis on every signal. Understand what\'s driving the move.' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Multi-Timeframe Confluence', description: 'See if the 1h signal is aligned with 4h and daily trend. True top-down analysis.' },
  { icon: <Sparkles className="w-5 h-5" />, title: 'Priority Support', description: 'Direct access to support. Get questions answered within hours, not days.' },
]

export default function VIPPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero */}
        <div className="relative glass-card overflow-hidden p-8 border-gold-500/30 bg-gold-500/[0.03] text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent pointer-events-none" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-black" />
            </div>
            <h1 className="font-display text-4xl font-black mb-3">
              <span className="gold-gradient-text">10X VIP Zone</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              Unlock the full arsenal. Real-time signals, AI commentary, and multi-exchange confluence
              designed for traders who are serious about building edge.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="font-display text-4xl font-black gold-gradient-text">$49</div>
                <div className="text-white/40 text-sm">/month</div>
              </div>
              <div className="text-white/20 text-2xl">or</div>
              <div className="text-center">
                <div className="font-display text-4xl font-black gold-gradient-text">$399</div>
                <div className="text-white/40 text-sm">/year (32% off)</div>
              </div>
            </div>
            <button className="btn-gold mt-6 inline-flex items-center gap-2 text-base py-3.5 px-8">
              Upgrade to VIP Now <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-white/30 text-xs mt-3">Cancel anytime · Instant access · 7-day money back</p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {VIP_FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5 hover:bg-white/[0.06] hover:border-gold-500/20 transition-all group border border-white/[0.06]"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 group-hover:bg-gold-500/15 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold">Free vs VIP Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm border-b border-white/5">
                  <th className="text-left px-5 py-3 text-white/40">Feature</th>
                  <th className="text-center px-5 py-3 text-white/40">Free</th>
                  <th className="text-center px-5 py-3 text-gold-400">VIP</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ['Exchanges', '1 (Binance)', '6 (All)'],
                  ['Pairs', '10 max', 'Unlimited'],
                  ['Timeframes', '1h only', '15m to 1W'],
                  ['Signal types', '2 basic', 'All 7 types'],
                  ['Telegram alerts', '✗', '✓'],
                  ['AI commentary', '✗', '✓'],
                  ['VIP-only signals', '✗', '✓'],
                  ['Trading journal', '10 trades', 'Unlimited'],
                  ['Priority support', '✗', '✓'],
                ].map(([feature, free, vip], i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-white/70">{feature}</td>
                    <td className="px-5 py-3 text-center text-white/40">{free}</td>
                    <td className="px-5 py-3 text-center text-gold-400 font-medium">{vip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center pb-4">
          <p className="text-white/30 text-sm">
            Not financial advice. Past signal performance does not guarantee future results.
            <br />Trade with proper risk management. Only invest what you can afford to lose.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
