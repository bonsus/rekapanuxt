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

const _id__get = defineEventHandler(async (event) => {
  const payload = await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const order = await prisma.order.findFirst({
    where: { id },
    include: {
      items: true,
      customer: true,
      shipping: true,
      store: { select: { userId: true } }
    }
  });
  if (!order) throw createError({ statusCode: 404, message: "Order not found" });
  if (order.store.userId !== payload.sub) throw createError({ statusCode: 403, message: "Forbidden" });
  const { store: _store, ...rest } = order;
  return { success: true, data: rest };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
