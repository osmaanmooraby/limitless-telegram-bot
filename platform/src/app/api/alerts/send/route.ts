import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { sendSignalAlert, sendTelegramMessage } from '@/lib/alerts/telegram'
import { sendSignalEmail } from '@/lib/alerts/email'
import type { MarketSignal } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { signalId, channels } = await request.json() as {
      signalId: string
      channels: Array<'telegram' | 'email' | 'webhook'>
    }

    if (!signalId) {
      return NextResponse.json({ success: false, error: 'signalId required' }, { status: 400 })
    }

    // Fetch the signal and user
    let signal: MarketSignal | null = null
    let user: { email: string; telegramChatId: string | null; webhookUrl: string | null } | null = null

    try {
      const { prisma } = await import('@/lib/prisma')
      const [dbSignal, dbUser] = await Promise.all([
        prisma.marketSignal.findUnique({ where: { id: signalId } }),
        prisma.user.findUnique({
          where: { id: payload.userId },
          select: { email: true, telegramChatId: true, webhookUrl: true },
        }),
      ])

      if (dbSignal) {
        signal = {
          ...dbSignal,
          conditions: Array.isArray(dbSignal.conditions) ? dbSignal.conditions as string[] : [],
          createdAt: dbSignal.createdAt.toISOString(),
        } as MarketSignal
      }
      user = dbUser
    } catch { /* DB not available, use request body */ }

    if (!signal || !user) {
      return NextResponse.json({ success: false, error: 'Signal or user not found' }, { status: 404 })
    }

    const results: Record<string, boolean> = {}

    for (const channel of channels || []) {
      if (channel === 'telegram' && user.telegramChatId) {
        results.telegram = await sendSignalAlert(user.telegramChatId, signal)
      }
      if (channel === 'email') {
        results.email = await sendSignalEmail(user.email, signal)
      }
      if (channel === 'webhook' && user.webhookUrl) {
        try {
          const res = await fetch(user.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ signal, timestamp: new Date().toISOString() }),
          })
          results.webhook = res.ok
        } catch { results.webhook = false }
      }
    }

    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('Alert send error:', error)
    return NextResponse.json({ success: false, error: 'Alert delivery failed' }, { status: 500 })
  }
}
