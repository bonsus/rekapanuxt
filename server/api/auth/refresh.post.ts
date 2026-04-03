import { getCookie, setCookie, deleteCookie, createError } from 'h3'
import { prisma } from '~/server/utils/prisma'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'No refresh token provided' })
  }

  // Verify JWT signature first
  let jwtPayload
  try {
    jwtPayload = await verifyRefreshToken(refreshToken)
  } catch {
    deleteCookie(event, 'refresh_token', { path: '/' })
    throw createError({ statusCode: 401, message: 'Invalid refresh token' })
  }

  // Verify token exists in DB and hasn't expired
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  })

  if (!storedToken || storedToken.expiresAt < new Date()) {
    deleteCookie(event, 'refresh_token', { path: '/' })
    if (storedToken) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => {})
    }
    throw createError({ statusCode: 401, message: 'Refresh token expired' })
  }

  // Block inactive or expired accounts on refresh
  if (storedToken.user.status === 'INACTIVE') {
    deleteCookie(event, 'refresh_token', { path: '/' })
    await prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => {})
    throw createError({ statusCode: 403, message: 'Account deactivated' })
  }

  if (storedToken.user.expiredAt && storedToken.user.expiredAt < new Date()) {
    deleteCookie(event, 'refresh_token', { path: '/' })
    await prisma.refreshToken.delete({ where: { id: storedToken.id } }).catch(() => {})
    throw createError({ statusCode: 403, message: 'Account expired' })
  }

  const tokenPayload = {
    sub: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
  }

  // Rotate: issue new tokens
  const [newAccessToken, newRefreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload),
  ])

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: storedToken.id } }),
    prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: storedToken.userId, expiresAt },
    }),
  ])

  setCookie(event, 'refresh_token', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })

  return { success: true, data: { accessToken: newAccessToken } }
})
