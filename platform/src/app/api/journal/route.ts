import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTradeSchema = z.object({
  symbol: z.string(),
  exchange: z.string(),
  direction: z.enum(['LONG', 'SHORT']),
  entryPrice: z.number().positive(),
  exitPrice: z.number().positive().optional(),
  stopLoss: z.number().positive().optional(),
  takeProfit: z.number().positive().optional(),
  quantity: z.number().positive(),
  leverage: z.number().min(1).default(1),
  notes: z.string().optional(),
  emotion: z.string().optional(),
  tags: z.array(z.string()).default([]),
  entryDate: z.string(),
})

export async function GET(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { userId: payload.userId }
    if (status) where.status = status

    const [trades, total] = await Promise.all([
      prisma.trade.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.trade.count({ where }),
    ])

    // Calculate stats
    const allTrades = await prisma.trade.findMany({
      where: { userId: payload.userId, status: 'CLOSED' },
      select: { pnl: true, pnlPercent: true }
    })

    const totalPnl = allTrades.reduce((sum: number, t: { pnl: number | null; pnlPercent: number | null }) => sum + (t.pnl || 0), 0)
    const wins = allTrades.filter((t: { pnl: number | null; pnlPercent: number | null }) => (t.pnl || 0) > 0).length
    const winRate = allTrades.length > 0 ? (wins / allTrades.length) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        trades,
        total,
        page,
        limit,
        hasMore: total > page * limit,
        stats: {
          totalTrades: allTrades.length,
          totalPnl,
          winRate,
          wins,
          losses: allTrades.length - wins,
        }
      }
    })
  } catch (error) {
    console.error('Journal GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch trades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await authenticateRequest(request)
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = createTradeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.errors[0].message }, { status: 400 })
    }

    const data = parsed.data
    let pnl: number | undefined
    let pnlPercent: number | undefined
    let status: 'OPEN' | 'CLOSED' = 'OPEN'

    if (data.exitPrice) {
      const multiplier = data.direction === 'LONG' ? 1 : -1
      pnlPercent = multiplier * ((data.exitPrice - data.entryPrice) / data.entryPrice) * 100 * data.leverage
      pnl = data.quantity * data.entryPrice * pnlPercent / 100
      status = 'CLOSED'
    }

    const trade = await prisma.trade.create({
      data: {
        userId: payload.userId,
        symbol: data.symbol,
        exchange: data.exchange,
        direction: data.direction,
        status,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        quantity: data.quantity,
        leverage: data.leverage,
        pnl,
        pnlPercent,
        notes: data.notes,
        emotion: data.emotion,
        tags: data.tags,
        entryDate: new Date(data.entryDate),
      }
    })

    return NextResponse.json({ success: true, data: trade }, { status: 201 })
  } catch (error) {
    console.error('Journal POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create trade' }, { status: 500 })
  }
}
