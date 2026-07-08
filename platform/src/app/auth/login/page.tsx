'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('auth_token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        toast.success('Welcome back!')
        router.push('/dashboard')
      } else {
        toast.error(data.error || 'Login failed')
      }
    } catch {
      toast.error('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
              <span className="text-black font-black text-sm">10X</span>
            </div>
            <span className="font-display font-bold text-xl gold-gradient-text">10X Limitless</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white mt-2">Welcome back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your trading intelligence platform</p>
        </div>

        {/* Card */}
        <div className="glass-card-elevated p-8 gold-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30
                           focus:outline-none focus:border-gold-500/50 focus:bg-white/[0.07] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-3 pr-12 text-white placeholder-white/30
                             focus:outline-none focus:border-gold-500/50 focus:bg-white/[0.07] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-gold-500" />
                Remember me
              </label>
              <a href="#" className="text-gold-400 hover:text-gold-300 transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Create one free
            </Link>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
          <br />Not financial advice. Trade responsibly.
        </p>
      </motion.div>
    </div>
  )
}
