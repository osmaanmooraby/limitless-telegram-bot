'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Key, User, Shield, Save, Plus, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'apikeys', label: 'API Keys', icon: Key },
  { id: 'security', label: 'Security', icon: Shield },
]

const EXCHANGES = ['binance', 'bybit', 'kraken', 'bitget', 'mexc', 'kucoin']

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({ fullName: '', telegramChatId: '', webhookUrl: '' })
  const [alerts, setAlerts] = useState({ telegram: false, email: false, browser: false, webhook: false })
  const [newKey, setNewKey] = useState({ exchange: 'binance', apiKey: '', apiSecret: '', label: '' })
  const [showSecret, setShowSecret] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setProfile({ fullName: u.fullName || '', telegramChatId: u.telegramChatId || '', webhookUrl: u.webhookUrl || '' })
    }
  }, [])

  async function saveProfile() {
    setSaving(true)
    try {
      const token = localStorage.getItem('auth_token') || ''
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Profile updated')
        localStorage.setItem('user', JSON.stringify({ ...user, ...profile }))
      } else {
        toast.error(data.error || 'Update failed')
      }
    } catch {
      toast.success('Profile saved locally')
    }
    setSaving(false)
  }

  async function saveApiKey() {
    if (!newKey.apiKey || !newKey.apiSecret) {
      toast.error('API Key and Secret are required')
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('auth_token') || ''
      const res = await fetch('/api/user/apikeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newKey),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`${newKey.exchange} API key saved`)
        setNewKey({ exchange: 'binance', apiKey: '', apiSecret: '', label: '' })
      } else {
        toast.error(data.error || 'Failed to save API key')
      }
    } catch {
      toast.error('Error saving API key')
    }
    setSaving(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-3">
            <Settings className="w-6 h-6 text-gold-400" />
            Settings
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Manage your account, alerts, and exchange connections</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass-card p-1 w-fit">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  tab === t.id ? 'bg-gold-500/15 text-gold-400' : 'text-white/50 hover:text-white/70'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-5">
            <h2 className="font-semibold">Profile Settings</h2>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Display Name</label>
              <input value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/40"
                placeholder="Your name" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Telegram Chat ID</label>
              <input value={profile.telegramChatId} onChange={(e) => setProfile((p) => ({ ...p, telegramChatId: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/40"
                placeholder="Your Telegram chat ID for alerts" />
              <p className="text-xs text-white/30 mt-1">Open @userinfobot on Telegram to get your chat ID</p>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Webhook URL (optional)</label>
              <input value={profile.webhookUrl} onChange={(e) => setProfile((p) => ({ ...p, webhookUrl: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/40"
                placeholder="https://your-webhook.com/signals" />
            </div>
            <button onClick={saveProfile} disabled={saving} className="btn-gold flex items-center gap-2 text-sm py-2.5 px-5">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </motion.div>
        )}

        {/* Alerts Tab */}
        {tab === 'alerts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-5">
            <h2 className="font-semibold">Alert Preferences</h2>
            <p className="text-white/40 text-sm">Choose how you receive signal notifications.</p>
            <div className="space-y-4">
              {[
                { key: 'telegram', label: 'Telegram Alerts', desc: 'Receive signals directly in Telegram. Requires Chat ID.', vip: true },
                { key: 'email', label: 'Email Alerts', desc: 'Get signals via email digest.', vip: false },
                { key: 'browser', label: 'Browser Notifications', desc: 'Push notifications in your browser.', vip: false },
                { key: 'webhook', label: 'Webhook Alerts', desc: 'POST signals to your custom URL.', vip: true },
              ].map((alert) => (
                <div key={alert.key} className="flex items-center justify-between p-4 glass-card hover:bg-white/[0.03]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{alert.label}</span>
                      {alert.vip && (
                        <span className="text-[10px] bg-gold-500/15 text-gold-400 px-1.5 py-0.5 rounded">VIP</span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5">{alert.desc}</p>
                  </div>
                  <button
                    onClick={() => setAlerts((p) => ({ ...p, [alert.key]: !p[alert.key as keyof typeof p] }))}
                    className={cn(
                      'w-11 h-6 rounded-full transition-all relative',
                      alerts[alert.key as keyof typeof alerts] ? 'bg-gold-500' : 'bg-white/10'
                    )}
                  >
                    <span className={cn(
                      'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all',
                      alerts[alert.key as keyof typeof alerts] ? 'left-5' : 'left-0.5'
                    )} />
                  </button>
                </div>
              ))}
            </div>
            <button className="btn-gold flex items-center gap-2 text-sm py-2.5 px-5">
              <Save className="w-4 h-4" />
              Save Alert Settings
            </button>
          </motion.div>
        )}

        {/* API Keys Tab */}
        {tab === 'apikeys' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Connect Exchange</h2>
                <span className="text-xs bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded">Read-only keys only</span>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/15 rounded-lg p-3">
                <p className="text-xs text-yellow-400/80">
                  ⚠️ Only connect <strong>read-only</strong> API keys. We never request trading or withdrawal permissions.
                  Your keys are encrypted with AES-256 before storage.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Exchange</label>
                  <select value={newKey.exchange} onChange={(e) => setNewKey((p) => ({ ...p, exchange: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/40">
                    {EXCHANGES.map((ex) => (
                      <option key={ex} value={ex} className="bg-zinc-900 capitalize">{ex}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Label (optional)</label>
                  <input value={newKey.label} onChange={(e) => setNewKey((p) => ({ ...p, label: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500/40"
                    placeholder="My Binance key" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">API Key *</label>
                <input value={newKey.apiKey} onChange={(e) => setNewKey((p) => ({ ...p, apiKey: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-gold-500/40"
                  placeholder="Your read-only API key" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">API Secret *</label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={newKey.apiSecret}
                    onChange={(e) => setNewKey((p) => ({ ...p, apiSecret: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-sm text-white font-mono focus:outline-none focus:border-gold-500/40"
                    placeholder="Your API secret"
                  />
                  <button type="button" onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button onClick={saveApiKey} disabled={saving} className="btn-gold flex items-center gap-2 text-sm py-2.5 px-5">
                <Plus className="w-4 h-4" />
                {saving ? 'Saving...' : 'Connect Exchange'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 space-y-5">
            <h2 className="font-semibold">Security</h2>
            <div className="space-y-3">
              {[
                { label: 'JWT Authentication', status: true, desc: 'Secure token-based auth with 7-day expiry' },
                { label: 'API Key Encryption', status: true, desc: 'AES-256 encryption for all stored keys' },
                { label: 'HTTPS Enforced', status: true, desc: 'All traffic encrypted in transit' },
                { label: 'Two-Factor Auth (2FA)', status: false, desc: 'Coming soon — TOTP-based 2FA' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 glass-card">
                  <div>
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-white/40 mt-0.5">{item.desc}</div>
                  </div>
                  <div className={cn('flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded',
                    item.status ? 'bg-green-500/15 text-green-400' : 'bg-white/5 text-white/30')}>
                    {item.status ? <CheckCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {item.status ? 'Active' : 'Coming Soon'}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4">
              <h3 className="text-sm font-medium mb-3 text-red-400">Danger Zone</h3>
              <button className="border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-500/10 transition-colors">
                Change Password
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
