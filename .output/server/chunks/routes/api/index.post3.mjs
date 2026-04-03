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

const SkuSchema = z.object({
  mpSkuId: z.string().default(""),
  sku: z.string().default(""),
  price: z.number().min(0, "Price must be >= 0"),
  hpp: z.number().min(0, "HPP must be >= 0"),
  variants: z.record(z.string()).default({})
});
const CreateProductSchema = z.object({
  storeId: z.string().min(1, "storeId is required"),
  mpProductId: z.string().min(1, "MP Product ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  variantTypes: z.array(z.string()).max(2, "Maximum 2 variant types").default([]),
  skus: z.array(SkuSchema).min(1, "At least one SKU is required")
});
const index_post = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = await requireAuth(event);
  const body = await readBody(event);
  const parsed = CreateProductSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error" });
  }
  const { storeId, mpProductId, name, description, category, status, variantTypes, skus } = parsed.data;
  const store = await prisma.store.findFirst({ where: { id: storeId, userId: payload.sub } });
  if (!store) throw createError({ statusCode: 403, message: "Forbidden" });
  try {
    const product = await prisma.product.create({
      data: {
        mpProductId,
        name,
        description,
        category,
        status,
        variantTypes,
        storeId,
        skus: {
          create: skus.map((s) => ({
            mpSkuId: s.mpSkuId || crypto.randomUUID(),
            sku: s.sku,
            price: s.price,
            hpp: s.hpp,
            variants: s.variants,
            storeId
          }))
        }
      },
      include: { skus: true }
    });
    return { success: true, message: "Product created successfully", data: product };
  } catch (err) {
    const e = err;
    if (e.code === "P2002") {
      throw createError({ statusCode: 409, message: "MP SKU ID sudah digunakan di toko ini. Gunakan ID yang berbeda." });
    }
    throw err;
  }
});

export { index_post as default };
//# sourceMappingURL=index.post3.mjs.map
