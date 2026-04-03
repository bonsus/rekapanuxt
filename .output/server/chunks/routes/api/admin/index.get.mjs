import { d as defineEventHandler, a as getQuery } from '../../../nitro/nitro.mjs';
import { r as requireAdmin } from '../../../_/auth.mjs';
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

const index_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  await requireAdmin(event);
  const query = getQuery(event);
  const page = Math.max(1, parseInt(String((_a = query.page) != null ? _a : "1")));
  const limit = Math.min(100, Math.max(1, parseInt(String((_b = query.limit) != null ? _b : "10"))));
  const search = String((_c = query.search) != null ? _c : "").trim();
  const role = String((_d = query.role) != null ? _d : "");
  const status = String((_e = query.status) != null ? _e : "");
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } }
    ];
  }
  if (role === "ADMIN" || role === "USER") {
    where.role = role;
  }
  if (status === "ACTIVE" || status === "INACTIVE") {
    where.status = status;
  }
  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        expiredAt: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    })
  ]);
  return {
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
