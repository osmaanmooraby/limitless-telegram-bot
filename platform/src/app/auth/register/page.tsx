'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, UserPlus, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const BENEFITS = [
  'Free scanner with top 10 pairs',
  'EMA crossover signal alerts',
  'Trading journal & analytics',
  'Educational signal explanations',
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', username: '', password: '', fullName: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('auth_token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        toast.success('Account created! Welcome to 10X Limitless 🎯')
        router.push('/dashboard')
      } else {
        toast.error(data.error || 'Registration failed')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gold-500/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-4xl grid lg:grid-cols-2 gap-10 items-center">
        {/* Left: Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
              <span className="text-black font-black text-sm">10X</span>
            </div>
            <span className="font-display font-bold text-xl gold-gradient-text">10X Limitless</span>
          </Link>

          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Where Real Traders<br />Are Made
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Join a community of systematic traders using institutional-grade confluence signals to build real edge in the market.
          </p>

          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-white/70">
                <CheckCircle className="w-5 h-5 text-gold-400 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-10 glass-card p-5 gold-border">
            <p className="text-white/60 text-sm italic leading-relaxed">
              &ldquo;10X Limitless changed how I approach the markets. Instead of random entries, I now wait for full confluence setups. Win rate went from 42% to 67%.&rdquo;
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-400">JM</div>
              <span className="text-white/40 text-xs">James M. — VIP Member</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="lg:hidden text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
                <span className="text-black font-black text-xs">10X</span>
              </div>
              <span className="font-display font-bold text-lg gold-gradient-text">10X Limitless</span>
            </Link>
          </div>

          <div className="glass-card-elevated p-8 gold-border">
            <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
            <p className="text-white/40 text-sm mb-6">Free forever. Upgrade when ready.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name (optional)</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={update('fullName')}
                  placeholder="Your name"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30
                             focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Username *</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={update('username')}
                  required
                  placeholder="trader_123"
                  pattern="[a-zA-Z0-9_]+"
                  minLength={3}
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30
                             focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Email address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30
                             focus:outline-none focus:border-gold-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={update('password')}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/30
                               focus:outline-none focus:border-gold-500/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Free Account
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-white/40">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-white/20 text-xs mt-4">
            By signing up, you agree to our Terms of Service.<br />Not financial advice.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
