import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { z } from 'zod';
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

const CreateStoreSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  type: z.enum(["SHOPEE", "TIKTOK"], { message: "Type must be SHOPEE or TIKTOK" }),
  description: z.string().max(500).nullable().optional(),
  link: z.string().url("Invalid URL").nullable().optional()
});
const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = await requireAuth(event);
  const body = await readBody(event);
  const parsed = CreateStoreSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error"
    });
  }
  const { name, type, description, link } = parsed.data;
  const store = await prisma.store.create({
    data: {
      name,
      type,
      description: description != null ? description : null,
      link: link != null ? link : null,
      userId: payload.sub
    },
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
  return { success: true, message: "Store created successfully", data: store };
});

export { index_post as default };
//# sourceMappingURL=index.post4.mjs.map
