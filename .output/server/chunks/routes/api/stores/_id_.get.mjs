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
  if (!id) {
    throw createError({ statusCode: 400, message: "Store ID is required" });
  }
  const store = await prisma.store.findFirst({
    where: { id, userId: payload.sub },
    select: {
      id: true,
      name: true,
      type: true,
      description: true,
      link: true,
      userId: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!store) {
    throw createError({ statusCode: 404, message: "Store not found" });
  }
  return { success: true, data: store };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
