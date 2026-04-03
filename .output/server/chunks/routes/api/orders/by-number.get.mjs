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

const byNumber_get = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = await requireAuth(event);
  const q = getQuery(event);
  const storeId = String((_a = q.storeId) != null ? _a : "").trim();
  const orderNumber = String((_b = q.orderNumber) != null ? _b : "").trim();
  if (!storeId || !orderNumber) {
    throw createError({ statusCode: 400, message: "storeId dan orderNumber diperlukan" });
  }
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      storeId,
      store: { userId: payload.sub }
    },
    include: {
      items: true,
      customer: true,
      shipping: true
    }
  });
  if (!order) return { success: true, data: null };
  return { success: true, data: order };
});

export { byNumber_get as default };
//# sourceMappingURL=by-number.get.mjs.map
