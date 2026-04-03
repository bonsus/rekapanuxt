import { createError, getQuery } from 'h3'
import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user  = await requireAuth(event)
  const query = getQuery(event)

  const storeId  = String(query.storeId  ?? '')
  const dateFrom = String(query.dateFrom ?? '')
  const dateTo   = String(query.dateTo   ?? '')
  const groupBy  = String(query.groupBy  ?? 'campaign')

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

  const byFields = groupBy === 'adGroup'
    ? ['campaignId', 'campaignName', 'adGroupId', 'adGroupName']
    : ['campaignId', 'campaignName']

  // @ts-ignore
  const rows = await prisma.tikTokAd.groupBy({
    by: byFields,
    where,
    _sum: {
      cost:         true,
      impressions:  true,
      clicks:       true,
      conversions:  true,
      grossRevenue: true,
    },
    orderBy: { _sum: { cost: 'desc' } },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (rows as any[]).map((r) => {
    const cost         = Number(r._sum.cost         ?? 0)
    const impressions  = Number(r._sum.impressions   ?? 0)
    const clicks       = Number(r._sum.clicks        ?? 0)
    const conversions  = Number(r._sum.conversions   ?? 0)
    const grossRevenue = Number(r._sum.grossRevenue  ?? 0)

    return {
      campaignId:        String(r.campaignId   ?? ''),
      campaignName:      String(r.campaignName ?? ''),
      adGroupId:         r.adGroupId   != null ? String(r.adGroupId)   : null,
      adGroupName:       r.adGroupName != null ? String(r.adGroupName) : null,
      cost,
      impressions,
      clicks,
      conversions,
      grossRevenue,
      ctr:               impressions > 0 ? clicks       / impressions : 0,
      cvr:               clicks      > 0 ? conversions  / clicks      : 0,
      cpc:               clicks      > 0 ? cost         / clicks      : 0,
      roas:              cost        > 0 ? grossRevenue / cost        : 0,
      costPerConversion: conversions > 0 ? cost         / conversions : 0,
    }
  })
})
