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

const skuSearch_get = defineEventHandler(async (event) => {
  const payload = await requireAuth(event);
  const { storeId, q } = getQuery(event);
  if (!storeId) throw createError({ statusCode: 400, message: "storeId is required" });
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Forbidden" });
  const search = (q != null ? q : "").trim();
  const skus = await prisma.sku.findMany({
    where: {
      storeId,
      ...search ? {
        OR: [
          { sku: { contains: search, mode: "insensitive" } },
          { mpSkuId: { contains: search, mode: "insensitive" } },
          { product: { name: { contains: search, mode: "insensitive" } } }
        ]
      } : {}
    },
    include: {
      product: { select: { id: true, name: true, category: true } }
    },
    take: 20,
    orderBy: [{ product: { name: "asc" } }, { sku: "asc" }]
  });
  const results = skus.map((s) => {
    var _a, _b, _c;
    return {
      skuId: s.id,
      productId: s.product.id,
      sku: s.sku,
      mpSkuId: (_a = s.mpSkuId) != null ? _a : "",
      productName: s.product.name,
      productCategory: (_b = s.product.category) != null ? _b : null,
      price: Number(s.price),
      hpp: Number(s.hpp),
      variants: (_c = s.variants) != null ? _c : {}
    };
  });
  return { success: true, data: results };
});

export { skuSearch_get as default };
//# sourceMappingURL=sku-search.get.mjs.map
