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

  const where = {
    storeId,
    ...(q.dateFrom || q.dateTo ? {
      date: {
        ...(q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {}),
        ...(q.dateTo   ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}),
      },
    } : {}),
  }

  // @ts-ignore: financeTransaction added in latest migration
  const [agg, feeAgg, pendingOrders, shippedOrders] = await Promise.all([
    // @ts-ignore
    prisma.financeTransaction.groupBy({
      by: ['cashFlow', 'type'],
      where,
      _sum: { netAmount: true },
      _count: { id: true },
    }),
    // Sum individual fee columns from ORDER transactions
    // @ts-ignore
    prisma.financeTransaction.aggregate({
      where: { ...where, type: 'ORDER' },
      _sum: { platformFee: true, affiliateFee: true, shippingFee: true },
    }),
    // Pending orders (not yet shipped) — reflects current state, no date filter
    prisma.order.aggregate({
      where: { storeId, status: 'PENDING' },
      _count: { id: true },
      _sum: { grandTotal: true },
    }),
    // Shipped orders (in transit, not yet delivered)
    prisma.order.aggregate({
      where: { storeId, status: 'SHIPPED' },
      _count: { id: true },
      _sum: { grandTotal: true },
    }),
  ])

  let totalIn       = 0
  let totalOut      = 0
  let totalOrder    = 0
  let totalAds      = 0
  let totalLogistic = 0
  let totalWithdraw = 0
  let txCount       = 0

  for (const row of agg) {
    const net = Number(row._sum.netAmount ?? 0)
    txCount  += row._count.id

    if (row.cashFlow === 'IN')  totalIn  += net
    if (row.cashFlow === 'OUT') totalOut += net

    if (row.type === 'ORDER')    totalOrder    += net
    if (row.type === 'ADS')      totalAds      += net
    if (row.type === 'LOGISTIC') totalLogistic += net
    if (row.type === 'WITHDRAW') totalWithdraw += net
  }

  const totalBalance      = totalIn - totalOut
  const totalPlatformFee  = Number(feeAgg._sum.platformFee  ?? 0)
  const totalAffiliateFee = Number(feeAgg._sum.affiliateFee ?? 0)
  const totalShippingFee  = Number(feeAgg._sum.shippingFee  ?? 0)

  return {
    totalBalance,
    totalIn,
    totalOut,
    totalOrder,
    totalAds,
    totalLogistic,
    totalWithdraw,
    txCount,
    totalPlatformFee,
    totalAffiliateFee,
    totalShippingFee,
    pendingOrderCount:  pendingOrders._count.id,
    pendingOrderAmount: Number(pendingOrders._sum.grandTotal ?? 0),
    shippedOrderCount:  shippedOrders._count.id,
    shippedOrderAmount: Number(shippedOrders._sum.grandTotal ?? 0),
  }
})
