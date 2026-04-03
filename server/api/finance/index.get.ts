import { getQuery, createError } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)
  const q    = getQuery(event)

  const storeId = String(q.storeId ?? '')
  if (!storeId) throw createError({ statusCode: 400, message: 'storeId diperlukan' })

  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Toko tidak ditemukan' })

  const page  = Math.max(1, Number(q.page)  || 1)
  const limit = Math.min(100, Number(q.limit) || 20)

  // @ts-ignore: financeTransaction added in latest migration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    storeId,
    ...(q.type     ? { type:     q.type     } : {}),
    ...(q.cashFlow ? { cashFlow: q.cashFlow } : {}),
    ...(q.source   ? { source:   q.source   } : {}),
    ...(q.search   ? {
      OR: [
        { referenceId: { contains: String(q.search), mode: 'insensitive' } },
        { note:        { contains: String(q.search), mode: 'insensitive' } },
      ],
    } : {}),
    ...(q.dateFrom || q.dateTo ? {
      date: {
        ...(q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {}),
        ...(q.dateTo   ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}),
      },
    } : {}),
  }

  // @ts-ignore
  const [data, total] = await Promise.all([
    // @ts-ignore
    prisma.financeTransaction.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    // @ts-ignore
    prisma.financeTransaction.count({ where }),
  ])

  return { data, total, page, limit }
})
