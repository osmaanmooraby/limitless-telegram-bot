import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateAccessToken } from '@/lib/auth'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, username, password, fullName } = parsed.data

    // Check existing user
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })

    if (existing) {
      const field = existing.email === email ? 'Email' : 'Username'
      return NextResponse.json({ success: false, error: `${field} already taken` }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: { email, username, passwordHash, fullName },
      select: { id: true, email: true, username: true, fullName: true, role: true, plan: true, createdAt: true }
    })

    const token = generateAccessToken({ userId: user.id, email: user.email, role: user.role, plan: user.plan })

    return NextResponse.json({
      success: true,
      data: { token, user },
      message: 'Account created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 })
  }
}
