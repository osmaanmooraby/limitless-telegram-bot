import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateAccessToken } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 400 })
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true, email: true, username: true, fullName: true,
        avatarUrl: true, role: true, plan: true, planExpiresAt: true,
        passwordHash: true, telegramChatId: true, createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 })
    }

    const token = generateAccessToken({ userId: user.id, email: user.email, role: user.role, plan: user.plan })
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: { token, user: userWithoutPassword },
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 })
  }
}
