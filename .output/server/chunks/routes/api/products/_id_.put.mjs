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

const SkuSchema = z.object({
  id: z.string().optional(),
  mpSkuId: z.string().default(""),
  sku: z.string().default(""),
  price: z.number().min(0),
  hpp: z.number().min(0),
  variants: z.record(z.string()).default({})
});
const UpdateProductSchema = z.object({
  mpProductId: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  variantTypes: z.array(z.string()).max(2).optional(),
  skus: z.array(SkuSchema).min(1).optional()
});
const _id__put = defineEventHandler(async (event) => {
  var _a, _b;
  const payload = await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Product ID is required" });
  const product = await prisma.product.findUnique({
    where: { id },
    include: { store: { select: { userId: true, id: true } } }
  });
  if (!product) throw createError({ statusCode: 404, message: "Product not found" });
  if (product.store.userId !== payload.sub) throw createError({ statusCode: 403, message: "Forbidden" });
  const body = await readBody(event);
  const parsed = UpdateProductSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error" });
  }
  const { skus, ...productFields } = parsed.data;
  const storeId = product.store.id;
  let updated;
  try {
    updated = await prisma.$transaction(async (tx) => {
      await tx.product.update({ where: { id }, data: productFields });
      if (skus !== void 0) {
        const incomingIds = skus.filter((s) => s.id).map((s) => s.id);
        await tx.sku.deleteMany({ where: { productId: id, id: { notIn: incomingIds } } });
        for (const sku of skus) {
          if (sku.id) {
            await tx.sku.update({
              where: { id: sku.id },
              data: { mpSkuId: sku.mpSkuId || crypto.randomUUID(), sku: sku.sku, price: sku.price, hpp: sku.hpp, variants: sku.variants }
            });
          } else {
            await tx.sku.create({
              data: { mpSkuId: sku.mpSkuId || crypto.randomUUID(), sku: sku.sku, price: sku.price, hpp: sku.hpp, variants: sku.variants, productId: id, storeId }
            });
          }
        }
      }
      return tx.product.findUnique({ where: { id }, include: { skus: { orderBy: { createdAt: "asc" } } } });
    });
  } catch (err) {
    const e = err;
    if (e.code === "P2002") {
      throw createError({ statusCode: 409, message: "MP SKU ID sudah digunakan di toko ini. Gunakan ID yang berbeda." });
    }
    throw err;
  }
  if (!updated) throw createError({ statusCode: 500, message: "Failed to retrieve updated product" });
  return { success: true, message: "Product updated successfully", data: updated };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
