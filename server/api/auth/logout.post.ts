import { getCookie, deleteCookie } from 'h3'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (refreshToken) {
    await prisma.refreshToken
      .deleteMany({ where: { token: refreshToken } })
      .catch(() => {})
  }

  deleteCookie(event, 'refresh_token', { path: '/' })

  return { success: true, message: 'Logged out successfully' }
})
