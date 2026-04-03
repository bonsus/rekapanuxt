import { getRouterParam, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Store ID is required' })
  }

  const store = await prisma.store.findFirst({
    where: { id, userId: payload.sub },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      link: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!store) {
    throw createError({ statusCode: 404, message: 'Store not found' })
  }

  return { success: true, data: store }
})
