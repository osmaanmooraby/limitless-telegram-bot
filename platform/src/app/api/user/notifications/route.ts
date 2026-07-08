import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { prisma } = await import('@/lib/prisma')
    const notifications = await prisma.notification.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
    return NextResponse.json({ success: true, data: notifications })
  } catch {
    return NextResponse.json({ success: true, data: [] })
  }
}

export async function PATCH(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await request.json()
    const { prisma } = await import('@/lib/prisma')

    if (id) {
      await prisma.notification.updateMany({
        where: { id, userId: payload.userId },
        data: { isRead: true },
      })
    } else {
      // Mark all read
      await prisma.notification.updateMany({
        where: { userId: payload.userId, isRead: false },
        data: { isRead: true },
      })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Internal endpoint to create notifications (used by scanner/alert system)
  const payload = await authenticateRequest(request)
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 })
  }

  try {
    const { userId, title, message, type, data } = await request.json()
    const { prisma } = await import('@/lib/prisma')
    const notification = await prisma.notification.create({
      data: { userId, title, message, type: type || 'info', data },
    })
    return NextResponse.json({ success: true, data: notification })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create notification' }, { status: 500 })
  }
}
