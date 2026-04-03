import { d as defineEventHandler, g as getRouterParam, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import { z } from 'zod';
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

const UpdateStoreSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters").optional(),
  type: z.enum(["SHOPEE", "TIKTOK"]).optional(),
  description: z.string().max(500).nullable().optional(),
  link: z.string().url("Invalid URL").nullable().optional()
});
const _id__put = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Store ID is required" });
  }
  const store = await prisma.store.findUnique({ where: { id } });
  if (!store) {
    throw createError({ statusCode: 404, message: "Store not found" });
  }
  if (store.userId !== payload.sub) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }
  const body = await readBody(event);
  const parsed = UpdateStoreSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error"
    });
  }
  const { name, type, description, link } = parsed.data;
  const updateData = {};
  if (name !== void 0) updateData.name = name;
  if (type !== void 0) updateData.type = type;
  if (description !== void 0) updateData.description = description;
  if (link !== void 0) updateData.link = link;
  const updated = await prisma.store.update({
    where: { id },
    data: updateData,
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
  return { success: true, message: "Store updated successfully", data: updated };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
