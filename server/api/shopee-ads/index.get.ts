import { createError, getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user  = await requireAuth(event)
  const query = getQuery(event)

  const storeId  = String(query.storeId  ?? '')
  const dateFrom = String(query.dateFrom ?? '')
  const dateTo   = String(query.dateTo   ?? '')
  const adType   = String(query.adType   ?? '')
  const search   = String(query.search   ?? '')
  const page     = Math.max(1, parseInt(String(query.page  ?? '1')))
  const limit    = Math.min(100, parseInt(String(query.limit ?? '20')))

  if (!storeId) throw createError({ statusCode: 400, message: 'storeId required' })

  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } })
  if (!store) throw createError({ statusCode: 403, message: 'Toko tidak ditemukan' })

  const where: Record<string, unknown> = { storeId }
  if (dateFrom || dateTo) {
    const range: Record<string, Date> = {}
    if (dateFrom) range.gte = new Date(dateFrom)
    if (dateTo)   range.lte = new Date(dateTo)
    where.date = range
  }
  if (adType)  where.adType = adType
  if (search) {
    where.OR = [
      { adName:      { contains: search, mode: 'insensitive' } },
      { productCode: { contains: search, mode: 'insensitive' } },
    ]
  }

  // @ts-ignore
  const [data, total] = await Promise.all([
    // @ts-ignore
    prisma.shopeeAd.findMany({
      where,
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    // @ts-ignore
    prisma.shopeeAd.count({ where }),
  ])

  return { data, total, page, limit }
})
