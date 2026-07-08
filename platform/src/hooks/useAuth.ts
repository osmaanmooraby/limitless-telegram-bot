'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) { setLoading(false); return }

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUser(data.data)
          localStorage.setItem('user', JSON.stringify(data.data))
        } else {
          localStorage.removeItem('auth_token')
          setUser(null)
        }
      } else {
        localStorage.removeItem('auth_token')
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Hydrate from localStorage first for instant render
    const stored = localStorage.getItem('user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
    }
    fetchUser()
  }, [fetchUser])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem('auth_token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      setUser(data.data.user)
      return { success: true }
    }
    return { success: false, error: data.error }
  }, [])

  const register = useCallback(
    async (email: string, username: string, password: string, fullName?: string) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password, fullName }),
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('auth_token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        setUser(data.data.user)
        return { success: true }
      }
      return { success: false, error: data.error }
    },
    []
  )

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/auth/login')
  }, [router])

  const isVIP = user?.plan === 'VIP' || user?.plan === 'ENTERPRISE' || user?.role === 'ADMIN'
  const isAdmin = user?.role === 'ADMIN'
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

  return { user, loading, login, register, logout, isVIP, isAdmin, token, refetch: fetchUser }
}
