import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  const payload = await authenticateRequest(request)
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { fullName, telegramChatId, webhookUrl } = await request.json()
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: { fullName, telegramChatId, webhookUrl },
      select: { id: true, email: true, username: true, fullName: true, telegramChatId: true, webhookUrl: true }
    })
    return NextResponse.json({ success: true, data: user })
  } catch {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}
