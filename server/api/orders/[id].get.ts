import { createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })

  const order = await prisma.order.findFirst({
    where: { id },
    include: {
      items: true,
      customer: true,
      shipping: true,
      store: { select: { userId: true } },
    },
  })

  if (!order) throw createError({ statusCode: 404, message: 'Order not found' })
  if (order.store.userId !== payload.sub) throw createError({ statusCode: 403, message: 'Forbidden' })

  const { store: _store, ...rest } = order
  return { success: true, data: rest }
})
