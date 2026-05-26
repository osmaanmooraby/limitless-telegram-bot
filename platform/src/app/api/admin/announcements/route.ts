import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { title, content, type, isVipOnly } = await request.json()
    const { prisma } = await import('@/lib/prisma')
    const announcement = await prisma.announcement.create({
      data: { title, content, type: type || 'general', isVipOnly: isVipOnly || false }
    })
    return NextResponse.json({ success: true, data: announcement })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { prisma } = await import('@/lib/prisma')
    const payload = await authenticateRequest(request)
    const isVIP = payload?.plan === 'VIP' || payload?.plan === 'ENTERPRISE' || payload?.role === 'ADMIN'

    const announcements = await prisma.announcement.findMany({
      where: { isActive: true, ...(isVIP ? {} : { isVipOnly: false }) },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json({ success: true, data: announcements })
  } catch {
    return NextResponse.json({ success: true, data: [] })
  }
}
