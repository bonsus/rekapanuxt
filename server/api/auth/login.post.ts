import { readBody, createError, setCookie } from 'h3'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '~/server/utils/prisma'
import { signAccessToken, signRefreshToken } from '~/server/utils/jwt'

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message ?? 'Validation error',
    })
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })

  // Use constant-time comparison by always running bcrypt even if user doesn't exist
  const dummyHash = '$2a$12$dummyhashtopreventtimingattacks00000000000000000000000000'
  const isValid = user
    ? await bcrypt.compare(password, user.password)
    : await bcrypt.compare(password, dummyHash).then(() => false)

  if (!user || !isValid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  // Block inactive users
  if (user.status === 'INACTIVE') {
    throw createError({ statusCode: 403, message: 'Your account has been deactivated. Please contact support.' })
  }

  // Block expired users
  if (user.expiredAt && user.expiredAt < new Date()) {
    throw createError({ statusCode: 403, message: 'Your account has expired. Please contact support.' })
  }

  const tokenPayload = { sub: user.id, email: user.email, role: user.role }

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload),
  ])

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  })

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return {
    success: true,
    data: {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        expiredAt: user.expiredAt,
        createdAt: user.createdAt,
      },
    },
  }
})
