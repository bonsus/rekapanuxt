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
  var _a, _b, _c, _d, _e, _f;
  const user = await requireAuth(event);
  const q = getQuery(event);
  const storeId = String((_a = q.storeId) != null ? _a : "");
  if (!storeId) throw createError({ statusCode: 400, message: "storeId diperlukan" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const where = { storeId };
  if (q.dateFrom || q.dateTo) {
    where.date = {
      ...q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {},
      ...q.dateTo ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}
    };
  }
  if (q.campaignId) where.campaignId = String(q.campaignId);
  const agg = await prisma.tikTokAd.aggregate({
    where,
    _sum: { cost: true, impressions: true, clicks: true, conversions: true, grossRevenue: true },
    _count: { id: true }
  });
  const totalCost = Number((_b = agg._sum.cost) != null ? _b : 0);
  const totalImpressions = Number((_c = agg._sum.impressions) != null ? _c : 0);
  const totalClicks = Number((_d = agg._sum.clicks) != null ? _d : 0);
  const totalConversions = Number((_e = agg._sum.conversions) != null ? _e : 0);
  const totalGrossRevenue = Number((_f = agg._sum.grossRevenue) != null ? _f : 0);
  const recordCount = agg._count.id;
  const roas = totalCost > 0 ? totalGrossRevenue / totalCost : 0;
  const avgCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
  const avgCpc = totalClicks > 0 ? totalCost / totalClicks : 0;
  const avgCostPerConversion = totalConversions > 0 ? totalCost / totalConversions : 0;
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
    recordCount
  };
});

export { summary_get as default };
//# sourceMappingURL=summary.get.mjs.map
