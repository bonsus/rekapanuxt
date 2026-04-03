import { d as defineEventHandler, g as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const payload = await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Product ID is required" });
  const product = await prisma.product.findUnique({
    where: { id },
    include: { store: { select: { userId: true } } }
  });
  if (!product) throw createError({ statusCode: 404, message: "Product not found" });
  if (product.store.userId !== payload.sub) throw createError({ statusCode: 403, message: "Forbidden" });
  await prisma.product.delete({ where: { id } });
  return { success: true, message: "Product deleted successfully" };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
