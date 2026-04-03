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

const ItemSchema = z.object({
  skuId: z.string().nullable().optional(),
  productId: z.string().nullable().optional(),
  sku: z.string().default(""),
  mpSkuId: z.string().default(""),
  productName: z.string().min(1),
  productCategory: z.string().nullable().optional(),
  qty: z.number().int().min(1),
  price: z.number().min(0),
  discount: z.number().min(0).default(0),
  hpp: z.number().min(0).default(0)
});
const UpdateOrderSchema = z.object({
  orderNumber: z.string().min(1).optional(),
  createdDate: z.string().min(1).optional(),
  shippedDate: z.string().nullable().optional(),
  deliveredDate: z.string().nullable().optional(),
  completedDate: z.string().nullable().optional(),
  status: z.enum(["PENDING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "RETURNED"]).optional(),
  cancelBy: z.enum(["SELLER", "USER", "SYSTEM"]).nullable().optional(),
  cancelReason: z.string().nullable().optional(),
  shippingFee: z.number().min(0).optional(),
  platformFee: z.number().min(0).optional(),
  affiliateFee: z.number().min(0).optional(),
  items: z.array(ItemSchema).min(1).optional(),
  customer: z.object({
    customerId: z.string().nullable().optional(),
    name: z.string().min(1),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    zipcode: z.string().nullable().optional()
  }).nullable().optional(),
  shipping: z.object({
    name: z.string().nullable().optional(),
    serviceName: z.string().nullable().optional(),
    trackingNumber: z.string().nullable().optional()
  }).nullable().optional()
});
function calcItems(items) {
  let subtotal = 0, discount = 0, totalHpp = 0;
  const mapped = items.map((i) => {
    var _a, _b, _c;
    const lineTotal = i.price * i.qty - i.discount * i.qty;
    const lineHpp = i.hpp * i.qty;
    subtotal += i.price * i.qty;
    discount += i.discount * i.qty;
    totalHpp += lineHpp;
    return {
      skuId: (_a = i.skuId) != null ? _a : null,
      productId: (_b = i.productId) != null ? _b : null,
      sku: i.sku,
      mpSkuId: i.mpSkuId,
      productName: i.productName,
      productCategory: (_c = i.productCategory) != null ? _c : null,
      qty: i.qty,
      price: i.price,
      discount: i.discount,
      total: lineTotal,
      hpp: i.hpp,
      hppTotal: lineHpp
    };
  });
  return { mapped, subtotal, discount, totalHpp };
}
const _id__put = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const payload = await requireAuth(event);
  const id = getRouterParam(event, "id");
  if (!id) throw createError({ statusCode: 400, message: "Missing id" });
  const body = await readBody(event);
  const parsed = UpdateOrderSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: (_b = (_a = parsed.error.errors[0]) == null ? void 0 : _a.message) != null ? _b : "Validation error" });
  }
  const existing = await prisma.order.findFirst({
    where: { id },
    include: { store: { select: { userId: true } } }
  });
  if (!existing) throw createError({ statusCode: 404, message: "Order not found" });
  if (existing.store.userId !== payload.sub) throw createError({ statusCode: 403, message: "Forbidden" });
  const d = parsed.data;
  const shippingFee = (_c = d.shippingFee) != null ? _c : Number(existing.shippingFee);
  const platformFee = (_d = d.platformFee) != null ? _d : Number(existing.platformFee);
  const affiliateFee = (_e = d.affiliateFee) != null ? _e : Number(existing.affiliateFee);
  let financials = {};
  let itemOps = {};
  if (d.items) {
    const { mapped, subtotal, discount, totalHpp } = calcItems(d.items);
    const total = subtotal - discount;
    const grandTotal = total + shippingFee - platformFee - affiliateFee;
    const netTotal = grandTotal - totalHpp;
    financials = { subtotal, discount, total, grandTotal, totalHpp, netTotal };
    itemOps = {
      items: {
        deleteMany: { orderId: id },
        create: mapped
      }
    };
  } else if (d.shippingFee !== void 0 || d.platformFee !== void 0 || d.affiliateFee !== void 0) {
    Number(existing.subtotal);
    Number(existing.discount);
    const total = Number(existing.total);
    const totalHpp = Number(existing.totalHpp);
    const grandTotal = total + shippingFee - platformFee - affiliateFee;
    const netTotal = grandTotal - totalHpp;
    financials = { grandTotal, netTotal, shippingFee, platformFee, affiliateFee };
  }
  const order = await prisma.order.update({
    where: { id },
    data: {
      ...d.orderNumber !== void 0 ? { orderNumber: d.orderNumber } : {},
      ...d.createdDate !== void 0 ? { createdDate: new Date(d.createdDate) } : {},
      ...d.shippedDate !== void 0 ? { shippedDate: d.shippedDate ? new Date(d.shippedDate) : null } : {},
      ...d.deliveredDate !== void 0 ? { deliveredDate: d.deliveredDate ? new Date(d.deliveredDate) : null } : {},
      ...d.completedDate !== void 0 ? { completedDate: d.completedDate ? new Date(d.completedDate) : null } : {},
      ...d.status !== void 0 ? { status: d.status } : {},
      ...d.cancelBy !== void 0 ? { cancelBy: (_f = d.cancelBy) != null ? _f : null } : {},
      ...d.cancelReason !== void 0 ? { cancelReason: (_g = d.cancelReason) != null ? _g : null } : {},
      ...financials,
      ...itemOps,
      ...d.customer !== void 0 ? d.customer ? { customer: { upsert: { create: d.customer, update: d.customer } } } : { customer: { delete: true } } : {},
      ...d.shipping !== void 0 ? d.shipping ? { shipping: { upsert: { create: d.shipping, update: d.shipping } } } : { shipping: { delete: true } } : {}
    },
    include: { items: true, customer: true, shipping: true }
  });
  return { success: true, message: "Order updated", data: order };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
