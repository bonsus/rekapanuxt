import type { H3Event } from 'h3'
import { getHeader, createError } from 'h3'
import { verifyAccessToken, type JWTPayload } from './jwt'
import { prisma } from './prisma'

export async function requireAuth(event: H3Event): Promise<JWTPayload> {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: No token provided',
    })
  }

  const token = authHeader.slice(7)

  let payload: JWTPayload
  try {
    payload = await verifyAccessToken(token)
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid or expired token',
    })
  }

  // Re-check user status on every request
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, status: true, expiredAt: true },
  })

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized: User no longer exists' })
  }

  if (user.status === 'INACTIVE') {
    throw createError({ statusCode: 403, message: 'Account has been deactivated' })
  }

  if (user.expiredAt && user.expiredAt < new Date()) {
    throw createError({ statusCode: 403, message: 'Account has expired' })
  }

  return payload
}

export async function requireAdmin(event: H3Event): Promise<JWTPayload> {
  const payload = await requireAuth(event)

  if (payload.role !== 'ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: Admin access required',
    })
  }

  return payload
}
