import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { prisma } = await import('@/lib/prisma')
    const items = await prisma.watchlistItem.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ success: true, data: items })
  } catch {
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function POST(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { symbol, exchange = 'binance', notes } = await request.json()
    if (!symbol) return NextResponse.json({ success: false, error: 'Symbol required' }, { status: 400 })

    const { prisma } = await import('@/lib/prisma')
    const item = await prisma.watchlistItem.upsert({
      where: { userId_symbol_exchange: { userId: payload.userId, symbol, exchange } },
      update: { notes },
      create: { userId: payload.userId, symbol, exchange, notes },
    })
    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to add to watchlist' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { symbol, exchange = 'binance' } = await request.json()
    const { prisma } = await import('@/lib/prisma')
    await prisma.watchlistItem.deleteMany({
      where: { userId: payload.userId, symbol, exchange },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to remove' }, { status: 500 })
  }
}
