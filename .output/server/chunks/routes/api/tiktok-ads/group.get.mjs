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

const group_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const user = await requireAuth(event);
  const query = getQuery(event);
  const storeId = String((_a = query.storeId) != null ? _a : "");
  const dateFrom = String((_b = query.dateFrom) != null ? _b : "");
  const dateTo = String((_c = query.dateTo) != null ? _c : "");
  const groupBy = String((_d = query.groupBy) != null ? _d : "campaign");
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
  const byFields = groupBy === "adGroup" ? ["campaignId", "campaignName", "adGroupId", "adGroupName"] : ["campaignId", "campaignName"];
  const rows = await prisma.tikTokAd.groupBy({
    by: byFields,
    where,
    _sum: {
      cost: true,
      impressions: true,
      clicks: true,
      conversions: true,
      grossRevenue: true
    },
    orderBy: { _sum: { cost: "desc" } }
  });
  return rows.map((r) => {
    var _a2, _b2, _c2, _d2, _e, _f, _g;
    const cost = Number((_a2 = r._sum.cost) != null ? _a2 : 0);
    const impressions = Number((_b2 = r._sum.impressions) != null ? _b2 : 0);
    const clicks = Number((_c2 = r._sum.clicks) != null ? _c2 : 0);
    const conversions = Number((_d2 = r._sum.conversions) != null ? _d2 : 0);
    const grossRevenue = Number((_e = r._sum.grossRevenue) != null ? _e : 0);
    return {
      campaignId: String((_f = r.campaignId) != null ? _f : ""),
      campaignName: String((_g = r.campaignName) != null ? _g : ""),
      adGroupId: r.adGroupId != null ? String(r.adGroupId) : null,
      adGroupName: r.adGroupName != null ? String(r.adGroupName) : null,
      cost,
      impressions,
      clicks,
      conversions,
      grossRevenue,
      ctr: impressions > 0 ? clicks / impressions : 0,
      cvr: clicks > 0 ? conversions / clicks : 0,
      cpc: clicks > 0 ? cost / clicks : 0,
      roas: cost > 0 ? grossRevenue / cost : 0,
      costPerConversion: conversions > 0 ? cost / conversions : 0
    };
  });
});

export { group_get as default };
//# sourceMappingURL=group.get.mjs.map
