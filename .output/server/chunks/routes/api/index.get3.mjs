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
  var _a, _b, _c, _d, _e;
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
  const where = { storeId };
  if (status === "ACTIVE" || status === "INACTIVE") where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { mpProductId: { contains: search, mode: "insensitive" } }
    ];
  }
  const [total, products] = await prisma.$transaction([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      select: {
        id: true,
        mpProductId: true,
        name: true,
        description: true,
        status: true,
        variantTypes: true,
        storeId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { skus: true } }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  return {
    success: true,
    data: products,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
});

export { index_get as default };
//# sourceMappingURL=index.get3.mjs.map
