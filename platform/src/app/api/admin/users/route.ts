import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { prisma } = await import('@/lib/prisma')
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, username: true, fullName: true,
        role: true, plan: true, planExpiresAt: true, createdAt: true,
        _count: { select: { trades: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: users })
  } catch {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }
}

export async function PATCH(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload || payload.role !== 'ADMIN') {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 })
  }

  try {
    const { userId, plan, role } = await request.json()
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.update({
      where: { id: userId },
      data: { plan, role },
    })
    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}
