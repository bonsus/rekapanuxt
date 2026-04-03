import { d as defineEventHandler, a as getQuery } from '../../nitro/nitro.mjs';
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
  var _a, _b, _c, _d;
  const payload = await requireAuth(event);
  const query = getQuery(event);
  const page = Math.max(1, parseInt(String((_a = query.page) != null ? _a : "1")));
  const limit = Math.min(100, Math.max(1, parseInt(String((_b = query.limit) != null ? _b : "10"))));
  const search = String((_c = query.search) != null ? _c : "").trim();
  const type = String((_d = query.type) != null ? _d : "");
  const where = { userId: payload.sub };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    ];
  }
  if (type === "SHOPEE" || type === "TIKTOK") {
    where.type = type;
  }
  const [total, stores] = await prisma.$transaction([
    prisma.store.count({ where }),
    prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        type: true,
        description: true,
        link: true,
        userId: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  return {
    success: true,
    data: stores,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
});

export { index_get as default };
//# sourceMappingURL=index.get5.mjs.map
