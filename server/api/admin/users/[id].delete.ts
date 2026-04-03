import { getRouterParam, createError } from 'h3'
import { requireAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const adminPayload = await requireAdmin(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  // Prevent self-deletion
  if (id === adminPayload.sub) {
    throw createError({ statusCode: 400, message: 'You cannot delete your own account' })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  await prisma.user.delete({ where: { id } })

  return { success: true, message: 'User deleted successfully' }
})
