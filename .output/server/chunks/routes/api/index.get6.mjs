import { d as defineEventHandler, a as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { a as requireAuth } from '../../_/auth.mjs';
import { p as prisma } from '../../_/prisma.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../../_/jwt.mjs';
import 'jose';
import '@prisma/client';

const index_get = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const user = await requireAuth(event);
  const q = getQuery(event);
  const storeId = String((_a = q.storeId) != null ? _a : "");
  if (!storeId) throw createError({ statusCode: 400, message: "storeId diperlukan" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const page = Math.max(1, Number((_b = q.page) != null ? _b : 1));
  const limit = Math.min(100, Math.max(1, Number((_c = q.limit) != null ? _c : 20)));
  const skip = (page - 1) * limit;
  const where = { storeId };
  if (q.dateFrom || q.dateTo) {
    where.date = {
      ...q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {},
      ...q.dateTo ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}
    };
  }
  if (q.campaignId) where.campaignId = String(q.campaignId);
  if (q.search) {
    const s = String(q.search);
    where.OR = [
      { campaignName: { contains: s, mode: "insensitive" } },
      { adGroupName: { contains: s, mode: "insensitive" } },
      { accountName: { contains: s, mode: "insensitive" } }
    ];
  }
  const [data, total] = await Promise.all([
    // @ts-ignore
    prisma.tikTokAd.findMany({ where, skip, take: limit, orderBy: { date: "desc" } }),
    // @ts-ignore
    prisma.tikTokAd.count({ where })
  ]);
  return { data, total, page, limit };
});

export { index_get as default };
//# sourceMappingURL=index.get6.mjs.map
