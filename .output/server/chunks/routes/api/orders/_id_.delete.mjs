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
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const order = await prisma.order.findFirst({
    where: { id },
    include: { store: { select: { userId: true } } }
  });
  if (!order) throw createError({ statusCode: 404, message: "Order not found" });
  if (order.store.userId !== payload.sub) throw createError({ statusCode: 403, message: "Forbidden" });
  await prisma.order.delete({ where: { id } });
  return { success: true, message: "Order deleted" };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
