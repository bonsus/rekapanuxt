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
  var _a, _b, _c, _d, _e, _f, _g;
  const user = await requireAuth(event);
  const query = getQuery(event);
  const storeId = String((_a = query.storeId) != null ? _a : "");
  const dateFrom = String((_b = query.dateFrom) != null ? _b : "");
  const dateTo = String((_c = query.dateTo) != null ? _c : "");
  const adType = String((_d = query.adType) != null ? _d : "");
  const search = String((_e = query.search) != null ? _e : "");
  const page = Math.max(1, parseInt(String((_f = query.page) != null ? _f : "1")));
  const limit = Math.min(100, parseInt(String((_g = query.limit) != null ? _g : "20")));
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
  if (adType) where.adType = adType;
  if (search) {
    where.OR = [
      { adName: { contains: search, mode: "insensitive" } },
      { productCode: { contains: search, mode: "insensitive" } }
    ];
  }
  const [data, total] = await Promise.all([
    // @ts-ignore
    prisma.shopeeAd.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit
    }),
    // @ts-ignore
    prisma.shopeeAd.count({ where })
  ]);
  return { data, total, page, limit };
});

export { index_get as default };
//# sourceMappingURL=index.get4.mjs.map
