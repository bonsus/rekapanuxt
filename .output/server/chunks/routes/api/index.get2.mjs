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
  const payload = await requireAuth(event);
  const query = getQuery(event);
  const storeId = String((_a = query.storeId) != null ? _a : "");
  if (!storeId) throw createError({ statusCode: 400, message: "storeId is required" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Forbidden" });
  const page = Math.max(1, parseInt(String((_b = query.page) != null ? _b : "1")));
  const limit = Math.min(100, Math.max(1, parseInt(String((_c = query.limit) != null ? _c : "20"))));
  const search = String((_d = query.search) != null ? _d : "").trim();
  const status = String((_e = query.status) != null ? _e : "");
  const dateFrom = String((_f = query.dateFrom) != null ? _f : "");
  const dateTo = String((_g = query.dateTo) != null ? _g : "");
  const where = { storeId };
  if (search) where.orderNumber = { contains: search, mode: "insensitive" };
  if (status) where.status = status;
  if (dateFrom || dateTo) {
    where.createdDate = {
      ...dateFrom ? { gte: new Date(dateFrom) } : {},
      ...dateTo ? { lte: /* @__PURE__ */ new Date(dateTo + "T23:59:59.999Z") } : {}
    };
  }
  const [total, data] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdDate: "desc" },
      include: {
        _count: { select: { items: true } },
        customer: { select: { name: true } },
        shipping: { select: { trackingNumber: true } }
      }
    })
  ]);
  return { success: true, data, total, page, limit };
});

export { index_get as default };
//# sourceMappingURL=index.get2.mjs.map
