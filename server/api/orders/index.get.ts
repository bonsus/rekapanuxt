import { getQuery, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const payload = await requireAuth(event)
  const query = getQuery(event)

  const storeId = String(query.storeId ?? '')
  if (!storeId) throw createError({ statusCode: 400, message: 'storeId is required' })

  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Forbidden' })

  const page = Math.max(1, parseInt(String(query.page ?? '1')))
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '20'))))
  const search = String(query.search ?? '').trim()
  const status = String(query.status ?? '')
  const dateFrom = String(query.dateFrom ?? '')
  const dateTo = String(query.dateTo ?? '')

  const where: Record<string, unknown> = { storeId }
  if (search) where.orderNumber = { contains: search, mode: 'insensitive' }
  if (status) where.status = status
  if (dateFrom || dateTo) {
    where.createdDate = {
      ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
      ...(dateTo ? { lte: new Date(dateTo + 'T23:59:59.999Z') } : {}),
    }
  }

  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdDate: 'desc' },
      include: {
        _count: { select: { items: true } },
        customer: { select: { name: true } },
        shipping: { select: { trackingNumber: true } },
      },
    }),
  ])

  return { success: true, data, total, page, limit }
})
