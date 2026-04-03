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
  var _a;
  const user = await requireAuth(event);
  const q = getQuery(event);
  const storeId = String((_a = q.storeId) != null ? _a : "");
  if (!storeId) throw createError({ statusCode: 400, message: "storeId diperlukan" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: user.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Toko tidak ditemukan" });
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(100, Number(q.limit) || 20);
  const where = {
    storeId,
    ...q.type ? { type: q.type } : {},
    ...q.cashFlow ? { cashFlow: q.cashFlow } : {},
    ...q.source ? { source: q.source } : {},
    ...q.search ? {
      OR: [
        { referenceId: { contains: String(q.search), mode: "insensitive" } },
        { note: { contains: String(q.search), mode: "insensitive" } }
      ]
    } : {},
    ...q.dateFrom || q.dateTo ? {
      date: {
        ...q.dateFrom ? { gte: new Date(String(q.dateFrom)) } : {},
        ...q.dateTo ? { lte: new Date(new Date(String(q.dateTo)).setHours(23, 59, 59, 999)) } : {}
      }
    } : {}
  };
  const [data, total] = await Promise.all([
    // @ts-ignore
    prisma.financeTransaction.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit
    }),
    // @ts-ignore
    prisma.financeTransaction.count({ where })
  ]);
  return { data, total, page, limit };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
