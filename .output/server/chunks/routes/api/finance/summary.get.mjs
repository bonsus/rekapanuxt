import { d as defineEventHandler, a as getQuery, c as createError } from '../../../nitro/nitro.mjs';
import { a as requireAuth } from '../../../_/auth.mjs';
import { p as prisma } from '../../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../../_/jwt.mjs';
import 'jose';
import '@prisma/client';

const summary_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const user = await requireAuth(event);
  const q = getQuery(event);
  const storeId = String((_a = q.storeId) != null ? _a : "");
  if (!storeId) throw createError({ statusCode: 400, message: "storeId diperlukan" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const where = {
    storeId,
    ...q.dateFrom || q.dateTo ? {
      date: {
        ...q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {},
        ...q.dateTo ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}
      }
    } : {}
  };
  const [agg, feeAgg, pendingOrders, shippedOrders] = await Promise.all([
    // @ts-ignore
    prisma.financeTransaction.groupBy({
      by: ["cashFlow", "type"],
      where,
      _sum: { netAmount: true },
      _count: { id: true }
    }),
    // Sum individual fee columns from ORDER transactions
    // @ts-ignore
    prisma.financeTransaction.aggregate({
      where: { ...where, type: "ORDER" },
      _sum: { platformFee: true, affiliateFee: true, shippingFee: true }
    }),
    // Pending orders (not yet shipped) — reflects current state, no date filter
    prisma.order.aggregate({
      where: { storeId, status: "PENDING" },
      _count: { id: true },
      _sum: { grandTotal: true }
    }),
    // Shipped orders (in transit, not yet delivered)
    prisma.order.aggregate({
      where: { storeId, status: "SHIPPED" },
      _count: { id: true },
      _sum: { grandTotal: true }
    })
  ]);
  let totalIn = 0;
  let totalOut = 0;
  let totalOrder = 0;
  let totalAds = 0;
  let totalLogistic = 0;
  let totalWithdraw = 0;
  let txCount = 0;
  for (const row of agg) {
    const net = Number((_b = row._sum.netAmount) != null ? _b : 0);
    txCount += row._count.id;
    if (row.cashFlow === "IN") totalIn += net;
    if (row.cashFlow === "OUT") totalOut += net;
    if (row.type === "ORDER") totalOrder += net;
    if (row.type === "ADS") totalAds += net;
    if (row.type === "LOGISTIC") totalLogistic += net;
    if (row.type === "WITHDRAW") totalWithdraw += net;
  }
  const totalBalance = totalIn - totalOut;
  const totalPlatformFee = Number((_c = feeAgg._sum.platformFee) != null ? _c : 0);
  const totalAffiliateFee = Number((_d = feeAgg._sum.affiliateFee) != null ? _d : 0);
  const totalShippingFee = Number((_e = feeAgg._sum.shippingFee) != null ? _e : 0);
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
    pendingOrderCount: pendingOrders._count.id,
    pendingOrderAmount: Number((_f = pendingOrders._sum.grandTotal) != null ? _f : 0),
    shippedOrderCount: shippedOrders._count.id,
    shippedOrderAmount: Number((_g = shippedOrders._sum.grandTotal) != null ? _g : 0)
  };
});

export { summary_get as default };
//# sourceMappingURL=summary.get.mjs.map
