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

  const page  = Math.max(1, Number(q.page ?? 1))
  const limit = Math.min(100, Math.max(1, Number(q.limit ?? 20)))
  const skip  = (page - 1) * limit

  const where: Record<string, unknown> = { storeId }

  if (q.dateFrom || q.dateTo) {
    where.date = {
      ...(q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {}),
      ...(q.dateTo   ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}),
    }
  }

  if (q.campaignId) where.campaignId = String(q.campaignId)

  if (q.search) {
    const s = String(q.search)
    where.OR = [
      { campaignName: { contains: s, mode: 'insensitive' } },
      { adGroupName:  { contains: s, mode: 'insensitive' } },
      { accountName:  { contains: s, mode: 'insensitive' } },
    ]
  }

  // @ts-ignore
  const [data, total] = await Promise.all([
    // @ts-ignore
    prisma.tikTokAd.findMany({ where, skip, take: limit, orderBy: { date: 'desc' } }),
    // @ts-ignore
    prisma.tikTokAd.count({ where }),
  ])

  return { data, total, page, limit }
})
