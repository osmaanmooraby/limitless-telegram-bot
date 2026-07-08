import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { encryptApiKey } from '@/lib/encryption'

export async function GET(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    const keys = await prisma.exchangeApiKey.findMany({
      where: { userId: payload.userId },
      select: { id: true, exchange: true, label: true, isActive: true, lastUsed: true, createdAt: true }
    })
    return NextResponse.json({ success: true, data: keys })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch keys' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { exchange, apiKey, apiSecret, label } = await request.json()
    if (!exchange || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: 'Exchange, API key, and secret are required' }, { status: 400 })
    }

    const { prisma } = await import('@/lib/prisma')
    const encryptedKey = encryptApiKey(apiKey)
    const encryptedSecret = encryptApiKey(apiSecret)

    const key = await prisma.exchangeApiKey.upsert({
      where: { userId_exchange: { userId: payload.userId, exchange } },
      update: { apiKey: encryptedKey, apiSecret: encryptedSecret, label, isActive: true },
      create: {
        userId: payload.userId,
        exchange,
        apiKey: encryptedKey,
        apiSecret: encryptedSecret,
        label,
      },
      select: { id: true, exchange: true, label: true, isActive: true, createdAt: true }
    })

    return NextResponse.json({ success: true, data: key })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to save API key' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { keyId } = await request.json()
    const { prisma } = await import('@/lib/prisma')
    await prisma.exchangeApiKey.deleteMany({
      where: { id: keyId, userId: payload.userId }
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })
  }
}
