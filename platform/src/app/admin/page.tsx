'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Users, Megaphone, Zap, BarChart3, Crown,
  Plus, Send, Check, X, RefreshCw, TrendingUp
} from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn, timeAgo } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState({ totalUsers: 0, vipUsers: 0, signalsToday: 0, scansToday: 0 })
  const [users, setUsers] = useState<any[]>([])
  const [announcement, setAnnouncement] = useState({ title: '', content: '', type: 'general', isVipOnly: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'ADMIN') {
      toast.error('Admin access required')
      router.push('/dashboard')
      return
    }
    fetchStats()
    fetchUsers()
  }, [])

  async function fetchStats() {
    try {
      const token = localStorage.getItem('auth_token') || ''
      const res = await fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (data.success) setStats(data.data)
      else {
        // Mock stats for demo
        setStats({ totalUsers: 142, vipUsers: 38, signalsToday: 24, scansToday: 87 })
      }
    } catch {
      setStats({ totalUsers: 142, vipUsers: 38, signalsToday: 24, scansToday: 87 })
    }
    setLoading(false)
  }

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('auth_token') || ''
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (data.success) setUsers(data.data)
    } catch {
      setUsers([
        { id: '1', email: 'trader@example.com', username: 'trader1', plan: 'VIP', role: 'VIP', createdAt: new Date().toISOString() },
        { id: '2', email: 'user@example.com', username: 'user2', plan: 'FREE', role: 'USER', createdAt: new Date().toISOString() },
      ])
    }
  }

  async function postAnnouncement() {
    if (!announcement.title || !announcement.content) {
      toast.error('Title and content are required')
      return
    }
    try {
      const token = localStorage.getItem('auth_token') || ''
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(announcement),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Announcement posted!')
        setAnnouncement({ title: '', content: '', type: 'general', isVipOnly: false })
      } else {
        toast.error(data.error || 'Failed to post')
      }
    } catch {
      toast.error('Error posting announcement')
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-400" />
              Admin Dashboard
            </h1>
            <p className="text-white/40 text-sm mt-0.5">Platform management and oversight</p>
          </div>
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5 text-xs text-red-400 font-semibold">
            <Shield className="w-3 h-3" /> ADMIN
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: <Users className="w-4 h-4 text-blue-400" />, color: 'text-blue-400' },
            { label: 'VIP Members', value: stats.vipUsers, icon: <Crown className="w-4 h-4 text-gold-400" />, color: 'text-gold-400' },
            { label: "Signals Today", value: stats.signalsToday, icon: <Zap className="w-4 h-4 text-green-400" />, color: 'text-green-400' },
            { label: 'Scans Today', value: stats.scansToday, icon: <BarChart3 className="w-4 h-4 text-purple-400" />, color: 'text-purple-400' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-white/40">{s.label}</span></div>
              <div className={cn('font-display text-3xl font-black', s.color)}>{loading ? '...' : s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass-card p-1 w-fit">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users' },
            { id: 'announcements', label: 'Announcements' },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all',
                tab === t.id ? 'bg-red-500/15 text-red-400' : 'text-white/50 hover:text-white/70')}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" /> User Management
              </h2>
              <button onClick={fetchUsers} className="text-white/40 hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-white/30 border-b border-white/5">
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Email</th>
                    <th className="text-center px-4 py-3">Plan</th>
                    <th className="text-center px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Joined</th>
                    <th className="text-center px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-gold-400">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">@{u.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{u.email}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-xs px-2 py-0.5 rounded font-medium',
                          u.plan === 'VIP' ? 'bg-gold-500/15 text-gold-400' : 'bg-white/5 text-white/40')}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn('text-xs px-2 py-0.5 rounded',
                          u.role === 'ADMIN' ? 'bg-red-500/15 text-red-400' : 'text-white/30')}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/30">{timeAgo(u.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-xs bg-gold-500/10 text-gold-400 hover:bg-gold-500/20 px-2 py-1 rounded transition-colors">
                            {u.plan === 'VIP' ? 'Revoke VIP' : 'Grant VIP'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {tab === 'announcements' && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-400" /> Post Announcement
            </h2>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Title *</label>
              <input value={announcement.title} onChange={(e) => setAnnouncement((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/40"
                placeholder="Announcement title" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Content *</label>
              <textarea value={announcement.content} onChange={(e) => setAnnouncement((p) => ({ ...p, content: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/40 resize-none"
                rows={4} placeholder="Announcement content..." />
            </div>
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Type</label>
                <select value={announcement.type} onChange={(e) => setAnnouncement((p) => ({ ...p, type: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                  {['general', 'alert', 'education', 'vip'].map((t) => (
                    <option key={t} value={t} className="bg-zinc-900 capitalize">{t}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-white/60 mt-4 cursor-pointer">
                <input type="checkbox" checked={announcement.isVipOnly}
                  onChange={(e) => setAnnouncement((p) => ({ ...p, isVipOnly: e.target.checked }))}
                  className="accent-yellow-500" />
                VIP Only
              </label>
            </div>
            <button onClick={postAnnouncement} className="btn-gold flex items-center gap-2 text-sm py-2.5 px-5">
              <Send className="w-4 h-4" />
              Post Announcement
            </button>
          </div>
        )}

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold-400" /> Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Trigger Market Scan', action: () => toast.success('Scan triggered') },
                  { label: 'Send System Alert', action: () => setTab('announcements') },
                  { label: 'View User List', action: () => setTab('users') },
                  { label: 'Export Data', action: () => toast.success('Export started') },
                ].map((item) => (
                  <button key={item.label} onClick={item.action}
                    className="w-full text-left px-4 py-2.5 glass-card hover:bg-white/[0.06] text-sm font-medium transition-all flex items-center justify-between group">
                    {item.label}
                    <span className="text-white/20 group-hover:text-white/50 transition-colors">→</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-400" /> System Status
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Scanner Engine', status: true },
                  { label: 'Signal API', status: true },
                  { label: 'Database', status: true },
                  { label: 'Redis Cache', status: false },
                  { label: 'Telegram Bot', status: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-white/70">{item.label}</span>
                    <span className={cn('flex items-center gap-1.5 text-xs',
                      item.status ? 'text-green-400' : 'text-yellow-400')}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', item.status ? 'bg-green-400' : 'bg-yellow-400 animate-pulse')} />
                      {item.status ? 'Online' : 'Not configured'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
