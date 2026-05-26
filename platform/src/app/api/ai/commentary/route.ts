import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { generateSignalCommentary, generateMarketSummary } from '@/lib/ai/commentary'

export async function POST(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // VIP-only feature
    const isVIP = payload.plan === 'VIP' || payload.plan === 'ENTERPRISE' || payload.role === 'ADMIN'
    if (!isVIP) {
      return NextResponse.json({
        success: false,
        error: 'AI commentary is a VIP feature. Upgrade to access.',
      }, { status: 403 })
    }

    const body = await request.json()
    const { type, signal, signals, btcPrice, btcChange } = body

    if (type === 'signal' && signal) {
      const commentary = await generateSignalCommentary(signal)
      return NextResponse.json({ success: true, data: { commentary } })
    }

    if (type === 'market' && signals) {
      const summary = await generateMarketSummary(signals, btcPrice || 0, btcChange || 0)
      return NextResponse.json({ success: true, data: { summary } })
    }

    return NextResponse.json({ success: false, error: 'Invalid request type' }, { status: 400 })
  } catch (error) {
    console.error('AI commentary error:', error)
    return NextResponse.json({ success: false, error: 'AI service unavailable' }, { status: 500 })
  }
}
