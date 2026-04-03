import { getRouterParam, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Store ID is required' })
  }

  const store = await prisma.store.findUnique({ where: { id } })
  if (!store) {
    throw createError({ statusCode: 404, message: 'Store not found' })
  }
  if (store.userId !== payload.sub) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  await prisma.store.delete({ where: { id } })

  return { success: true, message: 'Store deleted successfully' }
})
