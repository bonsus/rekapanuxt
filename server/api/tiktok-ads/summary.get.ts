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

  const where: Record<string, unknown> = { storeId }

  if (q.dateFrom || q.dateTo) {
    where.date = {
      ...(q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {}),
      ...(q.dateTo   ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}),
    }
  }

  if (q.campaignId) where.campaignId = String(q.campaignId)

  // @ts-ignore
  const agg = await prisma.tikTokAd.aggregate({
    where,
    _sum:   { cost: true, impressions: true, clicks: true, conversions: true, grossRevenue: true },
    _count: { id: true },
  })

  const totalCost         = Number(agg._sum.cost         ?? 0)
  const totalImpressions  = Number(agg._sum.impressions  ?? 0)
  const totalClicks       = Number(agg._sum.clicks       ?? 0)
  const totalConversions  = Number(agg._sum.conversions  ?? 0)
  const totalGrossRevenue = Number(agg._sum.grossRevenue ?? 0)
  const recordCount       = agg._count.id

  const roas                 = totalCost > 0 ? totalGrossRevenue / totalCost : 0
  const avgCtr               = totalImpressions > 0 ? totalClicks / totalImpressions : 0
  const avgCpc               = totalClicks > 0 ? totalCost / totalClicks : 0
  const avgCostPerConversion = totalConversions > 0 ? totalCost / totalConversions : 0

  return {
    totalCost,
    totalImpressions,
    totalClicks,
    totalConversions,
    totalGrossRevenue,
    roas,
    avgCtr,
    avgCpc,
    avgCostPerConversion,
    recordCount,
  }
})
