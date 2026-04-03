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
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const user = await requireAuth(event);
  const query = getQuery(event);
  const storeId = String((_a = query.storeId) != null ? _a : "");
  const dateFrom = String((_b = query.dateFrom) != null ? _b : "");
  const dateTo = String((_c = query.dateTo) != null ? _c : "");
  if (!storeId) throw createError({ statusCode: 400, message: "storeId required" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const where = { storeId };
  if (dateFrom || dateTo) {
    const range = {};
    if (dateFrom) range.gte = new Date(dateFrom);
    if (dateTo) range.lte = new Date(dateTo);
    where.date = range;
  }
  const sums = await prisma.shopeeAd.aggregate({
    where,
    _sum: { cost: true, impressions: true, clicks: true, conversions: true, grossRevenue: true },
    _count: { id: true }
  });
  const totalCost = Number((_d = sums._sum.cost) != null ? _d : 0);
  const totalImpressions = Number((_e = sums._sum.impressions) != null ? _e : 0);
  const totalClicks = Number((_f = sums._sum.clicks) != null ? _f : 0);
  const totalConversions = Number((_g = sums._sum.conversions) != null ? _g : 0);
  const totalGrossRevenue = Number((_h = sums._sum.grossRevenue) != null ? _h : 0);
  return {
    totalCost,
    totalImpressions,
    totalClicks,
    totalConversions,
    totalGrossRevenue,
    roas: totalCost > 0 ? totalGrossRevenue / totalCost : 0,
    avgCtr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    avgCpc: totalClicks > 0 ? totalCost / totalClicks : 0,
    avgCostPerConversion: totalConversions > 0 ? totalCost / totalConversions : 0,
    recordCount: sums._count.id
  };
});

export { summary_get as default };
//# sourceMappingURL=summary.get.mjs.map
