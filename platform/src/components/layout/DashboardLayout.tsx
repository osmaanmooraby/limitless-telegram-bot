'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Scan, Zap, BookOpen, Settings, LogOut,
  Bell, Crown, Shield, Menu, X, TrendingUp, ChevronDown,
  User, Activity, BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/scanner', label: 'Scanner', icon: Scan },
  { href: '/signals', label: 'Signals', icon: Zap },
  { href: '/charts', label: 'Charts', icon: BarChart3 },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/vip', label: 'VIP Zone', icon: Crown, vipOnly: true },
  { href: '/settings', label: 'Settings', icon: Settings },
]

interface UserData {
  id: string
  email: string
  username: string
  fullName?: string
  role: string
  plan: string
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    // Verify token
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data)
          localStorage.setItem('user', JSON.stringify(data.data))
        } else {
          router.push('/auth/login')
        }
      })
      .catch(() => {})
  }, [router])

  function handleLogout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const isVIP = user?.plan === 'VIP' || user?.plan === 'ENTERPRISE' || user?.role === 'ADMIN'
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-[#080808] flex">
      {/* Sidebar */}
      <>
        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
          )}
        </AnimatePresence>

        <motion.aside
          initial={false}
          animate={{ x: sidebarOpen ? 0 : -280 }}
          className={cn(
            'fixed left-0 top-0 z-50 h-screen w-64 flex flex-col',
            'bg-[#0a0a0a] border-r border-white/[0.06]',
            'lg:translate-x-0 lg:static lg:z-auto',
            !sidebarOpen && 'lg:flex'
          )}
          style={{ transform: undefined }}
        >
          <div className={cn(
            'fixed left-0 top-0 h-screen w-64 flex flex-col bg-[#0a0a0a] border-r border-white/[0.06]',
            'transition-transform duration-300',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}>
            {/* Logo */}
            <div className="p-5 border-b border-white/[0.06]">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
                  <span className="text-black font-black text-sm">10X</span>
                </div>
                <div>
                  <div className="font-display font-bold text-base leading-tight">
                    <span className="gold-gradient-text">10X</span> Limitless
                  </div>
                  <div className="text-[10px] text-white/30 tracking-widest uppercase">Intelligence</div>
                </div>
              </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                if (item.vipOnly && !isVIP) return null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                        : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                    {item.vipOnly && (
                      <span className="ml-auto text-[10px] bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded">VIP</span>
                    )}
                  </Link>
                )
              })}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    pathname.startsWith('/admin')
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                  )}
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  Admin
                  <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">ADMIN</span>
                </Link>
              )}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-white/[0.06]">
              {user && (
                <div className="flex items-center gap-3 px-2 py-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-sm font-bold text-gold-400">
                    {(user.fullName || user.username).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{user.fullName || user.username}</div>
                    <div className="text-xs text-white/40 flex items-center gap-1">
                      {isVIP ? (
                        <><Crown className="w-3 h-3 text-gold-400" /> <span className="text-gold-400">VIP</span></>
                      ) : (
                        'Free Plan'
                      )}
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </motion.aside>
      </>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#080808]/80 backdrop-blur-xl border-b border-white/[0.06] h-14 flex items-center px-4 gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 hidden sm:block">
            <span className="text-white/30 text-sm font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Plan badge */}
            {isVIP ? (
              <div className="hidden sm:flex items-center gap-1 bg-gold-500/10 border border-gold-500/20 rounded-full px-3 py-1 text-xs text-gold-400">
                <Crown className="w-3 h-3" /> VIP
              </div>
            ) : (
              <Link href="/vip" className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/50 hover:text-gold-400 hover:border-gold-500/20 transition-all">
                <Crown className="w-3 h-3" /> Upgrade
              </Link>
            )}

            {/* Notifications */}
            <button className="relative w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 rounded-full text-[9px] font-bold text-black flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
