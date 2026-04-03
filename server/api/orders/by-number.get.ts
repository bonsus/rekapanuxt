import { getQuery, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload  = await requireAuth(event)
  const q        = getQuery(event)
  const storeId  = String(q.storeId ?? '').trim()
  const orderNumber = String(q.orderNumber ?? '').trim()

  if (!storeId || !orderNumber) {
    throw createError({ statusCode: 400, message: 'storeId dan orderNumber diperlukan' })
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      storeId,
      store: { userId: payload.sub },
    },
    include: {
      items: true,
      customer: true,
      shipping: true,
    },
  })

  if (!order) return { success: true, data: null }

  return { success: true, data: order }
})
