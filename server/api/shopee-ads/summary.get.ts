import { createError, getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user  = await requireAuth(event)
  const query = getQuery(event)

  const storeId  = String(query.storeId  ?? '')
  const dateFrom = String(query.dateFrom ?? '')
  const dateTo   = String(query.dateTo   ?? '')

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

  // @ts-ignore
  const sums = await prisma.shopeeAd.aggregate({
    where,
    _sum: { cost: true, impressions: true, clicks: true, conversions: true, grossRevenue: true },
    _count: { id: true },
  })

  const totalCost        = Number(sums._sum.cost         ?? 0)
  const totalImpressions = Number(sums._sum.impressions  ?? 0)
  const totalClicks      = Number(sums._sum.clicks       ?? 0)
  const totalConversions = Number(sums._sum.conversions  ?? 0)
  const totalGrossRevenue = Number(sums._sum.grossRevenue ?? 0)

  return {
    totalCost,
    totalImpressions,
    totalClicks,
    totalConversions,
    totalGrossRevenue,
    roas:                 totalCost        > 0 ? totalGrossRevenue / totalCost        : 0,
    avgCtr:               totalImpressions > 0 ? totalClicks       / totalImpressions : 0,
    avgCpc:               totalClicks      > 0 ? totalCost         / totalClicks      : 0,
    avgCostPerConversion: totalConversions > 0 ? totalCost         / totalConversions : 0,
    recordCount: sums._count.id,
  }
})
